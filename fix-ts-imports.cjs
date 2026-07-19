const fs = require('fs');
const path = require('path');

const fixes = [
  // 1. Fix react-latex-next named imports → default imports
  {
    file: 'src/engines/shared/geometry/ui/FormulaPanel.tsx',
    from: "import { BlockMath } from 'react-latex-next';",
    to: "import BlockMath from 'react-latex-next';"
  },
  {
    file: 'src/engines/shared/geometry/ui/PropertiesPanel.tsx',
    from: "import { InlineMath } from 'react-latex-next';",
    to: "import InlineMath from 'react-latex-next';"
  },
  // 2. Fix verbatimModuleSyntax - use 'import type' for types
  {
    file: 'src/store/LessonStore.ts',
    from: "import { create } from 'zustand';\nimport { FullLessonExperience } from '../types/lesson';",
    to: "import { create } from 'zustand';\nimport type { FullLessonExperience } from '../types/lesson';"
  },
  {
    file: 'src/engines/implementations/TriangleEngine.tsx',
    from: "import { BaseEngine } from '../core/BaseEngine';\nimport { EngineProps, EngineImperativeAPI } from '../core/types';",
    to: "import { BaseEngine } from '../core/BaseEngine';\nimport type { EngineProps, EngineImperativeAPI } from '../core/types';"
  },
  {
    file: 'src/engines/shared/geometry/math/mathUtils.ts',
    from: "import { Vector3D",
    to: "import type { Vector3D"
  },
  {
    file: 'src/engines/shared/geometry/components/DraggablePoint.tsx',
    from: "import { GeoPoint",
    to: "import type { GeoPoint"
  },
];

for (const fix of fixes) {
  const fullPath = path.join(__dirname, fix.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${fix.file}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(fix.from)) {
    content = content.replace(fix.from, fix.to);
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${fix.file}`);
  } else {
    console.log(`NO MATCH: ${fix.file}`);
  }
}

console.log('\nBatch fixes applied.');
