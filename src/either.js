import {
  untag,
} from './pair'

import {
  ap,
  cond,
  match,
  eq,
} from './cond'

import type {
  ElementT,
} from './type'

type LeftTag = 'Left'
type RightTag = 'Right'

type LeftT<A>  = ElementT<LeftTag, A>

type RightT<A>  = ElementT<RightTag, A>

export type Either<A, B> = LeftT<A> | RightT<B>

const Left  = (a: mixed): LeftT<*>  => ({
  '@@type': 'Left',
  '@@value': a
})

const Right = (b: mixed): RightT<*> => ({
  '@@type': 'Right',
  '@@value': b
})

type C = ?mixed
// Can A and B be inferred here?
type EitherFn = (f:((a:*)=>C)) => (g:((b:*)=>C)) => (e:Either<*,*>) => C
const either: EitherFn = f => g =>
  match({
    Right: g,
    Left: f
  })

const mirror = either(Right)(Left)

export {
  Left,
  Right,
  either,
  mirror,
}
