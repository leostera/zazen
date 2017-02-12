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
          : Recompute.of([
            result,
            next(Recompute.of([result, tail]))
          ])
      )(f(arg))
    })
  )

  // TODO:
  // 1. Revert the constructor
  // 2. Use product composing from the inside out
  c.product = g => x => match({
    Stable: Stable.of,
    Recompute: ([head, [_, tail]]) => Recompute.of([
      head,
      g(Recompute.of([head, tail])
    ])
  })(c(x))

  // c.pipe = Cell.pipe(c)


  return c
}

// Cell.pipe = c => g => Cell.of(x => match({
//   Stable: y => Stable.of(y),
//   Recompute: (x) => {
//     console.log('about to recompute', x)
//     const [head, [_, tail]] = x
//     return Recompute.of([
//       head,
//       g(Recompute.of([head, tail]))
//     ])
//   }
// })(c(x)))
//
// Cell.of = f => {
//   const c = Arrow(f)
//
//   c.pipe = g => {
//     console.log('piping', g)
//     return Cell.pipe(c)(g)
//   }
//
//   return c
// }

const c = Cell( x => x.toUpperCase(), x => x)
const b = Cell( x => `${x} of Cells`, c )
const a = Cell( x => `${x} world`, b )

const result = a(Recompute.of(['hello', ['not expected', ['wat', ['HELLO WORLD OF CELLS', []]]]]))

console.log(result)
console.log(result['@@value'])
console.log(result['@@value'][1]['@@value'])
console.log(result['@@value'][1]['@@value'][1]['@@value'])

// const c = Cell( x => x.toUpperCase() )

// console.log(b(Recompute.of(['world', ['world of Cells', []]])))

// const result = a.pipe(b).pipe(c)(
//   Recompute.of([
//     'hello',
//     [
//       'hello monica',
//       [
//         'hello world of Cells',
//         [
//           '',
//           [
//             '',
//             [
//               '',
//               []
//             ]
//           ]
//         ]
//       ]
//     ]
//   ])
// )
//
// console.log(result)
// console.log(result['@@value'])
// console.log(result['@@value']['@@value'])

// const tree = Recompute.of([2, Stable.of([4, Recompute.of([5, 0])])])
//
// const fromRecomputation = x =>
//   (next => match({Stable: next, Recompute: next })(x))
//   (([head, tail]) => [head, tail != null ? fromRecomputation(tail) : null ])
//
// console.log(tree)
// console.log(fromRecomputation(tree))


// const Cell = f => {
//   const c = Arrow( either(
//     ([head, tail]) => (
//       result => (console.log('result', result, tail), result === tail[0]
//         ? Right.of(tail)
//         : Left.of([result, tail[1]]))
//     )(Arrow(f)(head))
//   )(
//     Arrow(id).pipe(Left.of)
//   ) )
//
//   c.pipe = g =>
//     Cell.of(
//       x =>
//         either(
//           ([head, tail]) => Left.of([
//             head,
//             g(
//               Left.of(
//                 (console.log('tail', tail), tail)
//               )
//             )
//           ])
//         )(
//           Arrow(id).pipe(Right.of)
//         )(c(x))
//     )
//
//   return c
// }
//
// Cell.of = f => Arrow(f)
//
// const b = Cell( x => (console.log('b', x), x + 2) )
// const c = Cell.of( Arrow(id).product(id).sum(Arrow(id).product(id)) )
//
// const finalResult = a.pipe(id)(Left.of([2, [2, [5, [null]]]]))
//
// console.log('finalResult', finalResult)
// console.log('finalResultInner', finalResult['@@value'])

// console.log(
//   a.pipe(b)(
//     Left.of([
//       2,
//       [
//         2,
//         null
//       ]
//     ])
//   )
// )
