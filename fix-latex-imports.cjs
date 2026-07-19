const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\manid\\OneDrive\\Desktop\\AR_SMART_LAB';

const filesToFix = [
  'src/engines/shared/geometry/ui/FormulaPanel.tsx',
  'src/engines/shared/geometry/ui/PropertiesPanel.tsx',
  'src/engines/implementations/Triangle/components/MeasurementLabels.tsx',
  'src/engines/implementations/Triangle/ui/FormulaPanel.tsx',
  'src/engines/implementations/Triangle/ui/PropertiesPanel.tsx',
  'src/engines/implementations/algebra/StepBySolver.tsx',
  'src/engines/implementations/algebra/ExpressionWorkspace.tsx',
  'src/components/lesson-steps/StepTheory.tsx'
];

filesToFix.forEach(relPath => {
  const filePath = path.join(projectRoot, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace react-latex-next imports with react-katex imports
  content = content.replace(/import\s*\{\s*BlockMath\s*\}\s*from\s*['"]react-latex-next['"]/g, "import { BlockMath } from 'react-katex'");
  content = content.replace(/import\s*\{\s*InlineMath\s*\}\s*from\s*['"]react-latex-next['"]/g, "import { InlineMath } from 'react-katex'");
  content = content.replace(/import\s*\{\s*InlineMath\s*,\s*BlockMath\s*\}\s*from\s*['"]react-latex-next['"]/g, "import { InlineMath, BlockMath } from 'react-katex'");
  content = content.replace(/import\s*\{\s*BlockMath\s*,\s*InlineMath\s*\}\s*from\s*['"]react-latex-next['"]/g, "import { InlineMath, BlockMath } from 'react-katex'");
  content = content.replace(/import\s*InlineMath\s*from\s*['"]react-latex-next['"]/g, "import { InlineMath } from 'react-katex'");
  content = content.replace(/import\s*BlockMath\s*from\s*['"]react-latex-next['"]/g, "import { BlockMath } from 'react-katex'");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed imports in: ${relPath}`);
});
