import type {
  PairT,
} from './pair'

type PredicateFn  = (...args: *) => boolean
type Predicate = mixed | PredicateFn
export type CondPairT = PairT<Predicate, mixed>

type Eq = (a: mixed, b: mixed) => PredicateFn
const eq: Eq = (a,b) => () => a === b

type Ap = (f: Function, a: mixed) => PredicateFn
const ap: Ap = (f, a) => () => f(a)

type Just<A> = (a: A) => () => A
const just: Just<*> = a => () => a

type Run = (a: Predicate) => mixed
const run: Run = a => ((typeof a == 'function' && a || just(a))())

type RunCond = (a: CondPairT) => mixed
const run_cond: RunCond = ([pred, branch]) => run(pred) && run(branch)

type Reducer = (a: mixed, b: CondPairT) => mixed
const reducer: Reducer = (a, cond) =>
  a || ( b => (b === 0 ? 0 : (b || a)) )(run_cond(cond))

export type Cond = (...pairs: Array<CondPairT>) => mixed
const cond: Cond = (...conds) => conds.reduce(reducer, undefined)

type matchToCondFn = (a: Object) => (b: *) => (a: *) => CondPairT
const matchToCond: matchToCondFn = matches => action => match => ([
  eq(action['@@type'] || typeof action, match),
  ap(matches[match], action['@@value'] || action)
])

type _mapKeysFn = (a: Object) => (f: Function) => Array<*>
const _mapKeys: _mapKeysFn = a => f => Object.keys(a).map(f)

type createCondsFn = (a: Object) => (b: *) => Array<CondPairT>
const createConds: createCondsFn = matches => action =>
  _mapKeys(matches)(matchToCond(matches)(action))

type createMatchFn = (f: (x: *) => *) => (a: Object) => (b: *) => mixed
const createMatch: createMatchFn = typeChecker => matches => action =>
  cond(...createConds(matches)(typeChecker(action)))

export {
  ap,
  cond,
  createMatch,
  eq,
  reducer,
  run,
  run_cond,
}
