import {
  Arrow,
} from './arrow'

import {
  Left,
  Right,
  either,
} from './either'

import {
  match,
} from './cond'

import {
  type,
} from './type'

const id = x => x

const Stable = type('Stable')
const Recompute = type('Recompute')

const Cell = (f, next) => {
  const c = Arrow(
    match({
      Stable: x => Arrow(id).product(Arrow(id).pipe(Stable.of))(x)[1],
      Recompute: ([arg, [expected, tail]]) => (
        result => result === expected
          ? Stable.of([expected, tail])
          : Recompute.of([result, tail])
      )(f(arg))
    })
  )

  c.product = Cell.product(c)

  return c
}

Cell.product = c => g =>
  Cell.of(
    x => match({
      Stable: y => Stable.of(y),
      Recompute: ([head, [_, tail]]) => Recompute.of([
        head,
        g(Recompute.of([head, tail]))
      ])
    })(c(x))
  )

Cell.of = f => {
  const c = Arrow(f)

  c.product = Cell.product(c)

  return c
}

const c = Cell( x => x.toUpperCase() )
const b = Cell( x => `${x} of Cells` ).product(c)
const a = Cell( x => `${x} world` ).product(b)

const result = a(Recompute.of(['hello', ['not expected', ['as', ['asd', ['adsf', []]]]]]))

console.log(result)
console.log(result['@@value'])
console.log(result['@@value'][1]['@@value'])
console.log(result['@@value'][1]['@@value'][1]['@@value'])

const fromRecomputation = x =>
  (next => match({Stable: next, Recompute: next })(x))
  (([head, tail]) => [head, tail != null ? fromRecomputation(tail) : null ])

export {
  Stable,
  Recompute,
  Cell,
  fromRecomputation,
}
