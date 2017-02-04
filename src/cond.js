import type {
  PairT,
} from './pair'

import type {
  ElementT,
} from './type'

type PredicateFn  = (...args: *) => boolean
type Predicate = mixed | PredicateFn
export type CondPairT = PairT<Predicate, mixed>

type Eq = (a: mixed, b: mixed) => PredicateFn
const eq: Eq = (a,b) => () => (console.log(a, "===",  b), a === b)

type Ap = (f: Function, a: mixed) => PredicateFn
const ap: Ap = (f, a) => () => (console.log(f,"(",a,")"), f(a))

type Just<A> = (a: A) => () => A
const just: Just<*> = a => () => a

type Run = (a: Predicate) => mixed
const run: Run = a => ((typeof a == 'function' && a || just(a))())

type RunCond = (a: CondPairT) => mixed
const run_cond: RunCond = ([pred, branch]) => run(pred) && run(branch)

type Reducer = (a: mixed, b: CondPairT) => mixed
const reducer: Reducer = (a, cond) => a || ( b => (b === 0 ? 0 : (b || a)) )(run_cond(cond))

export type Cond = (...pairs: Array<CondPairT>) => mixed
const cond: Cond = (...conds) => conds.reduce(reducer, undefined)

export type Matches = Object

type matchToCondFn = (a: Matches) => (b: ElementT<*>) => (a: ElementT<*>) => CondPairT
const matchToCond: matchToCondFn = matches => action => match => ([
  eq(action['@@type'], match),
  ap(matches[match], action['@@value'])
])

type _mapKeysFn = (a: Object) => (f: Function) => Array<*>
const _mapKeys: _mapKeysFn = a => f => Object.keys(a).map(f)

type createCondsFn = (a: Matches) => (b: ElementT<*>) => Array<CondPairT>
const createConds: createCondsFn = matches => action =>
  _mapKeys(matches)(matchToCond(matches)(action))

type matchFn = (a: Matches) => (b: ElementT<*>) => mixed
const match: matchFn = matches => action => cond(...createConds(matches)(action))

import { createType } from './type'

const IncAction = createType('Inc')
const DecAction = createType('Dec')
const ResetAction = createType('Reset')
const WhatAction = createType('What')

const cata = match({
  Inc: x => x+1,
  Dec: x => x-1,
  Reset: x => 0
})

console.log(cata(IncAction.of(10)))
console.log(cata(DecAction.of(10)))
console.log(cata(ResetAction.of(null)))
console.log(cata(WhatAction.of(100)))

export {
  ap,
  cond,
  eq,
  match,
  reducer,
  run,
  run_cond,
}
