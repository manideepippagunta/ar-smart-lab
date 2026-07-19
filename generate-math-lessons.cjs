const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'Data', 'json', 'mathematics');

const lessonsData = {
  'class-6/natural-numbers': {
    lesson: {
      title: "Natural Numbers",
      learningOutcomes: ["Understand what natural numbers are.", "Identify positive integers.", "Count items sequentially."],
      objectives: [
        { id: "obj1", text: "Learn that natural numbers start from 1." },
        { id: "obj2", text: "Identify counting numbers." }
      ],
      theory: "Natural numbers are the numbers used for counting and ordering. They start from 1, 2, 3, and go on infinitely. Zero is NOT a natural number.",
      formulae: ["\\mathbb{N} = \\{1, 2, 3, 4, \\dots\\}"],
      hints: ["Drag the point to represent different natural numbers on the number line."],
      tasks: [
        { id: "task1", instruction: "Set the point to 5 on the number line.", validationKey: "val === 5" }
      ],
      keyConcepts: ["Natural numbers start from 1.", "They do not include zero, fractions, or negative numbers."],
      commonMistakes: ["Including zero in natural numbers."]
    },
    metadata: {
      estimatedDuration: 15,
      requiredEngine: "Number Line Engine",
      mode: "operations",
      operation: "add",
      val1: 1,
      val2: 1
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "What is the smallest natural number?", options: ["0", "1", "-1", "2"], correctAnswer: "1" }
      ]
    }
  },
  'class-6/whole-numbers': {
    lesson: {
      title: "Whole Numbers",
      learningOutcomes: ["Understand whole numbers.", "Differentiate between natural and whole numbers.", "Identify zero as a whole number."],
      objectives: [
        { id: "obj1", text: "Learn that whole numbers start from 0." }
      ],
      theory: "Whole numbers are all natural numbers plus zero. They do not include any fractions, decimals, or negative numbers.",
      formulae: ["\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\}"],
      hints: ["Move the pointer to zero to verify it is a whole number."],
      tasks: [
        { id: "task1", instruction: "Set the point to 0.", validationKey: "val === 0" }
      ],
      keyConcepts: ["Whole numbers are non-negative integers."],
      commonMistakes: ["Thinking negative numbers are whole numbers."]
    },
    metadata: {
      estimatedDuration: 15,
      requiredEngine: "Number Line Engine"
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Is zero a whole number?", options: ["Yes", "No"], correctAnswer: "Yes" }
      ]
    }
  },
  'class-6/integers': {
    lesson: {
      title: "Integers",
      learningOutcomes: ["Understand positive and negative integers.", "Represent integers on a number line."],
      objectives: [
        { id: "obj1", text: "Locate negative integers on the number line." }
      ],
      theory: "Integers include all natural numbers, their negative counterparts, and zero.",
      formulae: ["\\mathbb{Z} = \\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}"],
      hints: ["Explore the negative side of the number line by dragging points to the left of zero."],
      tasks: [
        { id: "task1", instruction: "Move the point to a negative integer.", validationKey: "isNegative" }
      ],
      keyConcepts: ["Integers have no fractional parts.", "Negative integers are located to the left of zero."],
      commonMistakes: ["Thinking 2.5 is an integer."]
    },
    metadata: {
      estimatedDuration: 15,
      requiredEngine: "Number Line Engine"
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which of the following is a negative integer?", options: ["5", "0", "-3", "1.5"], correctAnswer: "-3" }
      ]
    }
  },
  'class-7/absolute-value': {
    lesson: {
      title: "Absolute Value",
      learningOutcomes: ["Understand absolute value.", "Find distance from zero.", "Calculate absolute value of positive and negative integers."],
      objectives: [
        { id: "obj1", text: "Learn that distance is always non-negative." }
      ],
      theory: "The absolute value of a number is its distance from zero on the number line. Since distance cannot be negative, absolute value is always positive or zero.",
      formulae: ["|x| = x \\text{ (if } x \\ge 0\\text{), } |x| = -x \\text{ (if } x < 0\\text{)}"],
      hints: ["Observe the visual distance bar. Drag the point to negative values to see that absolute value remains positive."],
      tasks: [
        { id: "task1", instruction: "Drag the point to -5.", validationKey: "val === -5" }
      ],
      keyConcepts: ["Absolute value represents distance.", "Distance is always positive."],
      commonMistakes: ["Writing absolute value of -7 as -7."]
    },
    metadata: {
      estimatedDuration: 20,
      requiredEngine: "Number Line Engine",
      mode: "absolute-value"
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "What is |-8|?", options: ["8", "-8", "0", "16"], correctAnswer: "8" }
      ]
    }
  },
  'class-7/comparing-numbers': {
    lesson: {
      title: "Comparing Numbers",
      learningOutcomes: ["Use comparison symbols (<, >, =).", "Compare positive and negative numbers."],
      objectives: [
        { id: "obj1", text: "Determine which number is greater." }
      ],
      theory: "On a number line, any number that is further to the right is greater than any number to its left.",
      formulae: ["A > B \\iff A \\text{ is to the right of } B"],
      hints: ["Drag points A and B. Watch the live equation panel to see which is larger."],
      tasks: [
        { id: "task1", instruction: "Arrange B to be greater than A.", validationKey: "isOrdered" }
      ],
      keyConcepts: ["Positive numbers are always greater than negative numbers."],
      commonMistakes: ["Thinking -5 is greater than -2."]
    },
    metadata: {
      estimatedDuration: 15,
      requiredEngine: "Number Line Engine",
      mode: "comparison"
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which is true?", options: ["-5 > -2", "-2 > -5", "0 < -1", "-3 = 3"], correctAnswer: "-2 > -5" }
      ]
    }
  },
  'class-8/equivalent-fractions': {
    lesson: {
      title: "Equivalent Fractions",
      learningOutcomes: ["Identify equivalent fractions.", "Use grids and circles to verify equivalence."],
      objectives: [
        { id: "obj1", text: "Find equivalent values visually." }
      ],
      theory: "Equivalent fractions represent the same portion of a whole, even though they have different numerators and denominators.",
      formulae: ["\\frac{a}{b} = \\frac{a \\times k}{b \\times k}"],
      hints: ["Choose the Circle or Bar model. Tweak parameters to see partitions match up."],
      tasks: [
        { id: "task1", instruction: "Create a fraction equivalent to 1/2.", validationKey: "isEquivalent" }
      ],
      keyConcepts: ["Multiplying or dividing numerator and denominator by same non-zero number keeps the value same."],
      commonMistakes: ["Adding a value to numerator and denominator thinking it keeps fraction equivalent."]
    },
    metadata: {
      estimatedDuration: 18,
      requiredEngine: "Fraction Engine",
      mode: "Beginner",
      initialNumerator: 1,
      initialDenominator: 2
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which fraction is equivalent to 1/2?", options: ["2/3", "3/6", "4/5", "1/4"], correctAnswer: "3/6" }
      ]
    }
  },
  'class-8/improper-fractions': {
    lesson: {
      title: "Improper Fractions",
      learningOutcomes: ["Convert between mixed and improper fractions.", "Understand fractions greater than 1."],
      objectives: [
        { id: "obj1", text: "Create fractions where numerator is larger than denominator." }
      ],
      theory: "An improper fraction is a fraction where the numerator is greater than or equal to the denominator. It represents a quantity larger than one whole.",
      formulae: ["\\frac{A}{B} \\text{ where } A > B"],
      hints: ["In advanced mode, type numerator = 5 and denominator = 4 to see mixed representation."],
      tasks: [
        { id: "task1", instruction: "Create an improper fraction.", validationKey: "isImproper" }
      ],
      keyConcepts: ["Improper fractions represent numbers greater than or equal to 1."],
      commonMistakes: ["Thinking a fraction must always be less than 1."]
    },
    metadata: {
      estimatedDuration: 15,
      requiredEngine: "Fraction Engine",
      mode: "Advanced",
      initialNumerator: 5,
      initialDenominator: 4
    },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which is an improper fraction?", options: ["3/4", "1/2", "7/5", "2/9"], correctAnswer: "7/5" }
      ]
    }
  }
};

for (const [key, files] of Object.entries(lessonsData)) {
  const dirPath = path.join(root, key);
  fs.mkdirSync(dirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'lesson.json'), JSON.stringify(files.lesson, null, 2));
  fs.writeFileSync(path.join(dirPath, 'quiz.json'), JSON.stringify(files.quiz, null, 2));
  fs.writeFileSync(path.join(dirPath, 'metadata.json'), JSON.stringify(files.metadata || {}, null, 2));
}

console.log('Successfully generated modular lesson packages for Phase 7.');
