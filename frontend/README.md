# Frontend (Next.js)

Next.js App Router frontend for the real-time chat scaffold.

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Environment

- `NEXT_PUBLIC_WS_URL` (default: `/ws-chat`)
- `BACKEND_INTERNAL_URL` (default: `http://localhost:8000`, used by Next.js rewrites)

## Quality checks

```bash
npm run format:check
npm run lint
npm test
npm run build
```
