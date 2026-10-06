#!/usr/bin/env python3
"""
Prepare website media from the Classic catalogue (CLASSIC (1).pdf).

Every catalogue page is a single flattened 300-dpi JPEG (2480 x 3508), so all
imagery is cropped from those rasters:

  pdfimages -j "CLASSIC (1).pdf" <pages_dir>/p      # -> p-000.jpg … p-018.jpg
  python3 scripts/extract_catalogue_media.py <pages_dir>

Outputs
  public/media/scenes/*    architectural scenes, responsive WebP widths
  public/media/products/*  each product on a uniform stone plate, 4:5 canvas
  public/media/projects/*  project photographs (native resolution)
  public/media/brand/*     crest and leadership portrait
  src/data/media-manifest.json   intrinsic sizes + available widths

Crop boxes are page-pixel coordinates (left, top, right, bottom).
"""
import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "media")
MANIFEST = os.path.join(ROOT, "src", "data", "media-manifest.json")

# Warm stone "plate" every product is photographed against on the site.
# Must match --color-plate in src/styles/index.css.
PLATE = np.array([236, 232, 225], dtype=np.float32) / 255.0

# ---------------------------------------------------------------------------
# Architectural scenes
# ---------------------------------------------------------------------------
SCENES = {
    # Designer Square & Shot Blast Pavers (page 12)
    "square-driveway": (11, (0, 560, 2480, 2000)),
    "square-driveway-portrait": (11, (640, 300, 1880, 2460)),
    "square-water": (11, (0, 1820, 2480, 2460)),
    # Classic Designer Pavers (page 9)
    "hex-driveway": (8, (0, 470, 2480, 1770)),
    "hex-driveway-portrait": (8, (640, 190, 1960, 1770)),
    # Classic Designer Pavers Series 2 (page 10)
    "palm-pathway": (9, (0, 470, 2480, 1655)),
    "palm-pathway-portrait": (9, (560, 200, 1880, 1655)),
    # Classic Designer Wall Tiles Series (page 11)
    "wall-house": (10, (0, 720, 2480, 1770)),
    "wall-house-portrait": (10, (530, 190, 1925, 1770)),
    # Designer Floor Tiles - 25 mm (page 7)
    "interior-floor": (6, (570, 0, 2480, 955)),
    "interior-floor-portrait": (6, (880, 0, 1900, 955)),
    # Designer & Combi Pavers (page 14)
    "combi-render": (13, (0, 400, 2480, 1596)),
    "combi-render-portrait": (13, (450, 330, 1980, 1596)),
    # Kerb Stones & Water Drains (page 15)
    "kerb-road": (14, (0, 625, 2480, 1310)),
    "kerb-road-portrait": (14, (1520, 0, 2480, 1310)),
    # Kerb Stones & Partition / Elevation Jalies (page 17)
    "jali-wall": (16, (0, 705, 2480, 1890)),
    "jali-wall-portrait": (16, (880, 705, 2280, 1890)),
    # Clay Decorative Tiles (page 18)
    "clay-courtyard": (17, (90, 485, 2390, 3030)),
    "clay-courtyard-landscape": (17, (90, 1300, 2390, 3030)),
    # Building blocks (page 13)
    "blocks-site": (12, (1360, 0, 2480, 1060)),
    # Cover still life (page 1)
    "collection-still-life": (0, (0, 1490, 2480, 3300)),
}
SCENE_WIDTHS = [640, 1024, 1600, 2400]

# ---------------------------------------------------------------------------
# Products: id -> (page, crop box, options)
#   inpaint: label rectangles (page coords) whose brown/red text is removed
#   occ:     (width, height) occupancy of the 4:5 canvas
#   gamma:   >1 deepens mid-tones for pale concrete on a pale plate
# ---------------------------------------------------------------------------
FLOOR = {"occ": (0.78, 0.66)}
PAVER = {"occ": (0.74, 0.62)}
CONCRETE = {"occ": (0.76, 0.64), "gamma": 1.12}
CLAY = {"occ": (0.52, 0.66), "lift": (0.84, 0.93)}

