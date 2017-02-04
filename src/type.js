const createType = name => {
  const of = x => {
    const element = [name, x]
    element.fold = f => f(x)
    element.inspect = () => `${name}(${x})`
    element.map = f => Object.freeze(of(f(x)))
    return Object.freeze(element)
  }

  return Object.freeze({of})
}

export {
  createType,
}
