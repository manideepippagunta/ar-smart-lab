const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\manid\\OneDrive\\Desktop\\AR_SMART_LAB';

const fixes = [
  // 1. Boilerplate engines (Circle, Cone, Coordinate, Cube, Cuboid, Cylinder)
  ...[
    'src/engines/implementations/CircleEngine.tsx',
    'src/engines/implementations/ConeEngine.tsx',
    'src/engines/implementations/CoordinateEngine.tsx',
    'src/engines/implementations/CubeEngine.tsx',
    'src/engines/implementations/CuboidEngine.tsx',
    'src/engines/implementations/CylinderEngine.tsx'
  ].map(rel => ({
    file: rel,
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*forwardRef\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { forwardRef, useRef } from 'react'"),
      (content) => content.replace(/import\s*\{\s*EngineProps\s*,\s*EngineImperativeAPI\s*\}\s*from\s*['"]\.\.\/core\/types['"]/g, "import type { EngineProps, EngineImperativeAPI } from '../core/types'"),
      (content) => content.replace(/useFrame\(\(state,\s*delta\)\s*=>/g, "useFrame((_, delta) =>")
    ]
  })),

  // 2. FractionEngine.tsx
  {
    file: 'src/engines/implementations/FractionEngine.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*forwardRef\s*,\s*useImperativeHandle\s*,\s*useEffect\s*,\s*useState\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'"),
      (content) => content.replace(/import\s*\{\s*EngineProps\s*,\s*EngineImperativeAPI\s*\}\s*from\s*['"]\.\.\/core\/types['"]/g, "import type { EngineProps, EngineImperativeAPI } from '../core/types'"),
      (content) => content.replace(/import\s*\{\s*useGeometryStore\s*,\s*ComputedStat\s*\}\s*from\s*['"]\.\.\/shared\/geometry\/store\/useGeometryStore['"]/g, "import { useGeometryStore } from '../shared/geometry/store/useGeometryStore';\nimport type { ComputedStat } from '../shared/geometry/store/useGeometryStore'"),
      (content) => content.replace(/const\s*coloredSectors\s*=\s*\[\];/g, '') // remove unused coloredSectors
    ]
  },

  // 3. Viewers
  {
    file: 'src/engines/implementations/geometry/viewers/AnglesViewer.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { useEffect, useRef } from 'react'"),
      (content) => content.replace(/import\s*\{\s*LineSegment\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/LineSegment['"]/g, ''),
      (content) => content.replace(/import\s*\{\s*InfiniteLine\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/InfiniteLine['"]/g, '')
    ]
  },
  {
    file: 'src/engines/implementations/geometry/viewers/CircleViewer.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { useEffect, useRef } from 'react'")
    ]
  },
  {
    file: 'src/engines/implementations/geometry/viewers/CoordinateViewer.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { useEffect, useRef } from 'react'")
    ]
  },
  {
    file: 'src/engines/implementations/geometry/viewers/IntersectingLinesViewer.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { useEffect, useRef } from 'react'"),
      (content) => content.replace(/import\s*\{\s*LineSegment\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/LineSegment['"]/g, ''),
      (content) => content.replace(/import\s*\{\s*RayMesh\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/RayMesh['"]/g, ''),
      (content) => content.replace(/import\s*\{\s*AngleArc\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/AngleArc['"]/g, '')
    ]
  },
  {
    file: 'src/engines/implementations/geometry/viewers/LinesViewer.tsx',
    actions: [
      (content) => content.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"]/g, "import { useEffect, useRef } from 'react'"),
      (content) => content.replace(/import\s*\{\s*LineSegment\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/LineSegment['"]/g, ''),
      (content) => content.replace(/import\s*\{\s*RayMesh\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/RayMesh['"]/g, ''),
      (content) => content.replace(/import\s*\{\s*AngleArc\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/geometry\/components\/AngleArc['"]/g, '')
    ]
  }
];

fixes.forEach(fix => {
  const filePath = path.join(projectRoot, fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fix.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  fix.actions.forEach(action => {
    content = action(content);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up: ${fix.file}`);
  } else {
    console.log(`No changes needed or regex unmatched for: ${fix.file}`);
  }
});
