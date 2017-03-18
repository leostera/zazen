import type {
  PairT,
} from './pair'

export const log = (x: *): * => (console.log(x), x)

type composeFn = (f: Function) => (g: Function) => *
export const compose: composeFn = f => g => x => f(g(x))

export const id = (x: *): * => x

export const isNil = (x: mixed): boolean => x === undefined || x === null

export const and = (a: boolean) => (b: boolean): boolean => a && b
export const or = (a: boolean) => (b: boolean): boolean => a || b
export const not = (x: boolean): boolean => !x

export const isArray: (x: mixed) => boolean = Array.isArray
export const isObject = (x: mixed): boolean => and( not(isArray(x)) )(x instanceof Object)

type eqFn = (a: mixed) => (b: mixed) => boolean
type eqListFn = (eq: eqFn) => (a: mixed[]) => (b: mixed[]) => boolean
export const eqList: eqListFn = eq => a => b =>
  a.length === b.length
  ? zip(a)(b).map( ([a,b]) => eq(a)(b) ).reduce( (acc,e) => and(acc)(e), true)
  : false

type PropT = [string, mixed]
type PropListT = Array<PropT>
const toPropList = (a: Object): PropListT => Object.keys(a).sort().map( name => [name, a[name]] )

type eqObjFn = (eq: eqFn) => (a: Object) => (a: Object) => boolean
export const eqObj: eqObjFn = eq => a => b => eq(toPropList(a))(toPropList(b))

export const eq: eqFn = a => b => cond(
  // $FlowIgnore
  [ isArray(a)  && isArray(b),  () => eqList(eq)(a)(b) ],
  // $FlowIgnore
  [ isObject(a) && isObject(b), () => eqObj(eq)(a)(b)  ],
  [ true, a === b ])

type zipFn = (a: mixed[]) => (b: mixed[]) => mixed[][]
export const zip: zipFn = ([a, ...as]) => ([b, ...bs]) => [
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
