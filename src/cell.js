import type {
  ArrowT,
} from 'zazen/arrow'

import {
  cond,
} from './cond'

import {
  Arrow,
} from './arrow'

export type CellT = ArrowT & {
  last_args: [];
  last_val: ?mixed;
  dirty: Boolean;
}

export type CellFn = (fn: Function, child: CellT) => CellT
const Cell: CellFn = (fn, child) => {

  const _call = args => () => {
    cell_fn.last_args = args
    cell_fn.last_val = fn.apply({}, args)
    return [cell_fn.last_val, child(cell_fn.last_val)]
  }

  const _dirty = args => () => cell_fn.last_args[0] !== args [0]

  const cell_fn = Arrow((...args) => cond(
    [ _dirty(args), _call(args) ],
    [ true, cell_fn.last_val ]
  ))

  cell_fn.last_args = []
  cell_fn.last_val = undefined
  cell_fn.dirty = true

  return cell_fn
}


export {
  Cell,
}
