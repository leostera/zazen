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

type RunCond = (a: CondPairT) => CondPairT
const run_cond: RunCond = ([pred, branch]) =>
  ( x => [x, x && run(branch)] )(run(pred))

type Reducer = (a: mixed, b: CondPairT) => mixed
const reducer: Reducer = (a, cond) =>
  a || ( ([pred, branch]) => (pred ? branch : a) )( run_cond(cond) )

export type Cond = (...pairs: Array<CondPairT>) => mixed
const cond: Cond = (...conds) => conds.reduce(reducer, undefined)

const withDefault = (a, b, c) =>
  (a === null || a === undefined || Object.keys(a).indexOf(b) === -1) ? c : a[b]

type matchToCondFn = (a: Object) => (b: *) => (a: *) => CondPairT
const matchToCond: matchToCondFn = matches => action => match => ([
  eq(withDefault(action, '@@type', typeof action), match),
  ap(matches[match], withDefault(action, '@@value', action))
])

type _mapKeysFn = (a: Object) => (f: Function) => Array<*>
const _mapKeys: _mapKeysFn = a => f => Object.keys(a).map(f)

type createCondsFn = (a: Object) => (b: *) => Array<CondPairT>
const createConds: createCondsFn = matches => action =>
  _mapKeys(matches)(matchToCond(matches)(action))

type createMatchFn = (f: (x: *) => *) => (a: Object) => (b: *) => mixed
const createMatch: createMatchFn = typeChecker => matches => action =>
  cond(...createConds(matches)(typeChecker(action)))

const match = createMatch(x => x)

export {
  ap,
  cond,
  createMatch,
  eq,
  match,
  reducer,
  run,
  run_cond,
}
