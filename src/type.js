// @flow
export type ElementT<A, B> = {
  '@@type': A,
  '@@value': B,
  map: (F: ((x: B) => B)) => B
}


export type TypeT<A> = {
  of: (x: *) => ElementT<A, *>
}

const createType = <A>(name: string): TypeT<A> => {
  const of = (x:*): ElementT<A, *> => Object.freeze({
    '@@type': name,
    '@@value': x,
    fold: f => f(x),
    inspect: () => `${name}(${x.toString()})`,
    map: f => Object.freeze(of(f(x))),
  })

  map = (a: IncTag) => 


  return Object.freeze({
    of,
    map: x => f => Object.freeze(of(f(x)))
  })
}

export {
  createType,
}

type IncTag = 'Inc'

const IncType: TypeT<IncTag> = createType('Inc')

IncType.of(1)
  .map(x => 'should fail')
