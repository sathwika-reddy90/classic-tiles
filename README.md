# Classic Hyderabad — website

Corporate website for Classic Hyderabad (Classic Designer Tiles (P) Ltd. / Classic Plasto Crafts), built from the company catalogue `CLASSIC (1).pdf`, which is the source of truth for every product, dimension, project and contact detail on the site.

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 8 · Lenis (smooth scroll)

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/
```

The site is a single-page app with two routes, `/` and `/products`. When deploying, configure the host to serve `index.html` for unknown paths (SPA fallback) so `/products` links work on a hard refresh.

## Structure

```
src/
  data/            content — edit these, not the components
    products.ts      75 products: name, category, collections, dimensions, specs, images
    collections.ts   10 catalogue sections, 7 filter categories, 9 homepage chapters
    projects.ts      photographed projects + the three client registers (74 entries)
    company.ts       contact details, group companies, leadership, recognitions
    applications.ts  homepage "Application" sectors
    media-manifest.json   generated — image sizes and widths
  components/
    layout/   Navbar, MobileMenu, EnquiryDrawer, Footer, Wordmark (the crest)
    home/     Hero, AtAGlance, ClientMarquee, BrandStory, Leadership, CategoryShowcase, FeaturedProducts,
              ApplicationSection, ProjectShowcase, MaterialStory, FinalCTA
    products/ FilterBar, CollectionGroup, ProductCard, ProductDetail
    ui/       Img, Button, Typography (Eyebrow, Lines, Arrow), TextMotion (CountUp, RotatingWord)
  pages/      Home, Products, NotFound
  hooks/      scroll frame / parallax, reveal observer, media queries, focus trap
  lib/        smooth scroll + scroll lock, page transitions, enquiry context, media URLs
  styles/index.css   design tokens (@theme), type scale, buttons, motion
scripts/extract_catalogue_media.py   catalogue → web images
scripts/make_hero_cutouts.py         product renders → transparent paver cutouts for the hero
```

The Products page keeps its state in the URL: `?category=pavers`, `?chapter=kerb-jalies`, `?p=scorpio` (open product). Every view can be shared as a link.

## Images

Every catalogue page is a single flattened 300-dpi JPEG, so all imagery is cropped from the page rasters. The script crops each scene and product, removes printed labels, normalises every product onto one stone "plate" colour, and writes responsive WebP files plus `media-manifest.json`:

```bash
pdfimages -j "CLASSIC (1).pdf" /tmp/classic-pages/p     # poppler
npm run media -- /tmp/classic-pages                      # needs Python 3 + Pillow + numpy
```

Crop boxes are page-pixel coordinates in `SCENES` / `PRODUCTS` / `PROJECTS` at the top of the script. The plate colour `PLATE` must match `--color-plate` in `src/styles/index.css`.

The homepage hero is set in the catalogue's page-9 driveway, laid in Hexagonal pavers, and stages the Hexagonal paver laid in it as a transparent cutout of its catalogue render, made by `scripts/make_hero_cutouts.py`. After `npm run media` also run:

```bash
npm run media:hero     # needs scipy as well
```

## Adding a product

1. Add a crop to `PRODUCTS` in `scripts/extract_catalogue_media.py` (or drop a new photo in and add an entry) and run `npm run media`.
2. Append an entry to `products` in `src/data/products.ts`. Image keys are type-checked against the manifest, so a missing image fails the build.

## Content rules

Only information printed in the catalogue is used. Three spelling corrections are applied (Bollerd → Bollard, Sausar → Saucer, Short Blast → Shot Blast); paver "Area" values are reproduced as printed (no unit is given). The catalogue publishes no e-mail address, so the Enquire panel routes to the published phone numbers, address and websites.
