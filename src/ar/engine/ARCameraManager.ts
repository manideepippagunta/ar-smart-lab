/**
 * ARCameraManager — Camera Permission & Stream Management
 */

export type CameraPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export interface CameraStreamInfo {
  stream: MediaStream;
  videoTrack: MediaStreamTrack;
  facingMode: 'environment' | 'user';
  width: number;
  height: number;
}

class ARCameraManagerClass {
  private activeStream: MediaStream | null = null;

  async requestPermission(): Promise<CameraPermissionState> {
    if (!navigator.mediaDevices?.getUserMedia) return 'unavailable';

    try {
      // Query permission without requesting — may not be available everywhere
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (result.state === 'denied') return 'denied';
      }
      return 'prompt';
    } catch {
      return 'prompt';
    }
  }

  async getStream(preferBackCamera = true): Promise<CameraStreamInfo> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera API not available in this browser.');
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: preferBackCamera ? { ideal: 'environment' } : 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.activeStream = stream;

    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const facingMode = (settings.facingMode as 'environment' | 'user') ?? 'environment';

    return {
      stream,
      videoTrack,
      facingMode,
      width: settings.width ?? 1280,
      height: settings.height ?? 720,
    };
  }

  releaseStream(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }
  }

  isStreamActive(): boolean {
    return this.activeStream !== null;
  }
}

export const ARCameraManager = new ARCameraManagerClass();
