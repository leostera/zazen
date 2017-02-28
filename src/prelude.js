type composeFn = (f: Function) => (g: Function) => *
export const compose: composeFn = f => g => x => f(g(x))

export const id = (x: *): * => x

export const isNil = (x: mixed): boolean => x === undefined || x === null
