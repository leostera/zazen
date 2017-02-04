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

export type Matches = Object

type matchToCondFn = (a: Matches) => (b: *) => (a: *) => CondPairT
const matchToCond: matchToCondFn = matches => action => match => ([
  eq(action[0], match),
  ap(matches[match], action[1])
])

type _mapKeysFn = (a: Object) => (f: Function) => Array<*>
const _mapKeys: _mapKeysFn = a => f => Object.keys(a).map(f)

type createCondsFn = (a: Matches) => (b: *) => Array<CondPairT>
const createConds: createCondsFn = matches => action =>
  _mapKeys(matches)(matchToCond(matches)(action))

type createMatchFn = (f: (x: *) => *) => (a: Matches) => (b: *) => mixed
const createMatch: createMatchFn = typeChecker => matches => action => cond(...createConds(matches)(typeChecker(action)))

import { createType } from './type'
import type {Data, Type, TypeChecker} from './type'

type IncT = Type<'Inc', number>
type DecT = Type<'Dec', number>
type ResetT = Type<'Reset', number>
type WhatT = Type<'What', number>
const IncAction: Data<IncT, number> = createType('Inc')
const DecAction: Data<DecT, number> = createType('Dec')
const ResetAction: Data<ResetT, number> = createType('Reset')
const WhatAction: Data<WhatT, number> = createType('What')

type ActionT = IncT | DecT | ResetT
const id: TypeChecker<ActionT> = x => x

const match = createMatch(id)
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
