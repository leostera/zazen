export type PairT<A, B> = [A, B]
export type TaggedPairT<A> = PairT<string, A>

type SwapFn = (p: PairT<*, *>) => PairT<*, *>
const swap: SwapFn = ([a, b]) => [b,a]

type UntagFn = (p: TaggedPairT<*>) => ?mixed
const untag: UntagFn = ([tag, value]) => value

type PairFn = (a: mixed, b: mixed) => PairT<*,*>
const Pair: PairFn = (a, b) => [a, b]

export {
  Pair,
  swap,
  untag,
}
