export type Pair<A, B> = [A, B]
export type TaggedPair<A> = Pair<string, A>

type Swap = (p: Pair<*, *>) => Pair<*, *>
const swap: Swap = ([a, b]) => [b,a]

type Untag = (p: TaggedPair<*>) => ?mixed
const untag: Untag = ([tag, value]) => value

export {
  swap,
  untag,
}
