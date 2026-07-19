const fs = require('fs');
const path = require('path');

// Files that just need "import React from 'react';" removed (not using JSX directly or using new jsx transform)
const removeReactImport = [
  'src/engines/shared/geometry/components/AngleArc.tsx',
  'src/engines/shared/geometry/components/CartesianGrid.tsx',
  'src/engines/shared/geometry/components/InfiniteLine.tsx',
  'src/engines/shared/geometry/components/LineSegment.tsx',
  'src/engines/shared/geometry/components/PolygonMesh.tsx',
  'src/engines/shared/geometry/components/RayMesh.tsx',
  'src/engines/shared/geometry/ui/GeometryToolbox.tsx',
  'src/lessons/AITutor.tsx',
  'src/lessons/Certificate.tsx',
  'src/lessons/Controls.tsx',
  'src/lessons/Explanation.tsx',
  'src/lessons/InteractiveView.tsx',
  'src/lessons/Introduction.tsx',
  'src/lessons/LessonLayout.tsx',
  'src/lessons/Materials.tsx',
  'src/lessons/Objectives.tsx',
  'src/lessons/Observation.tsx',
  'src/lessons/Practice.tsx',
  'src/lessons/QuizEngine.tsx',
  'src/lessons/Summary.tsx',
  'src/lessons/Theory.tsx',
  'src/lessons/VoiceNarration.tsx',
  'src/pages/Achievements.tsx',
  'src/pages/HelpCenter.tsx',
  'src/pages/MathDashboard.tsx',
  'src/pages/Progress.tsx',
  'src/pages/ScienceDashboard.tsx',
  'src/pages/Settings.tsx',
];

// Specific replacements
const specificFixes = [
  // Remove unused Compass, Shield from LandingPage
  {
    file: 'src/pages/LandingPage.tsx',
    from: "import { GraduationCap, ArrowRight, Compass, Shield, Cpu } from 'lucide-react';",
    to: "import { GraduationCap, ArrowRight, Cpu } from 'lucide-react';"
  },
  // Remove unused Star from LessonLibrary
  {
    file: 'src/pages/LessonLibrary.tsx',
    from: "import { BookOpen, GraduationCap, Clock, Award, Star, ListFilter,\n  BarChart2, Users, FileSpreadsheet, Bookmark, Save, Trash2, Edit2, Play\n} from 'lucide-react';",
    to: "import { BookOpen, GraduationCap, Clock, Award, ArrowRight } from 'lucide-react';"
  },
  // Fix unused isGeometry in LessonLibrary
  {
    file: 'src/pages/LessonLibrary.tsx',
    from: "              const isGeometry = lesson.engine === 'Geometry Engine';\n              const isFraction = lesson.engine === 'Fraction Engine';\n              const isNumberLine = lesson.engine === 'Number Line Engine';",
    to: "              const isFraction = lesson.engine === 'Fraction Engine';\n              const isNumberLine = lesson.engine === 'Number Line Engine';"
  },
  // Fix LessonViewer: remove unused ChevronRight, ArrowLeft, setTeacherMode
  {
    file: 'src/pages/LessonViewer.tsx',
    from: "import { CheckCircle2, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';",
    to: "import { CheckCircle2, Menu, X } from 'lucide-react';"
  },
  {
    file: 'src/pages/LessonViewer.tsx',
    from: "  const setTeacherMode = useLessonStore((state) => state.setTeacherMode);\n  ",
    to: "  "
  },
  // Fix AppRouter: remove unused React
  {
    file: 'src/routes/AppRouter.tsx',
    from: "import React, { Suspense, lazy } from 'react';",
    to: "import { Suspense, lazy } from 'react';"
  },
  // Fix StudentDashboard: remove unused BookOpen
  {
    file: 'src/pages/StudentDashboard.tsx',
    from: "import { GraduationCap, BookOpen, Compass, Award, Shield, User, ArrowRight } from 'lucide-react';",
    to: "import { GraduationCap, Compass, Award, Shield, User, ArrowRight } from 'lucide-react';"
  },
  // Fix LandingPage: remove React import
  {
    file: 'src/pages/LandingPage.tsx',
    from: "import React from 'react';\n",
    to: ""
  },
  // Fix ChooseRole: remove React import
  {
    file: 'src/pages/ChooseRole.tsx',
    from: "import React from 'react';\n",
    to: ""
  },
  // Fix StudentDashboard: remove React import
  {
    file: 'src/pages/StudentDashboard.tsx',
    from: "import React from 'react';\n",
    to: ""
  },
  // Fix TeacherDashboard: remove unused imports, add Presentation
  {
    file: 'src/pages/TeacherDashboard.tsx',
    from: "import { \n  GraduationCap, BookOpen, Clock, Award, Star, ListFilter,\n  BarChart2, Users, FileSpreadsheet, Bookmark, Save, Trash2, Edit2, Play\n} from 'lucide-react';",
    to: "import { \n  GraduationCap, BookOpen, Clock, Award, Star,\n  BarChart2, Users, FileSpreadsheet, Save, Edit2, Play, Presentation\n} from 'lucide-react';"
  },
  {
    file: 'src/pages/TeacherDashboard.tsx',
    from: "import React, { useEffect, useState } from 'react';\n",
    to: "import { useEffect, useState } from 'react';\n"
  },
  {
    file: 'src/pages/TeacherDashboard.tsx',
    from: "import { motion, AnimatePresence } from 'framer-motion';",
    to: "import { motion } from 'framer-motion';"
  },
  // Fix LessonLibrary: remove React import
  {
    file: 'src/pages/LessonLibrary.tsx',
    from: "import React, { useEffect, useState } from 'react';",
    to: "import { useEffect, useState } from 'react';"
  },
  // Fix LessonViewer: remove React import
  {
    file: 'src/pages/LessonViewer.tsx',
    from: "import React, { useEffect, useState } from 'react';",
    to: "import { useEffect, useState } from 'react';"
  },
];

// Remove "import React from 'react';" from listed files
for (const rel of removeReactImport) {
  const fullPath = path.join(__dirname, rel);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  const patterns = [
    "import React from 'react';\n",
    "import React from \"react\";\n",
    "import React, { ",
  ];
  
  let changed = false;
  
  if (content.startsWith("import React from 'react';\n") || content.startsWith("import React from \"react\";\n")) {
    content = content.replace(/^import React from ['"]react['"];\n/, '');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Removed React import: ${rel}`);
  }
}

// Apply specific fixes
for (const fix of specificFixes) {
  const fullPath = path.join(__dirname, fix.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${fix.file}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(fix.from)) {
    content = content.replace(fix.from, fix.to);
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed specific: ${fix.file}`);
  } else {
    console.log(`NO MATCH: ${fix.file} — "${fix.from.substring(0, 50)}..."`);
  }
}

console.log('\nAll cleanup fixes applied.');
