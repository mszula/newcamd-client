// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export const pipe = <T>(value: T, ...fns: Array<(arg: T) => T>) =>
  fns.reduce((acc, fn) => fn(acc), value);
