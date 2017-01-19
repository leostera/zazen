import type {
  Pair,
} from './pair'

type PredicateFn  = (...args: *) => boolean
type Predicate = mixed | PredicateFn
export type CondPair = Pair<Predicate, mixed>

type Eq = (a: mixed, b: mixed) => PredicateFn
const eq: Eq = (a,b) => () => a === b

type Ap = (f: Function, a: mixed) => PredicateFn
const ap: Ap = (f, a) => () => f(a)

type Just<A> = (a: A) => () => A
const just: Just<*> = a => () => a

type Run = (a: Predicate) => mixed
const run: Run = a => ((typeof a == 'function' && a || just(a))())

type RunCond = (a: CondPair) => mixed
const run_cond: RunCond = ([pred, branch]) => run(pred) && run(branch)

type Reducer = (a: mixed, b: CondPair) => mixed
const reducer: Reducer = (a, cond) => a || run_cond(cond) || a

export type Cond = (...pairs: Array<CondPair>) => mixed
const cond: Cond = (...conds) => conds.reduce(reducer, undefined)

export {
  ap,
  cond,
  eq,
  reducer,
  run,
  run_cond,
}
