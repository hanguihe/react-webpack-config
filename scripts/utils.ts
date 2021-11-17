import path from 'path';

export function resolve(file: string) {
  return path.resolve(__dirname, `../${file}`);
}

export function convertTime(time?: number): string {
  if (typeof time !== 'number') {
    return '0s';
  }

  const second = time / 1000;

  if (second <= 60) {
    return `${second}s`;
  }
  return `${Math.floor(second / 100)}m${(second % 60).toFixed(2)}s`;
}

export function convertBundleSize(size?: number) {
  if (typeof size !== 'number') {
    return '0';
  }

  // 最小kb为单位
  const res = size / 1000;
  if (res < 1000) {
    return `${res.toFixed(2)} Kb`;
  }

  return `${(res / 1000).toFixed(2)} Mb`;
}
