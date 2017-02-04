const createType = name => {
  const of = x => ({
    [Symbol.for('@@type')]: Symbol.for(name),
    [Symbol.for('@@value')]: x,
    fold: f => f(x),
    inspect: () => `${name}(${x})`,
    map: f => Object.freeze(of(f(x)))
  })
  return Object.freeze({of})
}

export {
  createType,
}
