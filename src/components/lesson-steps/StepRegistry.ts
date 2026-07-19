import React from 'react';

// Steps
import { StepIntro } from './StepIntro';
import { StepObjectives } from './StepObjectives';
import { StepTheory } from './StepTheory';
import { StepExploration } from './StepExploration';
import { StepGuidedActivity } from './StepGuidedActivity';
import { StepObservation } from './StepObservation';
import { StepRealWorld } from './StepRealWorld';
import { StepPractice } from './StepPractice';
import { StepQuiz } from './StepQuiz';
import { StepSummary } from './StepSummary';
import { StepComplete } from './StepComplete';

export const StepRegistry: Record<number, React.FC<any>> = {
  0: StepIntro,
  1: StepObjectives,
  2: StepTheory,
  3: StepExploration,
  4: StepGuidedActivity,
  5: StepObservation,
  6: StepRealWorld,
  7: StepPractice,
  8: StepQuiz,
  9: StepSummary,
  10: StepComplete
};

export const STEP_TITLES = [
  'Introduction',
  'Objectives',
  'Theory',
  'Exploration',
  'Guided Activity',
  'Observation',
  'Real World',
  'Practice',
  'Quiz',
  'Summary',
  'Complete'
];
