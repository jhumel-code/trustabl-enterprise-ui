# Contributing

## Pushing changes to remote

`main` is the source of truth and **auto-deploys to GitHub Pages** on every push
(via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)),
so pushing to `main` publishes the live site within ~1 minute:

> https://jhumel-code.github.io/trustabl-web/

### Push everything (one step)

A helper script stages all local changes, commits them, and pushes to `origin/main`:

```bash
./scripts/push.sh "feat: describe what changed"
```

Run it with no message to use a dated default. If the working tree is clean it
just pushes whatever is already committed.

### Or do it manually

```bash
git add -A
git commit -m "feat: describe what changed"
git push origin main
```

There are no feature branches — commits land on `main` and deploy automatically.
Watch the deploy under the repo's **Actions** tab.

## Local development

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc) + production build into app/dist
```

The app reads a real `trustabl scan` from `app/src/data/scan.json`. To refresh it:

```bash
trustabl scan <target> --no-rules-update --format json > app/src/data/scan.json
```
