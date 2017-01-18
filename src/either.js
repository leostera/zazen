import {
  ap,
  cond,
  eq,
} from './cond'

export type _Left<A>  = ['Left',  A]
export type _Right<B> = ['Right', B]
type Either<A, B> = _Left<A> | _Right<B>

const Left  = (a: mixed): _Left<*>  => ['Left',  a]
const Right = (b: mixed): _Right<*> => ['Right', b]

type EitherFn<C> = (f:((a:A)=>C)) => (g:((b:B)=>C)) => (e:Either<A,B>) => C
const either: EitherFn<*> = f => g => ([tag, a]) =>
  cond(
    [eq(tag, 'Left'), ap(f,a)],
    [eq(tag, 'Right'), ap(g, a)],
    [true, undefined])

export {
  Left,
  Right,
  either,
}
