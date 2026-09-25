# Personal Portfolio

Portfolio site for Pramit Roy, a McMaster Software Engineering student open to full-time and co-op roles in Toronto/GTA.

**Live:** <https://pramitroy.vercel.app>

## What is in it

- `index.html`: the main page (about, role-based resume picker, skills, projects, contact).
- Three role-specific landing pages for recruiters: `software-developer-coop.html`, `qa-automation-sdet-coop.html`, `devops-cloud-it-automation-coop.html`.
- `assets/`: profile photo, network topology diagram, and the three resumes. Each resume has an HTML source (`resume-*.html`, styled by `resume-styles.css`) and the exported PDF.
- Plain HTML, CSS and JavaScript. There is no build step and no dependencies. `script.js` handles the navigation, resume dropdown and light/dark theme toggle.

## Run it locally

```sh
npx serve .
```

Or open `index.html` directly in a browser.

## Deployment

Hosted on Vercel (project `pramitroy`), connected to this GitHub repository. A push to `main` deploys to production and other branches get preview deployments. `vercel.json` sets clean URLs (no `.html`), security headers and cache rules; `.vercelignore` keeps repository files out of the deployment.

## Updating the resumes

Edit the `assets/resume-*.html` file, then re-export the PDF with Chrome (each resume should stay on one page):

```sh
chrome --headless=new --no-pdf-header-footer --print-to-pdf=assets/resume-qa-automation-sdet-coop.pdf assets/resume-qa-automation-sdet-coop.html
```

The PDF cache rule is `max-age=0, must-revalidate`, so a re-exported resume shows up right away.

## Moving to a custom domain

1. In Vercel: Project → Settings → Domains → add the domain, then set the DNS records Vercel shows (an A record for the apex, or a CNAME for a subdomain).
2. Replace `pramitroy.vercel.app` with the new domain in:
   - `index.html` (canonical, `og:url`, `og:image`, JSON-LD, Personal Portfolio card)
   - the three role pages (canonical, `og:url`, `og:image`, Personal Portfolio card)
   - `robots.txt` and `sitemap.xml`
   - the three `assets/resume-*.html` files, then re-export the PDFs
   - the `proyneon-hub/proyneon-hub` profile README and the "Built by" link in the `it-ticketing-system` README
3. Optionally redirect `pramitroy.vercel.app` to the new domain from the Domains settings.
