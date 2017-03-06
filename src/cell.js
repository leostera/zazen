/*
 * Type imports
 */

import type {
  ArrowT,
} from './arrow'

/*
 * Dependencies
 */

import {
  cond,
} from './prelude'

import {
  Arrow,
} from './arrow'

import {
  either,
  Left,
  Right,
} from './either'

import {
  id,
  eq,
  not,
} from './prelude'

const dupeFirst = ([a, b]) => [a, [a, b]]

const retag = ([fa, [a, b]]) =>
  cond(
    [ not(eq(fa)(b)), Right.of([a, fa]) ],
    [ true, Left.of([a, b]) ])

const flattenEither = either(Left.of)(id)

export type CellT = ArrowT & {
  '@@type': 'Cell';
  '@@value': ArrowT;
}

type CellFn = (f: Function) => CellT
export const Cell: CellFn = f => {
  // _cell = (id +++ ( dupeFirst >>> (f *** id) >>> retag) >>> flatten
  const _cell = Arrow(id).sum(
    Arrow(dupeFirst)
      .pipe(Arrow(f).product(id))
      .pipe(retag)
  ).pipe(flattenEither)

  _cell['@@type']  = 'Cell'
  _cell['@@value'] = f
  _cell.inspect = () => `${_cell['@@type']}(${f.toString()})`

  return _cell
}

type runCellFn = (c: Cell) => (a: mixed) => *
export const runCell: runCellFn = c => a => c(Right.of([a, undefined]))
