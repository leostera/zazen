import {
  untag,
} from './pair'

import {
  ap,
  cond,
  eq,
} from './cond'

type _Left<A>  = ['Left',  A]
type _Right<B> = ['Right', B]
export type Either<A, B> = _Left<A> | _Right<B>

const Left  = (a: mixed): _Left<*>  => ['Left',  a]
const Right = (b: mixed): _Right<*> => ['Right', b]

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
