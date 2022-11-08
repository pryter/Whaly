export const splitArray = (a: any[], size: number) =>
  Array.from(new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size))
