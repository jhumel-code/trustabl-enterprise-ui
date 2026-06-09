#!/usr/bin/env bash
#
# Commit and push all local changes to origin/main.
#
# main auto-deploys to GitHub Pages, so the live site updates within ~1 minute:
#   https://jhumel-code.github.io/trustabl-enterprise-ui/
#
# Usage:
#   ./scripts/push.sh "feat: describe what changed"
#   ./scripts/push.sh                 # uses a dated default commit message
#
set -euo pipefail

# Run from the repo root regardless of where the script is invoked.
cd "$(dirname "$0")/.."

msg="${1:-chore: update $(date +%Y-%m-%d)}"

git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit — working tree clean. Pushing any unpushed commits…"
else
  git commit -m "$msg"
fi

git push origin main

echo "✓ Pushed to origin/main — GitHub Pages will redeploy automatically."
