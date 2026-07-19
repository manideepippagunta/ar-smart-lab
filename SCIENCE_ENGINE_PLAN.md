# Science Simulation Engine Implementation Plan

This plan recommends reusable simulation engines to support the NCERT Science syllabus, outlining target designs, shared components, and implementation efforts.

---

## 1. Physics Engine (Interactive Field & Vector Surface)

### A. Supported Lessons
- suspended bar magnet direction finder (Class 6 Physics)
- Lukewarm water heat transfers (Class 7 Physics)
- Ohm's law circuit builder (Class 10 Physics)

### B. Required Simulations
- **Magnetic Fields:** Interactive 3D vector arrows around suspended or moving bar magnets with magnetic field line drawings.
- **Electric Circuits:** An SVG schematic diagram builder with draggable resistors, switches, batteries, and bulbs, plotting real-time V-I curves.
- **Thermal Heat Transfer:** Color-gradient shaders illustrating heat flows and thermal conduction between liquids.

### C. Shared Reusable Components
- **Vector Field Visualiser:** Renders interactive arrows indicating field forces (used for magnetic and electric field vectors).
- **Draggable Element Snapping Panel:** An SVG-based dock where students can click and drag electrical nodes or components.
- **KaTeX Ohm's Law Calculator:** Dynamic step-by-step calculator panel showing $V = IR$ substitution loops.

### D. Estimated Implementation Effort
- **Timeline:** 3 Weeks.

---

## 2. Chemistry Engine (Particle & Equation Sandbox)

### A. Supported Lessons
- Litmus paper color reactions (Class 7 Chemistry)
- Spaces between water molecules (Class 9 Chemistry)

### B. Required Simulations
- **Molecular Matter Sandbox:** A particle physics simulation showing thermal motion of atoms in solid, liquid, and gas phases.
- **pH Chemical Reaction Lab:** Interactive beakers and indicator strips (litmus, pH indicators) displaying chemical color changes.

### C. Shared Reusable Components
- **2D/3D Particle Animator:** Render molecular bonds and particle spaces dynamically (using Canvas or Three.js).
- **Liquid Beaker UI:** An animated container component with liquid levels and color gradients representing pH concentrations.

### D. Estimated Implementation Effort
- **Timeline:** 2.5 Weeks.

---

## 3. Biology Engine (Microscopic Cell & System Visualiser)

### A. Supported Lessons
- Onion peel microscope cells structure (Class 8 Biology)
- Photosynthesis leaf starch test (Class 10 Biology)

### B. Required Simulations
- **Onion cell magnifier:** Interactive microscope view with slides focus zoom features, allowing students to identify cell walls, cytoplasm, and nuclei.
- **Leaf Photosynthesis lab:** An animated chlorophyll diagram where users apply iodine drops and observe color variations in green vs de-starched parts.

### C. Shared Reusable Components
- **Interactive Lens Magnifier:** Circular zoom overlay to inspect details on a virtual microscope slide.
- **Cell Structure Inspector:** Clickable labels showing explanations of cell organelle features.

### D. Estimated Implementation Effort
- **Timeline:** 2.5 Weeks.

---

## 4. Earth Science Engine (Environmental Cycle Simulator)

### A. Supported Lessons
- Landfill Organic degradation (Class 6 Earth Science)

### B. Required Simulations
- **Degradation Sandbox:** A cross-section representation of soil layers displaying organic compost decomposing vs non-degradable plastic trash persisting.

### C. Shared Reusable Components
- **Degradation Timeline Slider:** Controls calendar year intervals to visualize long-term environmental decay.
- **Soil Layer Render Surface:** Custom layered SVG elements displaying texture variations.

### D. Estimated Implementation Effort
- **Timeline:** 1.5 Weeks.
