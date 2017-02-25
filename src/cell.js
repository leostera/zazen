import { log } from './utils'

import {
  match,
  cond,
} from './cond'

import {
  Arrow,
} from './arrow'

import {
  swap,
  second,
  first,
} from './pair'

import type {
  PairT
} from './pair'

import {
  either,
  Left,
  Right,
} from './either'

import {
  type,
} from './type'

const Recompute = type('Right')
const Stable = type('Left')

const id = x => x

const retag = ([fa, [a, b]]) =>
  cond(
    [ fa !== b , Recompute.of([a, fa]) ],
    [ true, Stable.of([a, b]) ])

const flattenEither = either(x => Stable.of(x))(id)

/*
 * Flipping the values would make Cell's composable, but would use the
 * input of the first cell be the output of the next cell, which would
 * likely retrigger the computation (but maybe that's what you wanted anyways?)
 */
const matchedSwap = match({
  Left:  ([h,t]: PairT<*,*>) => Stable.of([t,h]),
  Right: ([h,t]: PairT<*,*>) => Recompute.of([t,h]),
})

// (id +++ (f *** id) >>> retag) >>> flatten
type CellFn = (f: Function) => Arrow
const Cell: CellFn = f =>
  Arrow(id).sum(
    Arrow(f)
    .product(id)
    .pipe(retag)
    .compose( ([a, b]) => [a, [a, b]] )
  ).pipe(flattenEither)

/*
const compute = ([f, g]) =>
  match({
    Left: Left.of,
    Right: ([A, B]) => ( fa => Right.of( [ either(first)(first)(fa), (
      g.map( gi =>
        match({
          Left:  ([fa1, fa2]) => gi(Left.of(  [ fa2, either(second)(second)(B) ] )),
          Right: ([fa1, fa2]) => gi(Right.of( [ fa2, either(second)(second)(B) ] ))
        })(log(fa))
      )
    )]) )( f( Right.of([A, either(first)(first)(B) ]) ) )
  })
  */

const compute = ([f, g]) => match({
  Left: Left.of,
  Right: ([a, eitherB]) => (fa => Right.of([
    either(first)(first)(fa),
    Right.of([
      either(second)(second)(fa),
      g.map( (gi, index) => match({
        Left: ([faInput, faOutput]) => gi(
          Left.of([ faOutput, either(second)(second)(eitherB)[index]])),
        Right: ([faInput, faOutput]) => gi(
          Right.of([ faOutput, either(second)(second)(eitherB)[index]]))
      })(fa))
    ])
  ]))(
    f(
      Right.of([a, either(first)(first)(eitherB)])
    )
  )})


/*
const remap = Which => children => ios => ([inn, out]) => ([
  Which.of([inn, out]),
  children.map( c => compute(c)([Which.of(inn), ios]) )
])

const compute = ([node, children]) => ([inn, [out, rest]]) =>
  match({
    Cell: node => match({
      Left:  remap(Left)(children)(rest),
      Right: remap(Right)(children)(rest)
    })( node(inn) ),
    Graph: node => compute(node)(n),
  })(node)
*/

const Graph = cells => io => compute(cells)(io)

export {
  Cell,
  Recompute,
  Stable,
  Graph,
}