PRODUCTS = {
    # Designer Floor Tiles - 25 mm (page 7)
    "scorpio": (6, (200, 1380, 668, 1752), FLOOR),
    "mercury": (6, (737, 1380, 1207, 1752), FLOOR),
    "matrix": (6, (1282, 1380, 1748, 1752), FLOOR),
    "vaibhav": (6, (1815, 1380, 2282, 1752), FLOOR),
    "casino": (6, (200, 1990, 668, 2382), FLOOR),
    "innova": (6, (737, 1990, 1207, 2382), FLOOR),
    "new-arien": (6, (1282, 1990, 1748, 2382), FLOOR),
    "dollar": (6, (1815, 1990, 2282, 2382), FLOOR),
    # Designer Floor Tiles - 25 mm (page 8)
    "13-box": (7, (232, 1335, 680, 1700), FLOOR),
    "nitco": (7, (752, 1335, 1205, 1700), FLOOR),
    "taurus": (7, (1282, 1335, 1730, 1700), FLOOR),
    "granito": (7, (1800, 1335, 2248, 1700), FLOOR),
    "chatura": (7, (232, 1925, 680, 2305), {**FLOOR, "erase": [(560, 2070, 680, 2122), (566, 2190, 668, 2245)]}),
    "smart-button": (7, (752, 1925, 1205, 2305), FLOOR),
    "polo": (7, (1282, 1925, 1730, 2305), FLOOR),
    "six-box": (7, (1800, 1925, 2248, 2305), FLOOR),
    # Classic Designer Pavers (page 9)
    "i-block": (8, (330, 1850, 1010, 2236), PAVER),
    "zig-zag": (8, (1500, 1880, 2120, 2330), {**PAVER, "erase": [(1250, 2235, 1615, 2400)]}),
    "barbie": (8, (330, 2520, 960, 2962), {**PAVER, "erase": [(120, 2895, 475, 3050)]}),
    "hexagonal": (8, (1500, 2490, 2090, 2900), PAVER),
    # Classic Designer Pavers Series 2 (page 10)
    "triarc": (9, (150, 1795, 880, 2272), PAVER),
    "combi-pavers": (9, (980, 1840, 1440, 2275), {"occ": (0.6, 0.56)}),
    "hexagonal-y-shape": (9, (1620, 1880, 2350, 2275), PAVER),
    "grass-paver-block": (9, (190, 2465, 710, 2995), {**PAVER, "gamma": 1.1}),
    "rock": (9, (880, 2575, 1500, 2925), PAVER),
    # Lattice grass paver: clearer on page 16's white panel than on page 10
    "grass-paver-lattice": (15, (1646, 2266, 2354, 2798), {**CONCRETE, "erase": [(1650, 2648, 2354, 2798)]}),
    # Classic Designer Wall Tiles Series (page 11)
    "hurricane": (10, (330, 1865, 975, 2240), PAVER),
    "swathi": (10, (1420, 1855, 2110, 2240), PAVER),
    "zigma": (10, (320, 2485, 985, 2895), PAVER),
    "varsha": (10, (1440, 2495, 2100, 2895), PAVER),
    # Designer Square & Shot Blast Pavers (page 12)
    "square-paver-200": (11, (10, 2740, 515, 3205), {"occ": (0.7, 0.6), "flat": True}),
    "square-paver-100": (11, (560, 2755, 1000, 3190), {"occ": (0.66, 0.56), "flat": True}),
    "square-paver-150": (11, (1080, 2755, 1470, 3190), {"occ": (0.62, 0.52), "flat": True}),
    "square-paver-150-charcoal": (11, (1525, 2755, 1955, 3190), {"occ": (0.62, 0.52), "flat": True}),
    "shot-blast-paver": (11, (2005, 2755, 2440, 3190), {"occ": (0.66, 0.56), "flat": True}),
    # Building blocks & bollards (page 13)
    "wall-compound-block": (12, (170, 1100, 720, 1585), CONCRETE),
    "partition-block-225": (12, (960, 1150, 1460, 1625), CONCRETE),
    "partition-block-300": (12, (1730, 1150, 2230, 1575), CONCRETE),
    "bollard-01": (12, (280, 1830, 660, 2268), {**CONCRETE, "occ": (0.6, 0.7)}),
    "bollard-02": (12, (1075, 1830, 1365, 2268), {**CONCRETE, "occ": (0.6, 0.7)}),
    "bollard-03": (12, (1850, 1815, 2165, 2272), {**CONCRETE, "occ": (0.6, 0.7), "erase": [(1850, 1815, 1885, 1900)]}),
    # Kerb Stones & Water Drains (page 15)
    "ghmc": (14, (110, 1706, 818, 2218), {**CONCRETE, "inpaint": [(110, 2085, 560, 2205)]}),
    "metro": (14, (878, 1706, 1586, 2218), {**CONCRETE, "inpaint": [(886, 2085, 1226, 2205)]}),
    "kerb-300-600-110": (14, (1646, 1706, 2354, 2218), {**CONCRETE, "inpaint": [(1654, 2085, 1990, 2205)]}),
    "kerb-450-450-110": (14, (110, 2266, 818, 2798), {**CONCRETE, "inpaint": [(110, 2665, 446, 2780)]}),
    "kerb-600-300-100": (14, (878, 2266, 1586, 2798), {**CONCRETE, "inpaint": [(894, 2665, 1242, 2780)]}),
    "water-drain": (14, (1646, 2266, 2354, 2798), {**CONCRETE, "inpaint": [(1660, 2665, 2020, 2780)]}),
    # Kerb Stones & Water Drains (page 16)
    "kerb-600-450-120": (15, (110, 1706, 818, 2218), {**CONCRETE, "inpaint": [(110, 2085, 460, 2205)]}),
    "kerb-600-300-110": (15, (878, 1706, 1586, 2218), {**CONCRETE, "inpaint": [(890, 2085, 1220, 2205)]}),
    "matt-finishing": (15, (1646, 1706, 2354, 2218), {**CONCRETE, "inpaint": [(1736, 2085, 2076, 2205)], "erase": [(1646, 2075, 1736, 2218)]}),
    "saucer-drain-75": (15, (110, 2266, 818, 2798), {**CONCRETE, "inpaint": [(110, 2665, 556, 2780)]}),
    "saucer-drain-150": (15, (878, 2266, 1586, 2798), {**CONCRETE, "inpaint": [(896, 2665, 1446, 2780)]}),
    # Kerb Stones & Partition / Elevation Jalies (page 17)
    "kerb-stone-150": (16, (130, 2000, 780, 2450), CONCRETE),
    "kerb-stone-600-325-120": (16, (900, 2000, 1580, 2450), CONCRETE),
    "bullnose": (16, (1690, 2000, 2375, 2450), CONCRETE),
    "grass-paver-300": (16, (130, 2680, 780, 3160), CONCRETE),
    "jali-01": (16, (1040, 2690, 1460, 3142), {**CONCRETE, "occ": (0.64, 0.64)}),
    "jali-02": (16, (1785, 2690, 2275, 3148), {**CONCRETE, "occ": (0.64, 0.64)}),
    # Clay Decorative Tiles (page 19)
    "clay-ec": (18, (445, 225, 620, 595), CLAY),
    "clay-plain": (18, (1010, 220, 1185, 615), CLAY),
    "clay-adr": (18, (1545, 220, 1756, 630), CLAY),
    "clay-mmr": (18, (2130, 225, 2315, 645), CLAY),
    "clay-smr": (18, (415, 880, 630, 1250), CLAY),
    "clay-pgi": (18, (955, 880, 1188, 1260), CLAY),
    "clay-dpd": (18, (1530, 880, 1770, 1270), CLAY),
    "clay-ttb": (18, (2090, 860, 2322, 1245), CLAY),
    "clay-mrt": (18, (405, 1550, 625, 1880), CLAY),
    "clay-3sph": (18, (965, 1575, 1195, 1905), CLAY),
    "clay-jd-il": (18, (1560, 1590, 1758, 1905), CLAY),
    "clay-3adr-8x5": (18, (2105, 1565, 2318, 1920), CLAY),
    "clay-3dsp": (18, (400, 2185, 625, 2545), CLAY),
    "clay-3ddp": (18, (960, 2175, 1200, 2535), CLAY),
    "clay-rt": (18, (1535, 2185, 1740, 2550), CLAY),
    "clay-4adr": (18, (2125, 2185, 2318, 2530), CLAY),
    "clay-3adr-9x6": (18, (425, 2825, 635, 3165), CLAY),
    "clay-3dpd": (18, (996, 2825, 1176, 3170), CLAY),
}

