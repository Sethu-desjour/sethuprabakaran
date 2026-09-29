#!/usr/bin/env bash
# Sync site/ to S3 and invalidate CloudFront.
# BUCKET / DISTRIBUTION_ID come from the environment (CI) or `terraform output` (local).
set -euo pipefail

cd "$(dirname "$0")"

BUCKET="${BUCKET:-$(terraform -chdir=infra output -raw bucket_name)}"
DISTRIBUTION_ID="${DISTRIBUTION_ID:-$(terraform -chdir=infra output -raw distribution_id)}"

echo "Deploying to s3://$BUCKET (distribution $DISTRIBUTION_ID)"

# Stage a copy with ?v=<content hash> on CSS/JS references, so browsers holding
# the week-long cached copy fetch the new file as soon as it changes.
BUILD="$(mktemp -d)"
trap 'rm -rf "$BUILD"' EXIT
cp -R site/. "$BUILD"
for f in styles.css main.js; do
  v="$(shasum "site/$f" | cut -c1-8)"
  sed -i.bak "s#\"/$f\"#\"/$f?v=$v\"#g" "$BUILD"/*.html
done
rm -f "$BUILD"/*.bak

# Long-lived cache for static assets.
aws s3 sync "$BUILD/" "s3://$BUCKET" --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=604800"

# HTML always revalidates so new content shows up immediately.
aws s3 sync "$BUILD/" "s3://$BUCKET" --delete \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache" \
  --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

echo "Done."
