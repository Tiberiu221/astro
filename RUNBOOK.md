# RUNBOOK: site Astro static, servit de nginx pe același server (port 8081)
**Rezultat:** `http://IP:8081/` servește site-ul direct din `/var/www/astro-demo`, lângă vps-demo (port 80). Pe server nu rulează Node, doar nginx cu fișiere statice. ~20 min.
**Legendă:** **[Mac]** = terminal în `~/Desktop/astro-demo` · **[root]** = `ssh root@$IP` (sau `multipass shell vps`, apoi `sudo -i`). Rulează comenzile pe rând.

## 1. Build local și ce iese în `dist/`
[Mac] (`export IP=...` se dă în fiecare tab nou; pe Hetzner pui IP-ul serverului)
```bash
export IP=192.168.252.2
npm run build
find dist -type f | sort
```
→ `[build] 6 page(s) built in ...` și `[build] Complete!`. În listă: `dist/index.html`, `dist/despre/index.html`, `dist/404.html`, 3× `dist/articole/<slug>/index.html`, `dist/rss.xml`, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/_astro/<nume>.<hash>.css` și două favicon-uri. Asta e tot site-ul.

## 2. Pregătește serverul (o singură dată)
[root]
```bash
install -d -o app -g app -m 755 /var/www/astro-demo
apt-get install -y rsync
ufw allow 8081/tcp
ls -ld /var/www/astro-demo
```
→ `rsync is already the newest version` (sau îl instalează), `Rule added` + `Rule added (v6)`, `drwxr-xr-x 2 app app 4096 ... /var/www/astro-demo`. De ce: `app` scrie fișierele fără sudo, nginx (`www-data`) doar le citește, iar ufw lăsa deschise doar 22, 80 și 443.

## 3. Deploy: build + rsync
[Mac]
```bash
bash deploy/deploy.sh $IP
```
→ build-ul, apoi `==> [2/3] Sync: dist/ -> app@IP:/var/www/astro-demo/` fără erori și `HTTP 000` (normal la primul deploy: nginx nu ascultă încă pe 8081).
**Fără chei SSH pentru `app` (Multipass)**, în loc de `deploy.sh`, pe rând:
```bash
npm run build && multipass exec vps -- rm -rf /home/ubuntu/astro-dist && multipass transfer -r dist/ vps:/home/ubuntu/astro-dist
multipass exec vps -- sudo rsync -a --delete --chown=app:app /home/ubuntu/astro-dist/ /var/www/astro-demo/
```

## 4. nginx: server block pe portul 8081
[Mac] (fără chei: `multipass transfer deploy/nginx-astro-demo.conf vps:/tmp/` și `cp /tmp/nginx-astro-demo.conf /etc/nginx/sites-available/astro-demo` ca root)
```bash
scp deploy/nginx-astro-demo.conf root@$IP:/etc/nginx/sites-available/astro-demo
```
[root]
```bash
ln -sf /etc/nginx/sites-available/astro-demo /etc/nginx/sites-enabled/astro-demo
nginx -t && systemctl reload nginx
```
→ `syntax is ok` și `test is successful`. Dacă `nginx -t` dă eroare, reload-ul nu se face, deci vps-demo merge în continuare.
[Mac]
```bash
curl -I http://$IP:8081/
curl -sI http://$IP:8081$(curl -s http://$IP:8081/ | grep -o '/_astro/[^"]*\.css' | head -1) | grep -i cache-control
curl -s -o /dev/null -w '%{http_code}\n' http://$IP:8081/nu-exista
```
→ `HTTP/1.1 200 OK`, `Server: nginx/1.24.0 (Ubuntu)`, `Content-Type: text/html`, `Cache-Control: no-cache` (**gata, site-ul e live**); apoi `Cache-Control: public, max-age=31536000, immutable`; apoi `404`. În browser: `http://IP:8081/`, `/rss.xml`, `/sitemap-index.xml`.

## 5. Modific un articol și fac redeploy
[Mac]
```bash
sed -i '' 's/în 30 de minute/în 20 de minute/' src/content/articles/deploy-vps-linux.md
bash deploy/deploy.sh $IP
curl -s http://$IP:8081/ | grep -o 'VPS Linux în [0-9]* de minute'
```
→ `HTTP 200` la finalul deploy-ului, apoi `VPS Linux în 20 de minute`. Nu golești niciun cache: HTML-ul are `no-cache`.
**Validarea schemei:** `sed -i '' '/^author:/d' src/content/articles/n8n-pentru-redactii.md && bash deploy/deploy.sh $IP` → `[InvalidContentEntryDataError] articles → n8n-pentru-redactii data does not match collection schema` și `author: Required`. Scriptul se oprește înainte de rsync, site-ul live rămâne neatins. Refaci fișierul: `git checkout src/content/articles/n8n-pentru-redactii.md`.

## 6. Opțional: domeniu real cu Cloudflare și HTTPS (doar pe un VPS cu IP public)
1. Cloudflare → DNS → record `A`, nume `demo`, IPv4 = IP-ul VPS-ului, întâi **DNS only** (norul gri).
2. [root] În `/etc/nginx/sites-available/astro-demo`: `8081` → `80` la ambele `listen`, `server_name _;` → `server_name demo.ofai.ro;`, apoi `nginx -t && systemctl reload nginx`, `apt-get install -y certbot python3-certbot-nginx`, `certbot --nginx -d demo.ofai.ro` → `Successfully deployed certificate`.
3. Cloudflare: recordul pe **Proxied** (norul portocaliu), SSL/TLS → **Full (strict)**.
4. `astro.config.mjs`: `site: 'https://demo.ofai.ro'`, apoi `bash deploy/deploy.sh <IP>`. `curl -I https://demo.ofai.ro` → `200` și `server: cloudflare`.

## Depanare
- `Permission denied (publickey)` la rsync/scp → cheia Mac-ului nu e la `app`/`root`: varianta Multipass de la pașii 3 și 4. `rsync: command not found` pe server → pasul 2.
- curl așteaptă 5 s și dă `000` → portul e blocat: `ufw status | grep 8081` (pasul 2). `403 Forbidden` → `/var/www/astro-demo` e gol: `ls /var/www/astro-demo` trebuie să arate `index.html`.