# Secondary product views (wide canvases)
PRODUCT_VIEWS = {
    "combi-pavers-sizes": (13, (200, 2470, 2200, 3078), {"occ": (0.9, 0.8), "erase": [(900, 2420, 1570, 2540)], "canvas": (1600, 900)}),
}

# Project photographs (page 3), inside the gold frames, clear of burned-in captions
PROJECTS = {
    "telangana-secretariat": (2, (396, 1404, 730, 1582)),
    "cm-camp-office": (2, (1070, 1210, 1405, 1448)),
    "metro-miyapur": (2, (1750, 1360, 2088, 1556)),
    "road-side-pathway": (2, (390, 1995, 735, 2245)),
    "secunderabad-railway-station": (2, (1070, 2220, 1405, 2472)),
    "ameerpet-metro-office": (2, (1750, 2005, 2088, 2205)),
    "shilparamam": (2, (396, 2626, 728, 2830)),
    "jubilee-hills-road-36": (2, (1750, 2630, 2088, 2836)),
}

BRAND = {
    "crest": (0, (930, 100, 1570, 545)),
    "leadership": (1, (420, 560, 2120, 1880)),
}


# ---------------------------------------------------------------------------
# Numeric helpers (numpy only)
# ---------------------------------------------------------------------------
def box_blur(a, r):
    """Mean filter of radius r on a 2-D array via an integral image."""
    if r <= 0:
        return a.copy()
    p = np.pad(a, ((r + 1, r), (r + 1, r)), mode="edge").astype(np.float64)
    c = p.cumsum(0).cumsum(1)
    k = 2 * r + 1
    s = c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]
    return (s / (k * k)).astype(np.float32)


