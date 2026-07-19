export function mapToEngine(activityTitle: string, keywords: string[]): string {
  const combined = (activityTitle + ' ' + keywords.join(' ')).toLowerCase();

  // Math Engines
  if (combined.includes('fraction')) return 'Fraction Engine';
  if (combined.includes('triangle')) return 'Triangle Engine';
  if (combined.includes('circle')) return 'Circle Engine';
  if (combined.includes('polygon') || combined.includes('quadrilateral')) return 'Polygon Engine';
  if (combined.includes('coordinate')) return 'Coordinate Engine';
  if (combined.includes('graph')) return 'Graph Engine';
  if (combined.includes('abacus')) return 'Abacus Engine';
  if (combined.includes('number line')) return 'Number Line Engine';
  if (combined.includes('probability')) return 'Probability Engine';
  if (combined.includes('statistics') || combined.includes('data handling')) return 'Statistics Engine';
  if (combined.includes('mensuration') || combined.includes('area') || combined.includes('volume')) return 'Mensuration Engine';
  if (combined.includes('cube')) return 'Cube Engine';
  if (combined.includes('cuboid')) return 'Cuboid Engine';
  if (combined.includes('cylinder')) return 'Cylinder Engine';
  if (combined.includes('cone')) return 'Cone Engine';
  if (combined.includes('sphere')) return 'Sphere Engine';
  if (combined.includes('transformation') || combined.includes('symmetry')) return 'Transformation Engine';
  if (combined.includes('reflection')) return 'Reflection Engine';
  if (combined.includes('rotation')) return 'Rotation Engine';
  if (combined.includes('integer')) return 'Integer Engine';

  // Science Engines
  if (combined.includes('electric circuit') || combined.includes('circuit') || combined.includes('electricity')) return 'Electric Circuit Engine';
  if (combined.includes('human body') || combined.includes('heart') || combined.includes('digestive') || combined.includes('anatomy')) return 'Anatomy Engine';
  if (combined.includes('plant cell')) return 'Plant Cell Engine';
  if (combined.includes('animal cell')) return 'Animal Cell Engine';
  if (combined.includes('cell')) return 'Cell Engine';
  if (combined.includes('solar system') || combined.includes('planet')) return 'Solar System Engine';
  if (combined.includes('water cycle')) return 'Water Cycle Engine';
  if (combined.includes('magnetism') || combined.includes('magnet')) return 'Magnetism Engine';
  if (combined.includes('light') || combined.includes('optics')) return 'Light Engine';
  if (combined.includes('sound')) return 'Sound Engine';
  if (combined.includes('heat') || combined.includes('temperature')) return 'Heat Engine';
  if (combined.includes('periodic table')) return 'Periodic Table Engine';
  if (combined.includes('molecule') || combined.includes('atom')) return 'Molecule Engine';
  if (combined.includes('chemical reaction') || combined.includes('reaction') || combined.includes('acid') || combined.includes('base')) return 'Chemical Reaction Engine';

  // Default fallbacks based on broad keywords
  if (keywords.length > 0) {
    if (keywords.includes('geometry')) return 'Geometry Engine';
    if (keywords.includes('physics')) return 'Physics Engine';
    if (keywords.includes('chemistry')) return 'Chemistry Engine';
    if (keywords.includes('biology')) return 'Biology Engine';
  }

  // Absolute fallback
  return 'Interactive Engine';
}
