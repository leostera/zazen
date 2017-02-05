import type {
  Data,
  Foldable,
  Functor,
  Monoid,
  SemiGroup,
  Setoid,
  TypeChecker,
} from 'zazen/type'

import {
  createType,
  foldable,
  functor,
  monoid,
  semiGroup,
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

  type IdentityFunctorT = Functor<'IdentityFunctor', number>
  const IdentityFunctor: Data<IdentityFunctorT, number> =
    functor(x => f => f(x))('IdentityFunctor')

  // complains down here, map should return number
  const a = IdentityFunctor.of(2).map(x => x + '3')["@@value"]
  const b = IdentityFunctor.of(5)["@@value"]

  expect(a).toEqual(b)

})

test(`Setoid actually behaves as expected`, () => {

  type HardEqualitySetoidT = Setoid<'HardEqualitySetoid', any>
  const HardEqualitySetoid: Data<HardEqualitySetoidT, any> =
    setoid(x => y => 'what')('HardEqualitySetoid')
  // Works: complains here ^ this should be boolean

  const a = HardEqualitySetoid.of(2)
  const b = HardEqualitySetoid.of(2)
  expect(a.equals(b)).toEqual(true)

})

test(`Foldable actually behaves as expected`, () => {

  type IdentityFoldableT = Foldable<'IdentityFoldable', string>
  const IdentityFoldable: Data<IdentityFoldableT, string> =
    foldable(x => f => f(x))('IdentityFoldable')

  // Works: Complains here, this should be string
  const a = IdentityFoldable.of(1234)

  // Works: Complains here, fold should return a string
  expect(a.fold(x => false)).toEqual('str')

})

test(`SemiGroup actually behaves as expected`, () => {

  type StringSemigroupT = SemiGroup<'StringSemigroup', string>
  const StringSemigroup: Data<StringSemigroupT, string> =
    semiGroup(x => y => false)('StringSemigroup')
    //semiGroup(x => y => `${x}.${y}`)('StringSemigroup')
  // Broken: should complain up there, semigruop should return string!

  // Works: complains here, lifted value has to be string
  const a = StringSemigroup.of(1)
  const b = StringSemigroup.of('b')

  expect(a.concat(b)['@@value']).toEqual('a.b')

})


test(`Monoid actually behaves as expected`, () => {

  type SumMonoidT = SemiGroup<'SumMonoid', number>
  const SumMonoid: Monoid<SumMonoidT, number> =
    monoid(x => y => false, 0)('SumMonoid')
    //monoid(x => y => x + y, 0)('SumMonoid')
  // Broken: should copmlain up here, this monoid is of numbers not booleans

  // Works: complains down here, lifted value has to be a number
  const five = SumMonoid.of('asdf')
  const six  = SumMonoid.of(6)
  const zero = SumMonoid.empty()

  const a = five.concat(zero).concat(six)["@@value"]

  expect(a).toEqual(11)

})
