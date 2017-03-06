import type {
  PairT,
} from './pair'

export const log = x => (console.log(x), x)

type composeFn = (f: Function) => (g: Function) => *
export const compose: composeFn = f => g => x => f(g(x))

export const id = (x: *): * => x

export const isNil = (x: mixed): boolean => x === undefined || x === null

export const and = a => b => a && b
export const or  = a => b => a || b
export const not = x => !x

export const isArray = Array.isArray
export const isObject = x => and( not(isArray(x)) )(x instanceof Object)

export const eqList = eq => a => b =>
  a.length === b.length
  ? zip(a)(b).map( ([a,b]) => eq(a)(b) ).reduce( (acc,e) => and(acc)(e), true)
  : false

const toPropList = a => Object.keys(a).sort().map( name => [name, a[name]] )

export const eqObj = eq => a => b => eq( toPropList(a) )( toPropList(b) )

export const eq = a => b => cond(
  [ isArray(a)  && isArray(b),  () => eqList(eq)(a)(b) ],
  [ isObject(a) && isObject(b), () => eqObj(eq)(a)(b)  ],
  [ true, a === b ])

export const zip = ([a, ...as]) => ([b, ...bs]) => [
  [a,b], ...( as.length > 0 && bs.length > 0 ? zip(as)(bs) : [] )
]

type PredicateFn  = (...args: *) => boolean
type Predicate = mixed | PredicateFn
export type CondPairT = PairT<Predicate, mixed>

type Just<A> = (a: A) => () => A
export const just: Just<*> = a => () => a

type Run = (a: Predicate) => mixed
export const run: Run = a => ((typeof a == 'function' && a || just(a))())

type RunCond = (a: CondPairT) => CondPairT
const run_cond: RunCond = ([pred, branch]) =>
  ( x => [x, x && branch] )(run(pred))

type Reducer = (a: mixed, b: CondPairT) => mixed
const reducer: Reducer = (a, cond) =>
  isNil(a) ? ( ([pred, branch]) => (pred ? branch : a) )( run_cond(cond) ) : a

export type Cond = (...pairs: Array<CondPairT>) => any
export const cond: Cond = (...conds) => run(conds.reduce(reducer, undefined))

const withDefault = (a, b, c) =>
  (isNil(a) || Object.keys(a).indexOf(b) === -1) ? c : a[b]

type matchToCondFn = (a: Object) => (b: *) => (a: *) => CondPairT
const matchToCond: matchToCondFn = matches => value => match => ([
  () => eq(withDefault(value, '@@type', typeof value))(match),
  () => matches[match](withDefault(value, '@@value', value))
])

type _mapKeysFn = (a: Object) => (f: Function) => Array<*>
const _mapKeys: _mapKeysFn = a => f => Object.keys(a).map(f)

type createCondsFn = (a: Object) => (b: *) => Array<CondPairT>
const createConds: createCondsFn = matches => value =>
  _mapKeys(matches)(matchToCond(matches)(value))

type createMatchFn = (f: (x: *) => *) => (a: Object) => (b: *) => mixed
export const createMatch: createMatchFn = typeChecker => matches => value =>
  cond(...createConds(matches)(typeChecker(value)))

export const match = createMatch(id)
