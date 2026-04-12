# lucabarbato.com — personal academic website

Single-page static site for Luca Barbato (PhD candidate, LSE).
Plain HTML + CSS + vanilla JS. No build step, no dependencies, no framework.

## File layout

```
index.html        — the entire page (all sections live here)
styles.css        — design tokens + section styles
main.js           — theme toggle, mobile nav, scroll-spy, reveal animations
assets/
  avatar.jpg      — headshot
  cv.pdf          — downloadable CV
  favicon.svg     — "LB" monogram
CNAME             — custom domain (lucabarbato.com)
robots.txt        — allow all + sitemap reference
sitemap.xml       — single-URL sitemap (bump <lastmod> when you publish updates)
.nojekyll         — tells GitHub Pages to serve files as-is, no Jekyll pass
```

## Preview locally

Any static file server works. Simplest:

```sh
cd ~/luca/website
python3 -m http.server 8000
# open http://localhost:8000
```

## Edit content

Every placeholder is commented with `<!-- PLACEHOLDER: ... -->` (or `// PLACEHOLDER`). To list them all:

```sh
grep -rn PLACEHOLDER .
```

### Add a new working paper

Open [index.html](index.html), find `<!-- Working Papers -->`, and duplicate the `paper-card` block:

```html
<article class="paper-card">
  <div class="paper-card__head">
    <h4 class="paper-card__title">Your paper title</h4>
    <span class="status status--wip">Work in Progress</span>
    <!-- status classes: status--wip | status--review | status--published -->
  </div>
  <p class="paper-card__coauthors">with Coauthor A, Coauthor B</p>
  <details class="paper-card__abstract">
    <summary>Abstract</summary>
    <p>Your abstract goes here.</p>
  </details>
  <div class="paper-card__links">
    <a class="link" href="assets/paper-slug.pdf">PDF</a>
    <a class="link" href="https://example.com/ssrn-link" target="_blank" rel="noopener">SSRN</a>
  </div>
</article>
```

Drop the PDF into `assets/` (name lowercase-with-hyphens) and link to it.

### Add a new course

Find the Teaching section and duplicate the `course-card` block:

```html
<article class="course-card">
  <div class="course-card__meta">
    <span class="course-card__code">MG###</span>
    <span class="course-card__years">2025 – 2026</span>
  </div>
  <h3 class="course-card__title">Course title</h3>
  <p class="course-card__role">Your role (years)</p>
  <p class="course-card__desc">One-sentence description.</p>
  <div class="course-card__links">
    <a class="link" href="https://..." target="_blank" rel="noopener">Course page</a>
  </div>
</article>
```

### Swap the CV or headshot

- Replace `assets/cv.pdf` — keep the filename; any link pointing at `assets/cv.pdf` picks up the new file automatically.
- Replace `assets/avatar.jpg` — square image, 600×600 or larger works well.

### Change social/contact links

Search for `<!-- PLACEHOLDER: Replace href="#" with ... -->` in [index.html](index.html). Three cards have `href="#"`: LinkedIn, Google Scholar, Twitter/X. Fill them in or delete the card entirely.

### Re-theme colours

Edit the `:root { ... }` block at the top of [styles.css](styles.css). All section styles reference the `--bg`, `--text`, `--accent`, etc. variables, so changing them re-themes the whole site at once. The `:root[data-theme="dark"]` block below controls dark-mode colours.

## Deploy

### One-time: create repo + enable Pages

```sh
cd ~/luca/website
# repo has already been git init'd with a first commit.
git remote add origin git@github.com:barbatoluca/lucabarbato-website.git   # adjust name
git push -u origin main
```

Then on GitHub:
1. **Settings → Pages**.
2. **Source**: Deploy from a branch — `main` / root (`/`).
3. Save. The first build runs in ~60 seconds. Subsequent pushes to `main` auto-deploy.

### Connect lucabarbato.com (Cloudflare Registrar)

Because the domain is registered on Cloudflare, DNS is managed from the same dashboard.

1. **Cloudflare → DNS → Records**, add:

   | Type  | Name | Content                 | Proxy     |
   |-------|------|-------------------------|-----------|
   | A     | @    | 185.199.108.153         | DNS only  |
   | A     | @    | 185.199.109.153         | DNS only  |
   | A     | @    | 185.199.110.153         | DNS only  |
   | A     | @    | 185.199.111.153         | DNS only  |
   | AAAA  | @    | 2606:50c0:8000::153     | DNS only  |
   | AAAA  | @    | 2606:50c0:8001::153     | DNS only  |
   | AAAA  | @    | 2606:50c0:8002::153     | DNS only  |
   | AAAA  | @    | 2606:50c0:8003::153     | DNS only  |
   | CNAME | www  | barbatoluca.github.io   | DNS only  |

   **Important:** set every row's **Proxy status** to *DNS only* (grey cloud). GitHub Pages' TLS certificate issuance will not complete while Cloudflare proxies the records.

2. **GitHub → repo → Settings → Pages → Custom domain**: enter `lucabarbato.com`, save. GitHub runs a DNS check; once it passes (a few minutes), the **Enforce HTTPS** checkbox unlocks — tick it.

3. Wait for the "Your site is published at https://lucabarbato.com" banner.

4. (Optional) once HTTPS is confirmed working, you can switch Cloudflare proxy back to *Proxied* (orange cloud) if you want Cloudflare's CDN/analytics. Use "SSL/TLS mode: Full (strict)". If anything breaks, flip back to DNS only.

### Abandon barbatoluca.github.io?

The old Jekyll site lives in a separate repo. You can either:
- leave it alone (it'll keep serving at `barbatoluca.github.io`), or
- archive/delete that repo after the new site is live.

`CNAME` in this repo only controls the custom domain for *this* repo, so the two don't conflict.

## SEO

Meta tags, Open Graph, and Twitter cards are already set in `<head>` of [index.html](index.html). When the domain is live:

- `<link rel="canonical">` and `<meta property="og:*">` URLs are already set to `https://lucabarbato.com/`. Nothing to change unless you use a different domain.
- Bump `<lastmod>` in `sitemap.xml` when you add a paper.
- Submit the site to **Google Search Console** once DNS is live: add `https://lucabarbato.com/` as a property, verify via DNS TXT record (Cloudflare makes this easy), submit `sitemap.xml`.
- For academic indexing specifically, ensure your Google Scholar profile (link in Contact section) and LSE profile both link back to `lucabarbato.com`. Google Scholar picks up author sites via the profile's homepage field.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — last 2 versions). No polyfills.

## Accessibility

- Skip link to main content
- Semantic landmarks (`header`, `nav`, `main`, `footer`, `section`)
- `aria-current="page"` on the in-view nav item
- `prefers-reduced-motion` disables reveal animations
- Focus-visible outlines
- Colour palette meets WCAG AA in both themes for body text

## License

All content (bio, CV, headshot) © Luca Barbato. Code scaffolding is MIT.
