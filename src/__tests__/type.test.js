import type {
  Foldable,
  Functor,
  Setoid,
  Data,
} from 'zazen/type'

import {
  createType,
  foldable,
  functor,
  setoid,
} from 'zazen/type'

test(`Types have a type`, () => {

  const Test = createType('Test')

  const t = Test.of(true)

  expect( t["@@type"]  ).toEqual('Test')
  expect( t["@@value"] ).toEqual(true)
  expect( t.inspect()  ).toEqual('Test(true)')
  expect( t.is(Test)   ).toEqual(true)

})

test(`Functor actually behaves as expected`, () => {

  type IdentityFunctorT = Functor<'IdentityFunctor', any>
  const IdentityFunctor: Data<IdentityFunctorT, any> =
    functor(x => f => f(x))(createType)('IdentityFunctor')

  const a = IdentityFunctor.of(2).map(x => x + 3)["@@value"]
  const b = IdentityFunctor.of(5)["@@value"]

  expect(a).toEqual(b)

})

test(`Setoid actually behaves as expected`, () => {

  type HardEqualitySetoidT = Setoid<'HardEqualitySetoid', any>
  const HardEqualitySetoid: Data<HardEqualitySetoidT, any> =
    setoid(x => y => x === y)(createType)('HardEqualitySetoid')

  const a = HardEqualitySetoid.of(2)
  const b = HardEqualitySetoid.of(2)
  expect(a.equals(b)).toEqual(true)

})

test(`Foldable actually behaves as expected`, () => {

  type IdentityFoldableT = Foldable<'IdentityFoldable', string>
  const IdentityFoldable: Data<IdentityFoldableT, string> =
    foldable(x => f => f(x))(createType)('IdentityFoldable')

  const a = IdentityFoldable.of('str')

  expect(a.fold(x => x)).toEqual('str')

})
