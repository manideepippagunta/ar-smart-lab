# AR Smart Lab: Production Deployment Checklist

Follow this checklist to build, validate, audit, and deploy the AR Smart Lab application to staging and production environments.

---

## 1. Local Validation & Pre-Build Checks

Prior to pushing to production or staging branches, execute these local validations:

- [ ] **Type Check Compilation:** Run TypeScript verification. Genuinely resolve all issues. No bypasses.
  ```bash
  npx tsc --noEmit --project tsconfig.app.json
  ```
- [ ] **Lint Verification:** Check imports syntax, hooks, and clean code principles.
  ```bash
  npx oxlint --project tsconfig.app.json
  ```
- [ ] **Offline PWA Manifest:** Verify PWA icons are present under the `/public` assets folder:
  - `/public/pwa-192x192.png`
  - `/public/pwa-512x512.png`
  - `/public/apple-touch-icon.png`

---

## 2. Production Build Execution

Execute the Vite asset compiler to generate production static files:

- [ ] **Build Static Bundle:**
  ```bash
  npm run build
  ```
- [ ] **Bundle Size Audit:** Verify the build output directory (`/dist`). Ensure large node modules (like three.js and katex) are successfully chunked.
- [ ] **Service Worker File Checks:** Verify `/dist/sw.js` and manifest are present in the output folder.

---

## 3. Deployment & Hosting Configuration

AR Smart Lab is fully static and client-side, making it highly compatible with Jamstack hostings (Vercel, Netlify, GitHub Pages, or AWS S3 + CloudFront).

### Required Server Configurations:

- [ ] **HTTPS Redirection:** Force SSL connections. Service workers require HTTPS to load and execute.
- [ ] **Client-Side Routing Fallback:** Since the application uses React Router, configure the server to serve `index.html` for all paths (Vercel `vercel.json` rewrite rules or Netlify `_redirects` file):
  ```
  /*    /index.html   200
  ```
- [ ] **Security Headers:** Configure these parameters in server headers:
  - `Content-Security-Policy`: Restrict scripts to self, google fonts, and local synthesizers.
  - `Strict-Transport-Security`: Enforce HTTPS for 1 year.
  - `X-Content-Type-Options`: Set to `nosniff`.
  - `X-Frame-Options`: Set to `DENY` to prevent clickjacking.
