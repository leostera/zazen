export type PairT<A, B> = [A, B]
export type TaggedPairT<A> = PairT<string, A>

type SwapFn = (p: PairT<*, *>) => PairT<*, *>
const swap: SwapFn = ([a, b]) => [b,a]

type UntagFn = (p: TaggedPairT<*>) => ?mixed
const untag: UntagFn = ([tag, value]) => value

type PairFn = (a: mixed, b: mixed) => PairT<*,*>
const Pair: PairFn = (a, b) => [a, b]

const first  = ([a, b]: PairT<*,*>): * => a
const second = ([a, b]: PairT<*,*>): * => b

const dupe = (x: *): PairT<*,*> => [x,x]

type runPairFn = (f: Function) => (g: Function) => (ab: PairT<*,*>) => PairT<*,*>
const runPair: runPairFn = f => g => ([a,b]) => [f(a), g(b)]

export {
  Pair,
  dupe,
  first,
  runPair,
  second,
  swap,
  untag,
}
