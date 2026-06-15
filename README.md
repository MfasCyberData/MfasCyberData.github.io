# Portfolio — Mbohou Fils Aboubakar Sidik

Hand-built static site. No build step, no framework, no dependencies. Open `index.html` in any browser, or serve locally with `python3 -m http.server 8000`.

**Design system:** dark hero (#24211C) + paper body, gold #C98203 / #E2A63A + black, Source Serif 4 (headings) + Inter (body). Profile: data-engineer-primary with cybersecurity awareness as the differentiator.

## Structure

```
portfolio/
├─ index.html                  Homepage: hero · projects + filters · skills · about · experience/education · contact
├─ 404.html                    Not-found page (GitHub Pages serves it automatically)
├─ projects/
│  └─ hortitrace.html          Flagship case study (final, sanitized)
├─ css/
│  ├─ styles.css               Design system + homepage
│  └─ case-study.css           Case-study pages
├─ js/
│  └─ main.js                  Project filters (deep-linkable) · copy-email · footer year · nav scroll-spy
└─ assets/
   ├─ cv/                      ← CV_Mbohou_Sidik_EN.pdf · CV_Mbohou_Sidik_FR.pdf
   └─ img/                     favicon.svg · og-image.png · portrait.jpg · projects/*.png
```

## Before publishing — punch list (owner)

1. **CV PDFs** → `assets/cv/CV_Mbohou_Sidik_EN.pdf` and `_FR.pdf` (or update links in index.html + the case study).
2. **Photo** → `assets/img/portrait.jpg`, LinkedIn-grade headshot, ~600x600 px square. Slot auto-hides if missing.
3. **Six project thumbnails** → `assets/img/projects/`: `food-prices.png`, `big-data.png`, `iot-ids.png`, `adversarial-ml.png`, `siem-labs.png`, `dfir.png`.
   Export rules: landscape 16:9 (~1200x675 PNG), plain white background, no window chrome, crop to the chart so text is readable at ~300 px wide. Cards use `object-fit: contain`, so the whole image always shows; cards hide the strip if a file is missing.
4. **HortiTrace courtesy review**: optional but recommended — show the case study to HortiTrace before go-live. Content is already sanitized (no client ERP name, no internal table names).

## Deployment (GitHub Pages + custom domain)

1. Create a public repo (e.g. `portfolio` or `MfasCyberData.github.io`), push all files at the repo root.
2. Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. **After the URL exists**, do these three edits:
   - `index.html` + `projects/hortitrace.html`: fill the commented `<link rel="canonical">` placeholders with the real URL.
   - `index.html`: change `og:image` from the relative path to the absolute URL (`https://DOMAIN/assets/img/og-image.png`). Crawlers require absolute paths.
   - `404.html`: links are root-absolute (`/`), correct for a custom domain or `user.github.io`. If hosted under a project subpath, prefix with `/<repo>`.
4. Custom domain: add a `CNAME` file containing the domain; set DNS (A records to GitHub IPs, or CNAME to `MfasCyberData.github.io`); enable "Enforce HTTPS".

## Phase 2 backlog (deferred)

- Modern-stack pipeline card: hidden in `index.html` (search "HIDDEN"). Uncomment when the repo is public with a complete README; update the hero "Currently" line at the same time.
- French version of the site (parallel `fr/` tree), matching the CV EN+FR pattern.
- Per-card "Read the report" PDF links once the anonymized DFIR write-up and the R study report exist as clean PDFs.
- GitHub profile README + publish rebuilt repos (fix Appendix D bugs first) before the portfolio URL goes on the CV.

## QA gate (run before any release)

The build is checked for: valid HTML (tag balance, one h1/page, no duplicate ids), all internal links + anchors resolve, every img has alt, every button has type, external links use `target="_blank" rel="noopener noreferrer"`, no duplicate or in-SVG meta tags, meta descriptions ≤160 chars, consistent ESAIP naming, and a sanitization gate that blocks internal client strings (ERP name, internal table names, "PostgreSQL 17", "zero downtime", etc.). All green as of the final review.
