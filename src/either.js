import {
  untag,
} from './pair'

import {
  ap,
  cond,
  match,
  eq,
} from './cond'

type LeftT<A>  = {
  '@@type': 'Left',
  '@@value': A
}

type RightT<B> = {
  '@@type': 'Right',
  '@@value': B
}

export type Either<A, B> = LeftT<A> | RightT<B>

const Left  = (a: mixed): LeftT<*>  => {
  '@@type', 'Left',
  '@@value': a
}

const Right = (b: mixed): RightT<*> => {
  '@@type': 'Right',
  '@@value': b
}

type C = ?mixed
// Can A and B be inferred here?
type EitherFn = (f:((a:*)=>C)) => (g:((b:*)=>C)) => (e:Either<*,*>) => C
const either: EitherFn = f => g =>
  match({
    Right: ap(g, a),
    Left: ap(f, a)
  })

const mirror = either(Right)(Left)

export {
  Left,
  Right,
  either,
  mirror,
}
