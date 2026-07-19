const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'Data', 'json', 'mathematics');

const algebraLessons = {
  'class-6/variables': {
    lesson: {
      title: "Variables",
      learningOutcomes: ["Understand what variables represent.", "Use letters to denote unknown quantities."],
      objectives: [
        { id: "obj1", text: "Identify variables in an expression." },
        { id: "obj2", text: "Write an expression with a variable." }
      ],
      theory: "A variable is a symbol (usually a letter like x, y, or n) that represents an unknown or changing quantity. For example, if a bag has x apples, we can write expressions using x.",
      formulae: ["\\text{Expression} = \\text{variable} + \\text{constant}", "\\text{e.g. } x + 3"],
      hints: ["Think of a variable as a box that can hold any number."],
      tasks: [
        { id: "task1", instruction: "Add an x tile to the workspace.", validationKey: "any" }
      ],
      keyConcepts: ["Variables are letters representing unknown values.", "A variable can take different values."],
      commonMistakes: ["Thinking that x always equals 24 (it doesn't — it changes!)"],
      engineConfig: { mode: "simplify", expression: "x + 3" }
    },
    metadata: { estimatedDuration: 15, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "In the expression 5x + 2, what is the variable?", options: ["5", "x", "2", "+"], correctAnswer: "x" }
      ]
    }
  },

  'class-6/constants': {
    lesson: {
      title: "Constants",
      learningOutcomes: ["Distinguish between variables and constants.", "Identify constants in expressions."],
      objectives: [
        { id: "obj1", text: "Identify the constant in an expression." }
      ],
      theory: "A constant is a fixed value that does not change. In the expression 3x + 7, the number 7 is a constant because it stays the same regardless of x.",
      formulae: ["3x + 7 \\quad (\\text{7 is the constant})"],
      hints: ["Constants are the numbers standing alone without a variable."],
      tasks: [
        { id: "task1", instruction: "Add 3 positive constant tiles to the workspace.", validationKey: "any" }
      ],
      keyConcepts: ["Constants have fixed values.", "They stand alone in expressions."],
      commonMistakes: ["Confusing the coefficient (3 in 3x) with a constant."],
      engineConfig: { mode: "simplify", expression: "3x + 7" }
    },
    metadata: { estimatedDuration: 12, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which is the constant in 4x + 9?", options: ["4", "x", "9", "4x"], correctAnswer: "9" }
      ]
    }
  },

  'class-7/expressions': {
    lesson: {
      title: "Algebraic Expressions",
      learningOutcomes: ["Write algebraic expressions.", "Evaluate expressions by substituting values."],
      objectives: [
        { id: "obj1", text: "Build an expression using algebra tiles." }
      ],
      theory: "An algebraic expression is a combination of variables, constants, and operations. For example, 2x + 5 is an expression. Expressions do not have an equals sign.",
      formulae: ["2x + 5", "3x^2 - 4x + 1"],
      hints: ["Use the tile picker to build your expression on the workspace."],
      tasks: [
        { id: "task1", instruction: "Build the expression 2x + 3 using tiles.", validationKey: "any" }
      ],
      keyConcepts: ["Expressions contain terms separated by + or -.", "Unlike equations, they have no = sign."],
      commonMistakes: ["Calling an expression an equation."],
      engineConfig: { mode: "simplify", expression: "2x + 3" }
    },
    metadata: { estimatedDuration: 18, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which of the following is an expression?", options: ["2x + 5 = 9", "2x + 5", "x = 4", "3 = 3"], correctAnswer: "2x + 5" }
      ]
    }
  },

  'class-7/simplification': {
    lesson: {
      title: "Simplifying Expressions",
      learningOutcomes: ["Collect like terms.", "Simplify algebraic expressions."],
      objectives: [
        { id: "obj1", text: "Combine like tiles and simplify." }
      ],
      theory: "Simplification means collecting like terms. Terms are 'like' if they have the same variable and power. For example, 3x + 2x = 5x, but 3x + 2 cannot be simplified further.",
      formulae: ["3x + 2x = 5x", "3x + 2 \\text{ (cannot simplify)}"],
      hints: ["Match tiles of the same color — those are like terms."],
      tasks: [
        { id: "task1", instruction: "Simplify 3x + 2 + x using the workspace.", validationKey: "any" }
      ],
      keyConcepts: ["Like terms have the same variable and power.", "Only like terms can be added."],
      commonMistakes: ["Adding 3x + 4 to get 7x — this is incorrect!"],
      engineConfig: { mode: "simplify", expression: "3x + 2 + x" }
    },
    metadata: { estimatedDuration: 20, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Simplify: 4x + 2x", options: ["6x²", "6x", "8x", "24x"], correctAnswer: "6x" }
      ]
    }
  },

  'class-7/linear-equations': {
    lesson: {
      title: "Linear Equations",
      learningOutcomes: ["Understand what a linear equation is.", "Form linear equations from word problems."],
      objectives: [
        { id: "obj1", text: "Identify a linear equation." }
      ],
      theory: "A linear equation is an equation with one variable raised to the first power (no x² or x³). It forms a straight line when graphed. Example: 2x + 3 = 9",
      formulae: ["ax + b = c", "2x + 3 = 9"],
      hints: ["Observe the balance scale — a balanced scale represents a true equation."],
      tasks: [
        { id: "task1", instruction: "Balance the scale to solve 2x + 4 = 10.", validationKey: "isBalanced" }
      ],
      keyConcepts: ["Linear equations have degree 1.", "One variable raised to power 1."],
      commonMistakes: ["Including x² terms and calling it linear."],
      engineConfig: { mode: "balance", expression: "2x + 4 = 10" }
    },
    metadata: { estimatedDuration: 20, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Which is a linear equation?", options: ["x² + 1 = 5", "2x + 3 = 9", "x³ = 8", "x² = 4"], correctAnswer: "2x + 3 = 9" }
      ]
    }
  },

  'class-8/balancing-equations': {
    lesson: {
      title: "Balancing Equations",
      learningOutcomes: ["Apply the balance principle.", "Perform the same operation on both sides."],
      objectives: [
        { id: "obj1", text: "Balance the scale by removing equal tiles from both sides." }
      ],
      theory: "An equation is like a balance scale. Whatever you do to one side, you must do to the other. If you add 3 to the left side, you must add 3 to the right side too.",
      formulae: ["\\text{If } A = B \\text{ then } A + k = B + k", "\\text{If } A = B \\text{ then } A - k = B - k"],
      hints: ["Try adding the same tile to BOTH sides of the scale."],
      tasks: [
        { id: "task1", instruction: "Make both sides equal by adding or removing tiles.", validationKey: "isBalanced" }
      ],
      keyConcepts: ["The Balance Principle: same operation on both sides.", "Equality is preserved by balanced operations."],
      commonMistakes: ["Changing only one side of the equation."],
      engineConfig: { mode: "balance", expression: "x + 3 = 7" }
    },
    metadata: { estimatedDuration: 22, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "If x + 5 = 12, what do you subtract from both sides?", options: ["12", "x", "5", "1"], correctAnswer: "5" }
      ]
    }
  },

  'class-8/substitution': {
    lesson: {
      title: "Substitution",
      learningOutcomes: ["Evaluate expressions by substituting values.", "Check equation solutions by substitution."],
      objectives: [
        { id: "obj1", text: "Substitute x = 4 into an expression and find the result." }
      ],
      theory: "Substitution means replacing a variable with a specific value. For example, if x = 3, then 2x + 1 = 2(3) + 1 = 7.",
      formulae: ["2x + 1 \\big|_{x=3} = 2(3) + 1 = 7"],
      hints: ["Replace x in the expression with the given number and evaluate step by step."],
      tasks: [
        { id: "task1", instruction: "Verify x = 3 solves 2x + 1 = 7.", validationKey: "isSolved" }
      ],
      keyConcepts: ["Substitution replaces a variable with a value.", "We can check solutions by substitution."],
      commonMistakes: ["Forgetting to apply multiplication before addition (BODMAS)."],
      engineConfig: { mode: "solve", expression: "2x + 1 = 7" }
    },
    metadata: { estimatedDuration: 18, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "If x = 4, what is 3x - 2?", options: ["10", "12", "14", "6"], correctAnswer: "10" }
      ]
    }
  },

  'class-8/solving-equations': {
    lesson: {
      title: "Solving Linear Equations",
      learningOutcomes: ["Isolate the variable.", "Solve one-step and two-step equations."],
      objectives: [
        { id: "obj1", text: "Solve the equation step by step." }
      ],
      theory: "To solve a linear equation, isolate the variable by applying inverse operations. For 2x + 5 = 13: subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4.",
      formulae: ["2x + 5 = 13 \\implies x = 4"],
      hints: ["Use the Step-by-Step solver. At each step, decide what operation brings x closer to being alone."],
      tasks: [
        { id: "task1", instruction: "Solve 2x + 5 = 13 using the step-by-step solver.", validationKey: "isSolved" }
      ],
      keyConcepts: ["Inverse operations undo each other.", "Isolate x by reversing all operations applied to it."],
      commonMistakes: ["Forgetting to apply inverse operation to BOTH sides."],
      engineConfig: { mode: "solve", expression: "2x + 5 = 13" }
    },
    metadata: { estimatedDuration: 25, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Solve: 3x - 6 = 9", options: ["x = 5", "x = 3", "x = 2", "x = 7"], correctAnswer: "x = 5" }
      ]
    }
  },

  'class-9/factorisation': {
    lesson: {
      title: "Factorisation",
      learningOutcomes: ["Factor simple algebraic expressions.", "Take out the common factor."],
      objectives: [
        { id: "obj1", text: "Factor the expression 2x + 4." }
      ],
      theory: "Factorisation means expressing an expression as a product of its factors. For example, 2x + 4 = 2(x + 2) because 2 is a common factor of both terms.",
      formulae: ["2x + 4 = 2(x + 2)", "ax + ab = a(x + b)"],
      hints: ["Find the greatest common factor (GCF) of all terms, then divide each term by it."],
      tasks: [
        { id: "task1", instruction: "Identify the common factor and simplify 3x + 6.", validationKey: "any" }
      ],
      keyConcepts: ["Common factors can be extracted.", "Factorisation is the reverse of expansion."],
      commonMistakes: ["Only factoring one term instead of all terms."],
      engineConfig: { mode: "simplify", expression: "3x + 6" }
    },
    metadata: { estimatedDuration: 22, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "Factor: 4x + 8", options: ["4(x + 2)", "2(2x + 8)", "4x + 8", "x(4 + 8)"], correctAnswer: "4(x + 2)" }
      ]
    }
  },

  'class-9/coefficients': {
    lesson: {
      title: "Coefficients",
      learningOutcomes: ["Identify the coefficient in a term.", "Understand how coefficients scale variables."],
      objectives: [
        { id: "obj1", text: "Identify the coefficient in each term of an expression." }
      ],
      theory: "A coefficient is the numerical part of a term. In 5x, the coefficient is 5. In -3x², the coefficient is -3. Coefficients tell us how many times the variable is counted.",
      formulae: ["5x \\implies \\text{coefficient} = 5", "-3x^2 \\implies \\text{coefficient} = -3"],
      hints: ["Look at the number directly before the variable letter."],
      tasks: [
        { id: "task1", instruction: "Identify the coefficient in 4x + 7.", validationKey: "any" }
      ],
      keyConcepts: ["Coefficient is the numerical multiplier of a variable.", "Can be positive, negative, or fractional."],
      commonMistakes: ["Confusing coefficient with constant."],
      engineConfig: { mode: "simplify", expression: "4x + 7" }
    },
    metadata: { estimatedDuration: 15, requiredEngine: "Algebra Engine" },
    quiz: {
      questions: [
        { id: "q1", type: "mcq", question: "What is the coefficient in -7x²?", options: ["7", "-7", "x", "2"], correctAnswer: "-7" }
      ]
    }
  }
};

for (const [key, files] of Object.entries(algebraLessons)) {
  const dirPath = path.join(root, key);
  fs.mkdirSync(dirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'lesson.json'), JSON.stringify(files.lesson, null, 2));
  fs.writeFileSync(path.join(dirPath, 'quiz.json'), JSON.stringify(files.quiz, null, 2));
  fs.writeFileSync(path.join(dirPath, 'metadata.json'), JSON.stringify(files.metadata || {}, null, 2));
  console.log(`Created: ${key}`);
}

console.log('\nSuccessfully generated 10 Algebra lesson packages for Phase 9A.');
