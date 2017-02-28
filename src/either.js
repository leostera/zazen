import {
  untag,
} from './pair'

import type {
  Data,
  Type,
  TypeChecker,
} from './type'

import {
  type,
} from './type'

import {
  ap,
  cond,
  createMatch,
  eq,
} from './cond'

// $FlowIgnore
type LeftT<A>  = Type<'Left',  A>
// $FlowIgnore
type RightT<A> = Type<'Right', A>
export type EitherT<A, B> = LeftT<A> | RightT<B>

const Left: Data<LeftT<*>, *> = type('Left')
const Right: Data<RightT<*>, *> = type('Right')

const eitherId: TypeChecker<EitherT<*,*>> = x => x
const match = createMatch(eitherId)

type EitherFn = (f: Function) => (g: Function) => (e:EitherT<*,*>) => *
const either: EitherFn = f => g => match({ Left: f, Right: g })

const mirror = either(Right.of)(Left.of)

export {
  Left,
  Right,
  either,
  mirror,
}
