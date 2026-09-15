# Full Interior Designs Kenya

Marketing website for Full Interior Designs Kenya — interior design, renovations, exterior finishing, gypsum ceilings & feature walls, recessed & mirror lighting, wardrobe assemblies and kitchen cabinet fit-outs for homeowners across Kenya.

## Structure

- `index.html` — Home (hero, photo slideshow, services teaser, work teaser, coverage teaser)
- `services.html` — Full service list, gypsum + lighting detail, process
- `work.html` — Filterable project gallery
- `about.html` — Company story and nationwide coverage
- `contact.html` — Contact details and WhatsApp/email quote form
- `styles.css`, `script.js` — Shared styles and behavior across all pages
- `images/` — Project photos
- `favicon.svg` — Site icon (golden LED-strip logo mark)
- `robots.txt`, `sitemap.xml` — SEO

## Notes

- Static site, no build step — open `index.html` directly or serve the folder with any static host.
- Light mode is the default theme; dark mode is available via the toggle in the nav (persisted in `localStorage`).
- The "years in business" figures on the site are computed live from a `FOUNDED_YEAR` constant at the top of `script.js`, so they increment automatically each year.
- `robots.txt`, `sitemap.xml`, and the canonical/Open Graph URLs in each page's `<head>` currently point at the site's Claude Artifact URL — update these once the site is live on its own domain.
- Contact: WhatsApp/phone 0790 702089 · fullinterior.ke@gmail.com
