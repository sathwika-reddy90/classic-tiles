#!/usr/bin/env python3
"""
Cut catalogue pavers off their stone plate for the homepage campaign hero.

The hero is set in the catalogue's own page-12 scene (a driveway laid in
Designer Square & Shot Blast Pavers), so the samples in front of it are the
products printed under that scene. The product images in
public/media/products/ are the catalogue shots multiplied onto a flat PLATE
colour (see extract_catalogue_media.py), so the plate can be divided back out:

  object  — the tile itself (clearly darker or more saturated than the plate)
            → kept at full opacity in its own colour
  shadow  — the soft, neutral darkening a 3D render casts around it
            → kept as black at partial opacity

Flat, front-on product shots ("flat") carry no cast shadow worth keeping;
the hero tilts them into perspective and draws their thickness in CSS.

  npm run media:hero        # needs Python 3 + Pillow + numpy + scipy

extract_catalogue_media.py rewrites the manifest from scratch, so run this
again after `npm run media`.

Writes public/media/hero/<key>-cut-<width>.webp (WebP with alpha) and adds a
"hero" group to src/data/media-manifest.json.
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "media", "products")
OUT = os.path.join(ROOT, "public", "media", "hero")
MANIFEST = os.path.join(ROOT, "src", "data", "media-manifest.json")

PLATE = np.array([236, 232, 225], dtype=np.float32) / 255.0

# How the tile is told apart from its shadow, which is as dark as a grey tile:
#   "colour"  — the tile is saturated; the shadow is neutral
#   "texture" — the tile is cast stone with a surface grain; the shadow is smooth
#   "flat"    — a front-on shot with no cast shadow: anything darker than the plate
# plus the darkness floor a pixel needs. Pale stone renders (Scorpio, Granito)
# carry a grainy reflection strip as dark as their own top face and do not cut
# cleanly, so they are left out.
PRODUCTS = {
    "hexagonal": ("texture", 0.2),
}
# Flat shots only: the polygon mask and edge trims for awkward photographs
# (none of the current hero products need them).
POLYGON: dict = {}
# Colours the catalogue lays a product in but only photographs in one: the
# render's shading is kept and re-based on each colour (sRGB, 0–1).
RECOLOUR = {"hexagonal": {"yellow": (0.8, 0.7, 0.42), "red": (0.66, 0.29, 0.23)}}
TRIM: dict = {}
WIDTHS = (480, 900)


def cutout(key, mode, floor):
    img = np.asarray(Image.open(os.path.join(SRC, f"{key}-900.webp")).convert("RGB"), np.float32) / 255.0
    norm = np.clip(img / PLATE, 0, 1)
    dark = 1 - norm.min(axis=2)
    sat = norm.max(axis=2) - norm.min(axis=2)

    if mode == "colour":
        seed = sat > 0.12
    elif mode == "flat":
        seed = (dark > floor) | (sat > 0.12)
    else:
        lum = norm.mean(axis=2)
        grain = np.sqrt(np.maximum(ndimage.uniform_filter(lum**2, 5) - ndimage.uniform_filter(lum, 5) ** 2, 0))
        seed = (dark > floor) & (ndimage.uniform_filter(grain, 9) > 0.012)
    seed = ndimage.binary_opening(seed, iterations=2)
    seed = ndimage.binary_closing(seed, iterations=4)
    seed = ndimage.binary_fill_holes(seed)
    if mode in ("texture", "flat"):
        # Once the body is solid, a wider opening trims the thin reflection
        # strip or backdrop edge some shots carry along their lower edges.
        seed = ndimage.binary_opening(
            seed, structure=np.ones((3, 3)), iterations=6 if mode == "texture" else 12
        )
    if key in POLYGON:
        poly = Image.new("L", (img.shape[1], img.shape[0]), 0)
        ImageDraw.Draw(poly).polygon(POLYGON[key], fill=1)
        seed = np.asarray(poly, bool)
    labels, n = ndimage.label(seed)
    if n == 0:
        raise SystemExit(f"{key}: no product found")
    sizes = ndimage.sum(seed, labels, range(1, n + 1))
    # Renders may break into a few real pieces; a flat shot is one tile, so
    # anything beside its largest piece is backdrop or reflection.
    keep = sizes >= sizes.max() if mode == "flat" else sizes > sizes.max() * 0.08
    seed = np.isin(labels, 1 + np.flatnonzero(keep))

    # Feathered object matte; one pixel of erosion drops the plate-mixed rim.
    obj = ndimage.gaussian_filter(ndimage.binary_erosion(seed, iterations=1).astype(np.float32), 0.8)
    shadow = np.clip((1 - norm.mean(axis=2)) * 1.25, 0, 1)
    shadow = ndimage.gaussian_filter(shadow, 1.5) * (1 - obj) * (mode != "flat")

    alpha = obj + shadow
    rgb = img * obj[..., None] / np.maximum(alpha, 1e-4)[..., None]
    rgba = np.dstack([rgb, alpha])
    variants = {}
    for name, colour in RECOLOUR.get(key, {}).items():
        # Keep the render's light and grain, carried in its luminance, on a new base colour.
        lum = img.mean(axis=2)
        lo, hi = np.percentile(lum[obj > 0.5], [3, 97])
        t = np.clip((lum - lo) / max(hi - lo, 1e-4), 0, 1)
        tinted = np.clip(np.array(colour)[None, None, :] * (0.72 + 0.4 * t)[..., None], 0, 1)
        vrgb = tinted * obj[..., None] / np.maximum(alpha, 1e-4)[..., None]
        variants[name] = np.dstack([vrgb, alpha])

    ys, xs = np.where(alpha > 0.02)
    pad = 2 if mode == "flat" else 12
    y0, y1 = max(0, ys.min() - pad), min(alpha.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(alpha.shape[1], xs.max() + pad)
    rgba = rgba[y0:y1, x0:x1]
    right, bottom, top = TRIM.get(key, (0, 0, 0))
    crop = lambda a: a[y0:y1, x0:x1][top : y1 - y0 - bottom, : x1 - x0 - right]
    to_im = lambda a: Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")
    return to_im(rgba[top : rgba.shape[0] - bottom, : rgba.shape[1] - right]), {n: to_im(crop(v)) for n, v in variants.items()}


def save_widths(im, stem, widths, folder, quality):
    done = []
    for w in widths:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(folder, f"{stem}-{w}.webp"), "WEBP", quality=quality, method=6)
        done.append(w)
    return {"w": im.width, "h": im.height, "widths": sorted(set(done))}


# Images supplied outside the catalogue rasters, exported as scenes:
# key -> source file in scripts/sources/.
SUPPLIED = {"leadership-named": "leadership-named.png"}


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(MANIFEST) as f:
        manifest = json.load(f)
    for key, name in SUPPLIED.items():
        im = Image.open(os.path.join(ROOT, "scripts", "sources", name)).convert("RGB")
        scenes = os.path.join(ROOT, "public", "media", "scenes")
        manifest["scenes"][key] = save_widths(im, key, (640, im.width), scenes, 88)
        print(f"{key}: {im.width}x{im.height}")
    group = {}
    for key, (mode, floor) in PRODUCTS.items():
        im, variants = cutout(key, mode, floor)
        group[f"{key}-cut"] = save_widths(im, f"{key}-cut", WIDTHS, OUT, 86)
        for name, v in variants.items():
            group[f"{key}-{name}-cut"] = save_widths(v, f"{key}-{name}-cut", WIDTHS, OUT, 86)
        print(f"{key}: {im.width}x{im.height}")
    manifest["hero"] = group
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
