import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { IndexCache } from './types';

export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.toLowerCase().endsWith('.pdf')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

export function getFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

export function getLastModified(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.mtimeMs;
}

export function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export function writeJson(filePath: string, data: any) {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function readJson<T>(filePath: string, defaultVal: T): T {
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return defaultVal;
    }
  }
  return defaultVal;
}

export function writeMarkdown(filePath: string, content: string) {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, content, 'utf-8');
}
