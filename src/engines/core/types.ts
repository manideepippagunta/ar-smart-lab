export interface EngineImperativeAPI {
  reset: () => void;
  focus: (objectId?: string) => void;
  export: () => string; // Returns JSON string of state
  captureScreenshot: () => string; // Returns base64 image
}

export interface EngineProps {
  lesson: any; // Will be typed to LessonObject later
  theme: any;
  settings: any;
  voice: any;
  quiz: any;
  aiContext: any;
}
