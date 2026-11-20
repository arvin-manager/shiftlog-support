# ShiftLog website

Static GitHub Pages site for ShiftLog. The product pages are plain HTML and work without JavaScript. They use a shared stylesheet and localized screenshots.

- English at the root, with `zh-tw.html`, `ja.html`, `ko.html`, and `de.html` as alternate locales. Keep each page's canonical URL and reciprocal language links in sync.
- `rotating-shift-tw.html` generates a 30-day 2-on, 2-off schedule in Traditional Chinese. Its examples are readable without JavaScript. Shared schedules use a URL fragment to keep the date out of the page request.
- `sitemap.xml` lists the product pages and rotation guide.
- Existing support and privacy URLs still use `?lang=`. Old homepage language URLs redirect to the corresponding product pages.
- Download buttons and Safari Smart App Banners share the `shiftlog_web` App Store Connect campaign. Traditional Chinese download buttons point to the Taiwan storefront. The website uses no third-party tracking scripts or tracking cookies.

GitHub Pages publishes the support repository's main branch from its root.