def soft_blur(a, r):
    return box_blur(box_blur(box_blur(a, r), r), r)


def dilate(mask, r):
    return box_blur(mask.astype(np.float32), r) > 1e-3


def erode(mask, r):
    return box_blur(mask.astype(np.float32), r) > 1 - 1e-3


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def fit_background(img, band=0.06, iters=3):
    """Quadratic surface per channel fitted to the crop border (robust)."""
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xn, yn = xx / w - 0.5, yy / h - 0.5
    bw, bh = max(3, int(w * band)), max(3, int(h * band))
    border = np.zeros((h, w), bool)
    border[:bh, :] = border[-bh:, :] = True
    border[:, :bw] = border[:, -bw:] = True
    feats = np.stack([np.ones_like(xn), xn, yn, xn * xn, xn * yn, yn * yn], -1)
    sel = border.copy()
    out = np.empty_like(img)
    for ch in range(3):
        s = sel.copy()
        v = img[..., ch]
        for _ in range(iters):
            A, b = feats[s], v[s]
            coef, *_ = np.linalg.lstsq(A, b, rcond=None)
            pred = feats @ coef
            res = v - pred
            mad = np.median(np.abs(res[s])) + 1e-4
            s = border & (np.abs(res) < 3.0 * mad * 1.4826)
        out[..., ch] = pred
    return np.clip(out, 0.05, 1.0)


def text_mask(img, rect_local):
    """Brown label text inside a rectangle. The concrete and studio backdrop are
    neutral-to-cool (R-B <= 0), the type is warm (R-B ~ +0.05…0.15); the dilation
    swallows the anti-aliased edge and JPEG halo."""
    x0, y0, x1, y1 = rect_local
    m = np.zeros(img.shape[:2], bool)
    sub = img[y0:y1, x0:x1]
    m[y0:y1, x0:x1] = (sub[..., 0] - sub[..., 2]) > 0.02
    return dilate(m, 9)


