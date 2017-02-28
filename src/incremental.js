import type {
  EitherT,
} from './either'

import {
  cond,
  match,
} from './cond'

import {
  either,
  Left,
  Right,
} from './either'

import {
  second,
} from './pair'

import {
  isNil
} from './prelude'

const snd = either(second)(second)

const remap = which => newIn => n => cond(
  [ n instanceof Array, () => n.map(remap(which)(newIn)) ],
  [ true, () => which.of([newIn, snd(n)]) ])

const newNextIO = subtree => which => newIn => (next,i) => cond(
  [ isSubtree(subtree[i])(next), () => next.map(remap(which)(newIn)) ],
  [ true, () => remap(which)(newIn)(next) ])

const matcher = which => subtree => subtreeIO => ([nodeIn, nodeOut]) =>
  cond(
    [ subtree.length > 0, () => [
        which.of([nodeIn, nodeOut]),
        ...subtree.map( (t,i) => Graph([t])(
          [ subtreeIO.map(newNextIO(subtree)(which)(nodeOut))[i] ],
        ))
      ]
    ],
    [true, () => which.of([nodeIn, nodeOut]) ])

const isSubtree = node => io => node instanceof Array && io instanceof Array

type GraphFn = (a: *) => (b: *) => *
export const Graph: GraphFn = ([node, ...subtree]) => ([nodeIO, ...subtreeIO]) =>
  cond(
    [ isNil(node), undefined ],
    [ isSubtree(node)(nodeIO), () => Graph(node)(nodeIO) ],
    [ true, () => match({
                    Left: matcher(Left)(subtree)(subtreeIO),
                    Right: matcher(Right)(subtree)(subtreeIO),
                  })( node(nodeIO) )])
