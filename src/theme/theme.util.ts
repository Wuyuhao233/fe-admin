interface Theme {
  rgbToHex(r: number, g: number, b: number, a?: number): string;
}
export const rgbToHex: Theme['rgbToHex'] = (r, g, b, a) => {
  let r1 = r.toString(16);
  let g1 = g.toString(16);
  let b1 = b.toString(16);

  if (r1.length === 1) {
    r1 = '0' + r;
  }

  if (g1.length === 1) {
    g1 = '0' + g;
  }

  if (b1.length === 1) {
    b1 = '0' + b;
  }

  if (a) {
    let a1 = a.toString(16);
    if (a1.length === 1) {
      a1 = '0' + a;
    }
    return '#' + r1 + g1 + b1 + a1;
  }

  return '#' + r + g + b;
};
export function rgbaToNumbers(rgba: string) {
  if (rgba.startsWith('rgba')) {
    const rgbaArr = rgba.replace('rgba(', '').replace(')', '').split(',');
    return rgbaArr.map((item) => parseInt(item));
  }
  if (rgba.startsWith('rgb')) {
    const rgbArr = rgba.replace('rgb(', '').replace(')', '').split(',');
    return rgbArr.map((item) => parseInt(item));
  }
  throw new Error('rgba格式不正确');
}
