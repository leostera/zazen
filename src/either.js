import {
  untag,
} from './pair'

import type {
  Data,
  Type,
  TypeChecker,
} from './type'

import {
  createType,
} from './type'

import {
  ap,
  cond,
  createMatch,
  eq,
} from './cond'

type LeftT<A>  = Type<'Left',  A>
type RightT<A> = Type<'Right', A>
export type EitherT<A, B> = LeftT<A> | RightT<B>

const Left: Data<LeftT<*>, mixed> = createType('Left')
const Right: Data<RightT<*>, mixed> = createType('Right')

const eitherId: TypeChecker<EitherT<*,*>> = x => x
const match = createMatch(eitherId)

type C = ?mixed
// Can A and B be inferred here?
type EitherFn = (f:((a:*)=>C)) => (g:((b:*)=>C)) => (e:EitherT<*,*>) => C
const either: EitherFn = f => g =>
  match({
    Left: a => f(a),
    Right: a => g(a),
  })

const mirror = either(Right.of)(Left.of)

export {
  Left,
  Right,
  either,
  mirror,
}
