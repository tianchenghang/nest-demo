import { readFileSync, createReadStream } from 'fs';
import { createHash } from 'crypto';

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

export function calculateCRC32(buf: Buffer): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    const rune = buf[i];
    crc = (crc >>> 8) ^ crcTable[(crc ^ rune) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

export function calculateFileCRC32(filepath: string): number {
  const buf = readFileSync(filepath);
  return calculateCRC32(buf);
}

export function formatCRC32(crcVal: number): string {
  return crcVal.toString(16).toUpperCase().padStart(8, '0');
}

export async function calculateFileHashesStream(filepath: string) {
  return new Promise((resolve, reject) => {
    const md5 = createHash('md5');
    const sha1 = createHash('sha1');
    const sha256 = createHash('sha256');
    let crc = 0 ^ -1;
    const stream = createReadStream(filepath);
    stream.on('data', (chunk: Buffer) => {
      md5.update(chunk);
      sha1.update(chunk);
      sha256.update(chunk);
      for (let i = 0; i < chunk.length; i++) {
        const rune = chunk[i];
        crc = (crc >>> 8) ^ crcTable[(crc ^ rune) & 0xff];
      }
    });

    stream.on('end', () => {
      const result = {
        md5: md5.digest('hex'),
        sha1: sha1.digest('hex'),
        sha256: sha256.digest('hex'),
        crc32: formatCRC32((crc ^ -1) >>> 0),
      };
      resolve(result);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}
