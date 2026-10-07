#!/usr/bin/env bash
# Build the Astro site locally and sync dist/ to the server, where nginx serves the files directly.
# Usage: bash deploy/deploy.sh <server-ip>      or: HOST=<server-ip> bash deploy/deploy.sh
set -euo pipefail

HOST="${1:-${HOST:-}}"
if [[ -z "$HOST" ]]; then
  echo "Usage: bash deploy/deploy.sh <server-ip>   (or: HOST=<server-ip> bash deploy/deploy.sh)" >&2
  exit 1
fi

cd "$(dirname "$0")/.."   # project root, wherever the script is called from

echo "==> [1/3] Build: npm run build"
# An article that fails the content schema fails the build here, and set -e stops before anything is uploaded.
npm run build

echo "==> [2/3] Sync: dist/ -> app@$HOST:/var/www/astro-demo/"
# -a keeps permissions and timestamps, -z compresses in transit, --delete removes files that are gone from dist/
# (e.g. old hashed assets in /_astro/). The trailing slash on dist/ copies its contents, not the folder itself.
rsync -az --delete dist/ "app@$HOST:/var/www/astro-demo/"

echo "==> [3/3] Check: http://$HOST:8081/"
status=$(curl -s -o /dev/null -m 5 -w '%{http_code}' "http://$HOST:8081/" || true)
echo "    HTTP $status"

cat <<EOF

Next steps:
  - HTTP 000 on the first deploy is expected: nginx does not serve port 8081 yet (RUNBOOK.md, step 4).
  - curl -I http://$HOST:8081/    -> HTTP/1.1 200 OK, Server: nginx
  - Browser: http://$HOST:8081/  (feed: /rss.xml, sitemap: /sitemap-index.xml)
EOF
