/**
 * AssetManager — Model & Texture Cache with Lazy Loading
 *
 * Centralized cache for 3D assets (GLB/GLTF models, textures).
 * Prevents redundant network requests across multiple AR sessions.
 *
 * Features:
 * - In-memory cache keyed by asset URL
 * - LRU-style eviction (max 20 models)
 * - Load progress callbacks
 * - Preload API for warming up assets before session start
 * - Dispose API to free GPU memory
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface AssetLoadProgress {
  url: string;
  loaded: number;
  total: number;
  percent: number;
}

export type AssetProgressCallback = (progress: AssetLoadProgress) => void;

const MAX_CACHE_SIZE = 20;

class AssetManagerClass {
  private readonly modelCache = new Map<string, GLTF>();
  private readonly textureCache = new Map<string, THREE.Texture>();
  private readonly loadingPromises = new Map<string, Promise<GLTF>>();
  private readonly accessOrder: string[] = [];

  private readonly gltfLoader: GLTFLoader;
  private readonly textureLoader = new THREE.TextureLoader();

  constructor() {
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(draco);
  }

  /**
   * Load a GLB/GLTF model with caching. Concurrent requests for the same
   * URL share a single in-flight promise.
   */
  async loadModel(url: string, onProgress?: AssetProgressCallback): Promise<GLTF> {
    if (this.modelCache.has(url)) {
      this.touchAccess(url);
      return this.modelCache.get(url)!;
    }

    // Deduplicate concurrent loads of the same asset
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<GLTF>((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.evictIfNeeded();
          this.modelCache.set(url, gltf);
          this.accessOrder.push(url);
          this.loadingPromises.delete(url);
          resolve(gltf);
        },
        (xhr) => {
          if (onProgress) {
            onProgress({
              url,
              loaded: xhr.loaded,
              total: xhr.total,
              percent: xhr.total > 0 ? Math.round((xhr.loaded / xhr.total) * 100) : 0,
            });
          }
        },
        (err) => {
          this.loadingPromises.delete(url);
          reject(new Error(`AssetManager: Failed to load model "${url}": ${err}`));
        }
      );
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  /**
   * Clone a cached model for placement in the scene.
   * Each AR anchor gets its own clone so they don't share transform state.
   */
  cloneModel(gltf: GLTF): THREE.Group {
    const clone = gltf.scene.clone(true);
    return clone;
  }

  /**
   * Load a texture with caching.
   */
  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) return this.textureCache.get(url)!;

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textureCache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (err) => reject(new Error(`AssetManager: Failed to load texture "${url}": ${err}`))
      );
    });
  }

  /**
   * Preload a list of model URLs in background (before session start).
   */
  async preload(urls: string[]): Promise<void> {
    await Promise.allSettled(urls.map((url) => this.loadModel(url)));
  }

  /** Check if a model is already cached */
  isCached(url: string): boolean {
    return this.modelCache.has(url);
  }

  /** Free GPU memory for a specific model */
  disposeModel(url: string): void {
    const gltf = this.modelCache.get(url);
    if (!gltf) return;

    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => mat.dispose());
      }
    });

    this.modelCache.delete(url);
    const idx = this.accessOrder.indexOf(url);
    if (idx !== -1) this.accessOrder.splice(idx, 1);
  }

  /** Free all cached assets */
  disposeAll(): void {
    [...this.modelCache.keys()].forEach((url) => this.disposeModel(url));
    this.textureCache.forEach((tex) => tex.dispose());
    this.textureCache.clear();
  }

  private touchAccess(url: string): void {
    const idx = this.accessOrder.indexOf(url);
    if (idx !== -1) {
      this.accessOrder.splice(idx, 1);
      this.accessOrder.push(url);
    }
  }

  private evictIfNeeded(): void {
    while (this.accessOrder.length >= MAX_CACHE_SIZE) {
      const oldest = this.accessOrder.shift();
      if (oldest) this.modelCache.delete(oldest);
    }
  }
}

/** Singleton asset manager — shared across the AR module */
export const AssetManager = new AssetManagerClass();
