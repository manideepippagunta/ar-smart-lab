const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\manid\\OneDrive\\Desktop\\AR_SMART_LAB';
const boilerplates = [
  'src/engines/implementations/GraphEngine.tsx',
  'src/engines/implementations/IntegerEngine.tsx',
  'src/engines/implementations/InteractiveEngine.tsx',
  'src/engines/implementations/LightEngine.tsx',
  'src/engines/implementations/MensurationEngine.tsx'
];

boilerplates.forEach(relPath => {
  const filePath = path.join(projectRoot, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix React default import & hooks
  content = content.replace(/import\s*React\s*,\s*\{\s*forwardRef\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { forwardRef, useRef } from 'react'");

  // Fix verbatimModuleSyntax type imports
  content = content.replace(/import\s*\{\s*EngineProps\s*,\s*EngineImperativeAPI\s*\}\s*from\s*['"]\.\.\/core\/types['"]/g, "import type { EngineProps, EngineImperativeAPI } from '../core/types'");

  // Fix unused state in useFrame
  content = content.replace(/useFrame\(\(state,\s*delta\)\s*=>/g, "useFrame((_, delta) =>");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed boilerplate engine: ${relPath}`);
});
