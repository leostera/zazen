import type {
  Functor,
  Data,
} from 'zazen/type'

import {
  createFunctor,
} from 'zazen/type'

test(`Functor actually behaves as expected`, () => {

  type IdentityFunctorT = Functor<'IdentityFunctor', any>
  const IdentityFunctor: Data<IdentityFunctorT, any> =
    createFunctor(x => f => f(x))('IdentityFunctor')

  const a = IdentityFunctor.of(2).map(x => x + 3)["@@value"]
  const b = IdentityFunctor.of(5)["@@value"]

  expect(a).toEqual(b)

})
