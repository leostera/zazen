import {
  type,
} from 'zazen/type'

import type {
  Data,
  Type,
  TypeChecker,
} from 'zazen/type'

import {
  cond,
  createMatch,
  eq,
  run,
} from 'zazen/prelude'

const assert = (x) => () => expect(x).toEqual(true)

test("Run returns the value if it's a value",
  assert( run(1) === 1 ))

test("Run returns the resulting value if it's passed a function",
  assert( run( () => 1 ) === 1) )

test("Cond always returns the value of the first matching branch",
  assert(
    cond(
      [false, 0],
      [true, 1],
      [true, 2] ) === 1 ))

test("Cond returns the matching branch function's return value", () => {
  const x = 1
  const r = cond( [x, () => x] )

  expect(r).toEqual(1)
})

test("Cond branching with no matches is undefined", () => {
  const run = a => cond( [ () => a === 'Match', 1] )

  expect( run(1) ).toEqual(undefined)
  expect( run('Match') ).toEqual( 1 )
})

test("Cond branching with function predicate", assert(
  cond(
    [false, () => 2],
    [() => 1 < 2, () => 1],
    [true, 0]) === 1 ))

test("Cond branching with blowing up function predicate", () => {
  const c = () => {
    return cond(
      [false, () => "I'm always ignored"],
      // $FlowIgnore
      [() => a < 2, () => "I'm always a run-time error!"],
      [true, "else!"])
  }
  expect( c ).toThrow()
})

test(`Match on Object Types`, () => {

  type IncT = Type<'Inc', number>
  type DecT = Type<'Dec', number>
  type ResetT = Type<'Reset', number>
  type WhatT = Type<'What', number>

  const IncAction: Data<IncT, number> = type('Inc')
  const DecAction: Data<DecT, number> = type('Dec')
  const ResetAction: Data<ResetT, null> = type('Reset')
  const WhatAction: Data<WhatT, number> = type('What')

  type ActionT = IncT | DecT | ResetT
  const id: TypeChecker<ActionT> = x => x

  const match = createMatch(id)
  const cata = match({
    Inc: x => x+1,
    Dec: x => x-1,
    Reset: x => 0
  })

  expect(cata(IncAction.of(10))).toEqual(11)
  expect(cata(DecAction.of(10))).toEqual(9)
  expect(cata(ResetAction.of(null))).toEqual(0)
  expect(cata(WhatAction.of(100))).toEqual(undefined)

})

test(`Match works on Primitives`, () => {

  const match = createMatch( x => x )
  const cata = match({
    number: x => x+1,
    string: x => x+'!',
    boolean: x => !x,
    undefined: x => "undefined",
    object: x => ({ x: x }),
  })

  expect(cata(1)).toEqual(2)
  expect(cata('hello')).toEqual('hello!')
  expect(cata(true)).toEqual(false)
  expect(cata({x: 1})).toMatchObject({ x: {x: 1} })
  expect(cata(undefined)).toEqual("undefined")
  expect(cata(null)).toMatchObject({ x: null })

})

test(`Nested Match`, () => {

  type SomeT = Type<'Some', number>

  const Some: Data<SomeT, number> = type('Some')

  const id: TypeChecker<SomeT> = x => x

  const match = createMatch(id)
  const cata = match({
    Some: match({
      number: x => x+1,
      object: x => 0
    })
  })

  expect( cata(Some.of(1)) ).toEqual(2)
  // $FlowIgnore
  expect( cata(Some.of({})) ).toEqual(0)

})
