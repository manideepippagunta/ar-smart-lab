import { parseSections } from './scripts/indexer/sectionParser';
import { parsePdf } from './scripts/indexer/parser';
import * as path from 'path';

async function test() {
  const file = path.resolve('Data/pdf/lelm401.pdf');
  const result = await parsePdf(file);
  const lessons = parseSections(result.text, result.text.substring(0, 10000), 'lelm401.pdf', file);
  console.log(`Extracted ${lessons.length} lessons`);
  if (lessons.length > 0) {
    console.log(lessons[0]);
  }
}
test();
