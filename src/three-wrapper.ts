// Wrapper to patch missing exports in newer Three.js versions for compatibility with older libraries (like MindAR)
// @ts-ignore
export * from '../node_modules/three/build/three.module.js';

// Re-add deprecated encoding constants that were removed in r152+
export const sRGBEncoding = 3001;
export const LinearEncoding = 3000;
