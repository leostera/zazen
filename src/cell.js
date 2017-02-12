import {
  match,
  cond,
} from './cond'

import {
  Arrow,
} from './arrow'

import {
  swap,
} from './pair'

import {
  either,
} from './either'

import {
  type,
} from './type'

const Recompute = type('Right')
const Stable = type('Left')

const id = x => x

const retag = ([fa, [b, c]]) =>
  cond(
    [ fa !== b , Recompute.of([fa, c]) ],
    [ true, Stable.of([b, c]) ])

const flattenEither = either(x => Stable.of(x))(id)

const matchedSwap = match({
  Left:  ([h,t]) => Left.of([t,h]),
  Right: ([h,t]) => Right.of([t,h]),
})

// (id +++ (f *** id) >>> retag) >>> flatten
const Cell = f =>
  Arrow(id).sum(
    Arrow(f)
    .product(id)
    .pipe(retag)
  ).pipe(flattenEither)

export {
  Cell,
  Recompute,
  Stable,
}
