export type Pair<A, B>  = [A, B]
export type TaggedPair<A> = Pair<string, A>

const swap = ([a: A, b: B]: Pair<A, B>): Pair<B, A> => [b,a]

const untag = ([tag, value]: TaggedPair<A>): A => value

export {
  swap,
  untag,
}
