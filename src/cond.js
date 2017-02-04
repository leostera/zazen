import type {
  PairT,
} from './pair'

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

const matchToCond = matches => action => match => ([
  eq(action[Symbol.for('@@type')], Symbol.for(match)),
  ap(matches[match], action[Symbol.for('@@value')])
])
const mapKeys = a => f => Object.keys(a).map(f)
const createConds = matches => action => mapKeys(matches)(matchToCond(matches)(action))
const match = matches => action => cond(...createConds(matches)(action))

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
