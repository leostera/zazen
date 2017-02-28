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

const flattenEither = either(Stable.of)(id)

/*
 * Flipping the values would make Cell's composable, but would use the
 * input of the first cell be the output of the next cell, which would
 * likely retrigger the computation (but maybe that's what you wanted anyways?)
 */
const matchedSwap = match({
  Left:  ([h,t]: PairT<*,*>) => Stable.of([t,h]),
  Right: ([h,t]: PairT<*,*>) => Recompute.of([t,h]),
})

const signature = f => f.toString().replace('function','').replace('return','').replace(/\(|\)|;/g,'').split('{').map( s => s.replace('}','').trim() ).join(' => ')

// (id +++ (f *** id) >>> retag) >>> flatten
type CellFn = (f: Function) => Arrow
const Cell: CellFn = f => {
  const _cell = Arrow(id).sum(
    Arrow(f)
    .product(id)
    .pipe(retag)
    .compose( ([a, b]) => [a, [a, b]] )
  ).pipe(flattenEither)

  _cell['@@type']  = 'Cell'
  _cell['@@value'] = f
  _cell.inspect = () => `${_cell['@@type']}(${signature(f)})`

  return _cell
}

const remap = which => newIn => next =>
  next
    .map( (n,j) => cond(
      [ log(`is next io (${j}) an array?`)(n instanceof Array),
        () => remap(which)(newIn)(log("next")(n)) ],
      [ true, () => (
        ([_,out]) => which.of([newIn, out])
      )(either(id)(id)(log("not an array")(n))) ]))

const newNextIO = subtree => nexts => which => newIn =>
  nexts.map( (next,i) => cond(
    [ isSubtree(subtree[i])(next), () => remap(which)(newIn)(next) ],
    [ true, () => remap(which)(newIn)([next])[0] ]))

const matcher = which => subtree => subtreeIO => ([nodeIn, nodeOut]) =>
  subtree.length > 0
  ? [
    which.of([nodeIn, nodeOut]),
    ...subtree.map( (t,i) => Graph([t])(
      [log("New Next IO")(newNextIO(subtree)(subtreeIO)(which)(nodeOut))[i]],
    ))
  ]
  : which.of([nodeIn, nodeOut])

const isSubtree = node => io => node instanceof Array && io instanceof Array
const isNil = x => x === undefined || x === null

const log = n => x => (console.log(n,"::",x), x)

const Graph = ([node, ...subtree]) => ([nodeIO, ...subtreeIO]) => cond(
  [ isNil(node), undefined ],
  [ isSubtree(node)(nodeIO), () => Graph(node)(nodeIO) ],
  [ true, () => match ({
                  Left: matcher(Left)(subtree)(subtreeIO),
                  Right: matcher(Right)(subtree)(subtreeIO),
                })(log("node")(node)(log("io")(nodeIO)))
  ])


export {
  Cell,
  Recompute,
  Stable,
  Graph,
}
