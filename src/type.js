type Element = {
  '@@type': string,
  '@@value': string,
  fold: (f: any => any) => any,
  inspect: () => string,
  map: (f: any => any) => Element
}

type Type = {
  of: (x: any) => Element
}

const createType = (name: string): Type => {
  const of = x => Object.freeze({
    '@@type': name,
    '@@value': x,
    fold: f => f(x),
    inspect: () => `${name}(${x})`,
    map: f => Object.freeze(of(f(x))),
  })

  return Object.freeze({of})
}

export {
  createType,
}