def push_pull(img, valid):
    """Fill invalid pixels from a weighted image pyramid (handles holes of any size)."""
    h, w, _ = img.shape
    if valid.all() or min(h, w) < 2:
        return img
    ph, pw = h + h % 2, w + w % 2
    vi = np.pad(valid.astype(np.float32), ((0, ph - h), (0, pw - w)))
    ci = np.pad(img * valid[..., None], ((0, ph - h), (0, pw - w), (0, 0)))
    wsum = vi.reshape(ph // 2, 2, pw // 2, 2).sum((1, 3))
    csum = ci.reshape(ph // 2, 2, pw // 2, 2, 3).sum((1, 3))
    small = push_pull(csum / np.maximum(wsum, 1e-6)[..., None], wsum > 0)
    up = small.repeat(2, 0).repeat(2, 1)[:h, :w]
    return np.where(valid[..., None], img, up)


def inpaint(img, mask, iters=300):
    out = push_pull(img, ~mask)
    for _ in range(iters):  # relax the pyramid's block seams
        avg = (np.roll(out, 1, 0) + np.roll(out, -1, 0) + np.roll(out, 1, 1) + np.roll(out, -1, 1)) / 4
        out[mask] = avg[mask]
    return out


def to_local(rect, box):
    x0, y0 = box[0], box[1]
    w, h = box[2] - box[0], box[3] - box[1]
    lx0, ly0 = max(0, rect[0] - x0), max(0, rect[1] - y0)
    lx1, ly1 = min(w, rect[2] - x0), min(h, rect[3] - y0)
    if lx1 <= lx0 or ly1 <= ly0:
        return None
    return lx0, ly0, lx1, ly1


# ---------------------------------------------------------------------------
# Writers
# ---------------------------------------------------------------------------
pages = {}


def page(i):
    if i not in pages:
        pages[i] = Image.open(os.path.join(PAGES_DIR, f"p-{i:03d}.jpg")).convert("RGB")
    return pages[i]


def save_webp(im, path, quality=80):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)


def export_scene(key, pg, box, manifest):
    im = page(pg).crop(box)
    widths = [w for w in SCENE_WIDTHS if w <= im.width] or [im.width]
    if im.width > widths[-1] and im.width - widths[-1] > 200:
        widths.append(im.width)
    for w in widths:
        h = round(im.height * w / im.width)
        save_webp(im.resize((w, h), Image.LANCZOS), os.path.join(OUT, "scenes", f"{key}-{w}.webp"), 78)
    manifest["scenes"][key] = {"w": im.width, "h": im.height, "widths": widths}


def plate_product(pg, box, opts):
    src = np.asarray(page(pg).crop(box), dtype=np.float32) / 255.0
    for rect in opts.get("inpaint", []):
        loc = to_local(rect, box)
        if loc:
            src = inpaint(src, text_mask(src, loc))
    if opts.get("flat"):
        edge = np.concatenate([src[:6].reshape(-1, 3), src[-6:].reshape(-1, 3), src[:, :6].reshape(-1, 3), src[:, -6:].reshape(-1, 3)])
        bg = np.percentile(edge, 90, axis=0)[None, None, :] * np.ones_like(src)
    else:
        bg = fit_background(src)
    norm = np.clip(src / bg, 0, 1)
    for rect in opts.get("erase", []):
        loc = to_local(rect, box)
        if loc:
            x0, y0, x1, y1 = loc
            norm[y0:y1, x0:x1] = 1.0
    norm = norm ** opts.get("gamma", 1.0)

    # Product mask: anything noticeably darker than the plate in any channel;
    # opening removes hairline drawings and stray JPEG noise.
    dark = 1.0 - norm.min(axis=2)
    m = dark > 0.07
    m = dilate(erode(m, 3), 3)
    keep = soft_blur(dilate(m, 14).astype(np.float32), 6)
    # Clean near-white noise, then fade everything outside the product to plate
    lum = norm.mean(axis=2)
    lo, hi = opts.get("lift", (0.94, 0.99))
    lift = smoothstep(lo, hi, lum)[..., None]
    norm = norm * (1 - lift) + lift
    norm = norm * keep[..., None] + (1 - keep[..., None])

    ys, xs = np.where(m)
    if len(xs) < 50:
        raise SystemExit(f"no product detected in {box}")
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()

    cw, ch = opts.get("canvas", (900, 1125))
    ow, oh = opts.get("occ", (0.76, 0.64))
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    scale = min(ow * cw / bw, oh * ch / bh)
    region = (np.clip(norm[y0:y1 + 1, x0:x1 + 1], 0, 1) * 255).astype(np.uint8)
    rim = Image.fromarray(region).resize((max(1, round(bw * scale)), max(1, round(bh * scale))), Image.LANCZOS)
    canvas = np.ones((ch, cw, 3), np.float32)
    px = (cw - rim.width) // 2
    py = int(ch * 0.49 - rim.height / 2)
    canvas[py:py + rim.height, px:px + rim.width] = np.asarray(rim, np.float32) / 255.0
    out = np.clip(canvas * PLATE, 0, 1)
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8))


