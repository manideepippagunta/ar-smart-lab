import { parsePdf } from './scripts/indexer/parser';
import * as path from 'path';

async function test() {
  const file = path.resolve('Data/pdf/lelm401.pdf');
  const result = await parsePdf(file);
  const lines = result.text.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('activity')) {
      console.log(`[Line ${idx}]: "${line}"`);
      // Print context
      console.log(`   [${idx-1}] ${lines[idx-1]}`);
      console.log(`   [${idx+1}] ${lines[idx+1]}`);
      console.log(`   [${idx+2}] ${lines[idx+2]}`);
    }
  });
}
test();
