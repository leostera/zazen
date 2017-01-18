import type {
  Pair,
} from './pair'

const eq = (a: mixed, b: mixed):    PredicateFn => () => a === b
const ap = (f: Function, a: mixed): PredicateFn => () => f(a)

type PredicateFn  = (...args: *) => boolean
type Predicate = mixed | PredicateFn
export type CondPair = Pair<Predicate, mixed>

const run = (a: Predicate): mixed => typeof a == 'function' && a() || a

const run_cond = ([pred, branch]: CondPair): mixed => run(pred) && run(branch)

const reducer = (a: mixed, cond: CondPair): mixed => a || run_cond(cond) || a

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
