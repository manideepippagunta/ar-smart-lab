# Science Curriculum Coverage Report

This report documents the status of the integrated NCERT Science curriculum, active chapters, lessons, target simulation engines, and missing assets or quizzes.

---

## 1. Grade-Level Coverage & Status

| Class | Chapter | Lesson / Activity | Required Simulation Engine | Missing Assets | Missing Quizzes |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **Class 6** | Ch 13: Fun with Magnets | Finding directions using suspended bar magnet | `Magnetism Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 6** | Ch 16: Garbage In, Garbage Out | Landfill simulation & organic decomposition | `Water Cycle Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 7** | Ch 4: Heat | Feeling hot & cold water temperature difference | `Heat Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 7** | Ch 5: Acids, Bases & Salts | Litmus paper chemical reaction test | `Chemical Reaction Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 8** | Ch 8: Cell Structure & Functions | Observing onion peel cell microscope structures | `Plant Cell Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 9** | Ch 1: Matter in Our Surroundings | Observing spaces between molecule particles | `Molecule Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 10** | Ch 12: Electricity | Constructing electric circuit to verify Ohm's law | `Electric Circuit Engine` | Assets JSON placeholder | Complete quiz content |
| **Class 10** | Ch 6: Life Processes | Starch test in a leaf for photosynthesis | `Anatomy Engine` | Assets JSON placeholder | Complete quiz content |

---

## 2. Validation & Discovery Results

The indexing pipeline was executed successfully over the `Data/pdf/Science/` curriculum corpus:
- **Total PDFs Scanned:** 8 Science PDFs.
- **Successful Classifications:**
  - `class-6-fun-with-magnets.pdf` $\rightarrow$ Classified as **Physics** (Class 6).
  - `class-6-garbage-in-garbage-out.pdf` $\rightarrow$ Classified as **Earth & Environmental Science** (Class 6).
  - `class-7-heat.pdf` $\rightarrow$ Classified as **Physics** (Class 7).
  - `class-7-acids-bases-salts.pdf` $\rightarrow$ Classified as **Chemistry** (Class 7).
  - `class-8-cell-structure.pdf` $\rightarrow$ Classified as **Biology** (Class 8).
  - `class-9-matter-surroundings.pdf` $\rightarrow$ Classified as **Chemistry** (Class 9).
  - `class-10-electricity.pdf` $\rightarrow$ Classified as **Physics** (Class 10).
  - `class-10-life-processes.pdf` $\rightarrow$ Classified as **Biology** (Class 10).

- **JSON Packages Generated:** Fully modular packages containing `lesson.json`, `quiz.json`, `metadata.json`, `assets.json`, `translations.json`, and `formula.json` are written to disk under the corresponding subject folders.
