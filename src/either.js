import {
  untag,
} from './pair'

import {
  ap,
  cond,
  eq,
} from './cond'

type LeftT<A>  = ['Left',  A]
type RightT<B> = ['Right', B]
export type Either<A, B> = LeftT<A> | RightT<B>

const Left  = (a: mixed): LeftT<*>  => ['Left',  a]
const Right = (b: mixed): RightT<*> => ['Right', b]

type C = ?mixed
// Can A and B be inferred here?
type EitherFn = (f:((a:*)=>C)) => (g:((b:*)=>C)) => (e:Either<*,*>) => C
const either: EitherFn = f => g => ([tag, a]) =>
  cond(
    [eq(tag, 'Right'), ap(g, a)],
    [eq(tag, 'Left'),  ap(f, a)])

const mirror = either(Right)(Left)

export {
  Left,
  Right,
  either,
  mirror,
}
