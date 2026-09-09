CNTRL Next template

## Getting Started

Run the development server:

```bash
npm run dev
```
## Render modes

`CNTRL_BUILD_MODE` picks how `pages/[[...slug]].tsx` is built:

- unset — static export to `_static/`, one HTML file per page. This is what
  published sites use.
- `self-hosted` — static export with relative asset paths, for code export.
- `staging` — no export; pages are rendered on demand with ISR. The image is
  built once without a project and started per project with `CNTRL_API_URL`
  and `NEXT_PUBLIC_BASE_PATH`. `next start` re-reads `next.config.js`, so the
  base path takes effect at runtime.

## Staging image

```bash
docker build -t nextjs-template-staging .
docker run --rm -p 3000:3000 \
  -e CNTRL_API_URL=https://<projectId>:<apiKey>@<public-api-host> \
  -e NEXT_PUBLIC_BASE_PATH=/preview/<projectId> \
  nextjs-template-staging
```

Then open `http://localhost:3000/preview/<projectId>/`.
