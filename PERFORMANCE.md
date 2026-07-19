# AR Smart Lab: Performance Audit & Benchmarks

This report covers rendering efficiency, bundle optimization, chunk splitting strategies, and load-time optimizations.

---

## 1. Frame Rate & Rendering Strategy

Our primary target is maintaining **60 FPS** on standard student laptops and mobile tablets.

| Engine | Primary Tech | FPS (Avg) | CPU Overhead | Rationale |
| :--- | :--- | :---: | :---: | :--- |
| **Triangle Engine** | Three.js (WebGL) | ~60 | Medium | Crucial for spatial dragging and 3D lighting. |
| **Fraction Engine** | Three.js (WebGL) | ~60 | Low | 3D sector shapes are light meshes. |
| **Algebra Engine** | HTML Overlay | ~60 | Minimal | Text layout, algebraic equations, and seesaw animations are managed directly in DOM. |
| **Graph Engine** | SVG + HTML | ~60 | Minimal | Coordinate plane plotting, grid drawing, and drag-and-drop operations perform best in vector graphics. |

### WebGL Render Loop Optimizations
- **Demand-Based Rendering:** Three.js engines do not run standard infinite tick renders when static. WebGL frames only update when vertices or rotation states change.
- **Garbage Collection:** Geometry buffers and materials are cleaned up during component unmounting.

---

## 2. Load-Time & Bundle Optimization

To minimize Initial Page Load time on slower classrooms networks:

### A. Code Splitting (Vite + React.lazy)
Large sub-modules (such as math engines and teacher dashboard consoles) are lazy-loaded on-demand.
- **Engine Registry Splitting:** In `EngineRegistry.ts`, every interactive simulator is wrapped in a dynamic `lazy()` import.
- **Route Chunking:** In `AppRouter.tsx`, dashboard pathways are split into separate bundles.

### B. Asset Loading Strategy
- **PWA Asset Cache prefetch:** `.woff2` font bundles and core structural CSS styling are pre-cached.
- **3D Asset Compression:** Geometry mesh models (`.glb`) are stored under `public/models/` and are cached by Workbox via the `3d-models-cache` worker.

---

## 3. Storage & Cache Strategies

Our Offline Service Worker strategy caches static and runtime endpoints:

```
[Network Request]
      │
      ├──> [PWA Service Worker Cache] ──(Hit)──> [Load instantly]
      │
      └──(Miss)─> [Fetch from Server] ────────> [Cache for Offline Use]
```

- **Data Caching:** Discovered NCERT lessons (`.json`) are stored dynamically in the local browser via indexDB or localStorage.
- **Asset Cache-First Cache Rules:** Google Fonts and system icons are cached for up to 1 year using the `gstatic-fonts-cache` service.
