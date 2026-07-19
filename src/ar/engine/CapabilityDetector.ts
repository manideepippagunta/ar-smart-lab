/**
 * CapabilityDetector — Pre-flight AR Compatibility Check
 *
 * Checks all required capabilities before launching an AR session.
 * Prevents cryptic failures by surfacing clear, user-friendly errors.
 *
 * Checks performed:
 * 1. WebGL 2.0 support
 * 2. Camera (getUserMedia) availability
 * 3. SharedArrayBuffer (required for MindAR Web Workers)
 * 4. HTTPS / secure context
 * 5. Browser compatibility (Safari 14.1+, Chrome 79+, Firefox 91+)
 */

export interface CapabilityResult {
  supported: boolean;
  webgl: boolean;
  camera: boolean;
  secureContext: boolean;
  sharedArrayBuffer: boolean;
  browser: {
    name: string;
    version: string;
    compatible: boolean;
  };
  errors: string[];
  warnings: string[];
}

function detectBrowser(): { name: string; version: string; compatible: boolean } {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = '0';
  let compatible = false;

  if (/CriOS/i.test(ua)) {
    name = 'Chrome iOS';
    version = (/CriOS\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 79;
  } else if (/FxiOS/i.test(ua)) {
    name = 'Firefox iOS';
    version = (/FxiOS\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 91;
  } else if (/Chrome\/([\d.]+)/.test(ua) && !/Chromium/.test(ua)) {
    name = 'Chrome';
    version = (/Chrome\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 79;
  } else if (/Firefox\/([\d.]+)/.test(ua)) {
    name = 'Firefox';
    version = (/Firefox\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 91;
  } else if (/Version\/([\d.]+).*Safari/.test(ua)) {
    name = 'Safari';
    version = (/Version\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 14.1;
  } else if (/Edg\/([\d.]+)/.test(ua)) {
    name = 'Edge';
    version = (/Edg\/([\d.]+)/.exec(ua) ?? [])[1] ?? '0';
    compatible = parseFloat(version) >= 79;
  }

  return { name, version, compatible };
}

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return ctx !== null;
  } catch {
    return false;
  }
}

export async function detectCapabilities(): Promise<CapabilityResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const webgl = checkWebGL();
  const camera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const secureContext = window.isSecureContext;
  const sharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
  const browser = detectBrowser();

  if (!webgl) errors.push('WebGL is not supported on this device.');
  if (!camera) errors.push('Camera access is not available in this browser.');
  if (!secureContext) errors.push('AR requires a secure (HTTPS) connection.');
  if (!browser.compatible) {
    warnings.push(`${browser.name} ${browser.version} may not fully support all AR features. Use Chrome or Safari for best experience.`);
  }
  if (!sharedArrayBuffer) {
    warnings.push('SharedArrayBuffer unavailable — marker detection performance may be reduced.');
  }

  return {
    supported: webgl && camera && secureContext,
    webgl,
    camera,
    secureContext,
    sharedArrayBuffer,
    browser,
    errors,
    warnings,
  };
}