def export_product(key, pg, box, opts, manifest):
    im = plate_product(pg, box, opts)
    widths = [480, im.width] if im.width > 480 else [im.width]
    for w in widths:
        h = round(im.height * w / im.width)
        save_webp(im.resize((w, h), Image.LANCZOS), os.path.join(OUT, "products", f"{key}-{w}.webp"), 84)
    manifest["products"][key] = {"w": im.width, "h": im.height, "widths": widths}


def export_project(key, pg, box, manifest):
    im = page(pg).crop(box)
    save_webp(im, os.path.join(OUT, "projects", f"{key}-{im.width}.webp"), 86)
    manifest["projects"][key] = {"w": im.width, "h": im.height, "widths": [im.width]}


def export_crest(pg, box, manifest):
    """Lift the crest off the white marble cover by flood-filling the background."""
    rgb = np.asarray(page(pg).crop(box), dtype=np.float32) / 255.0
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    bglike = (mn > 0.8) & (sat < 0.1)
    seed = np.zeros_like(bglike)
    seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
    seed &= bglike
    for _ in range(2000):
        grown = dilate(seed, 1) & bglike
        if (grown == seed).all():
            break
        seed = grown
    alpha = soft_blur((~seed).astype(np.float32), 1)
    rgba = np.dstack([rgb, alpha])
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8))
    bbox = im.getbbox()
    im = im.crop(bbox)
    os.makedirs(os.path.join(OUT, "brand"), exist_ok=True)
    for w in (160, 320):
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, "brand", f"crest-{w}.webp"), "WEBP", quality=90, method=6)
    im.resize((64, round(im.height * 64 / im.width)), Image.LANCZOS).save(os.path.join(ROOT, "public", "favicon.png"))
    manifest["brand"]["crest"] = {"w": im.width, "h": im.height, "widths": [160, 320]}


def main():
    manifest = {"scenes": {}, "products": {}, "projects": {}, "brand": {}}
    for sub in manifest:
        d = os.path.join(OUT, sub)
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.endswith(".webp"):
                    os.remove(os.path.join(d, f))
    for k, (pg, box) in SCENES.items():
        export_scene(k, pg, box, manifest)
    for k, (pg, box, opts) in {**PRODUCTS, **PRODUCT_VIEWS}.items():
        export_product(k, pg, box, opts, manifest)
    for k, (pg, box) in PROJECTS.items():
        export_project(k, pg, box, manifest)
    export_crest(*BRAND["crest"], manifest)
    export_scene("leadership", *BRAND["leadership"], manifest)
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=1)
    print(f"scenes {len(manifest['scenes'])} · products {len(manifest['products'])} · projects {len(manifest['projects'])}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    PAGES_DIR = sys.argv[1]
    main()
