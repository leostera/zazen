import type {
  Concat,
  Data,
  Equals,
  Empty,
  Fold,
  Foldable,
  Functor,
  Map,
  Monoid,
  Semigroup,
  Setoid,
  TypeChecker,
} from 'zazen/type'

import {
  type,
  foldable,
  functor,
  monoid,
  semigroup,
  setoid,
} from 'zazen/type'

test(`Types have a type`, () => {

  const Test = type('Test')

  const t = Test.of(true)

  expect( t["@@type"]  ).toEqual('Test')
  expect( t["@@value"] ).toEqual(true)
  expect( t.inspect()  ).toEqual('Test(true)')
  expect( t.is(Test)   ).toEqual(true)

})

test(`Functor actually behaves as expected`, () => {

  const map: Map<number> = x => f => f(x)

  type IdentityFunctorT = Functor<'IdentityFunctor', number>
  const IdentityFunctor: Data<IdentityFunctorT, number> =
    functor(map)('IdentityFunctor')

  const a = IdentityFunctor.of(2).map(x => x + 3)["@@value"]
  const b = IdentityFunctor.of(5)["@@value"]

  expect(a).toEqual(b)

})

test(`Setoid actually behaves as expected`, () => {

  const equals: Equals<number> = x => y => x === y

  type HardEqualitySetoidT = Setoid<'HardEqualitySetoid', any>
  const HardEqualitySetoid: Data<HardEqualitySetoidT, any> =
    setoid(equals)('HardEqualitySetoid')

  const a = HardEqualitySetoid.of(2)
  const b = HardEqualitySetoid.of(2)

  expect(a.equals(b)).toEqual(true)

})

test(`Foldable actually behaves as expected`, () => {

  const fold: Fold<string> = x => f => f(x)

  type IdentityFoldableT = Foldable<'IdentityFoldable', string>
  const IdentityFoldable: Data<IdentityFoldableT, string> =
    foldable(fold)('IdentityFoldable')

  const a = IdentityFoldable.of('str')

  expect(a.fold(x => x)).toEqual('str')

})

test(`Semigroup actually behaves as expected`, () => {

  const concat: Concat<string> = x => y => `${x}.${y}`

  type StringSemigroupT = Semigroup<'StringSemigroup', Concat<string>>
  const StringSemigroup: Data<StringSemigroupT, string> =
    semigroup(concat)('StringSemigroup')

  const a = StringSemigroup.of('a')
  const b = StringSemigroup.of('b')

  expect(a.concat(b)['@@value']).toEqual('a.b')

})

test(`Monoid actually behaves as expected`, () => {

  const concat: Concat<number> = x => y => x+y
  const empty: Empty<number> = 0

  type SumMonoidT = Semigroup<'SumMonoid', number>
  const SumMonoid: Monoid<SumMonoidT, number> =
    monoid(concat, empty)('SumMonoid')

  const five = SumMonoid.of(5)
  const six  = SumMonoid.of(6)
  const zero = SumMonoid.empty()

  const a = five.concat(zero).concat(six)["@@value"]

  expect(a).toEqual(11)

})
