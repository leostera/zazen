export type PairT<A, B> = [A, B]
export type TaggedPairT<A> = PairT<string, A>

type SwapFn = (p: PairT<*, *>) => PairT<*, *>
export const swap: SwapFn = ([a, b]) => [b,a]

type UntagFn = (p: TaggedPairT<*>) => mixed
export const untag: UntagFn = ([tag, value]) => value

type PairFn = (a: mixed, b: mixed) => PairT<*,*>
export const Pair: PairFn = (a, b) => [a, b]

export const first  = ([a, b]: PairT<*,*>): * => a
export const second = ([a, b]: PairT<*,*>): * => b

export const dupe = (x: *): PairT<*,*> => [x,x]

type runPairFn = (f: Function) => (g: Function) => (ab: PairT<*,*>) => PairT<*,*>
export const runPair: runPairFn = f => g => ([a,b]) => [f(a), g(b)]
