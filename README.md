# astro-demo: site de presă static cu Astro

„Redacția Tech”, un site demo: 3 articole în Markdown (content collection cu schemă zod), pagină de articol cu timp de citire și etichete, pagina Despre, RSS și sitemap. Astro 5, TypeScript strict, fără framework de UI. Output static, servit de nginx pe Ubuntu 24.04.

| Comandă | Ce face |
| --- | --- |
| `npm install` | instalează dependențele |
| `npm run dev` | server de dezvoltare pe http://localhost:4321 |
| `npm run build` | generează site-ul static în `dist/` |
| `npm run preview` | servește local `dist/` |
| `npm run check` | verificare TypeScript + Astro (`astro check`) |
| `bash deploy/deploy.sh <IP>` | build + `rsync` în `/var/www/astro-demo` pe server |

## Structură

- `src/content.config.ts`: colecția `articles` și schema ei
- `src/content/articles/*.md`: articolele (numele fișierului = slug-ul din URL)
- `src/pages/`: `/`, `/articole/[slug]`, `/despre`, `/404`, `/rss.xml`
- `src/layouts/Layout.astro`, `src/styles/global.css`: layout-ul comun și stilurile
- `deploy/`: scriptul de deploy și configurația nginx (port 8081, plus varianta cu domeniu și HTTPS)

Pașii de deploy pe server sunt în [RUNBOOK.md](RUNBOOK.md).
