import type {
  Type,
  Data,
} from 'zazen/type'

import {
  createType,
} from 'zazen/type'

import {
  atom,
  log,
} from 'zazen/utils'

import {
  Left,
  Right,
  either,
  mirror,
  untag,
  match,
} from 'zazen'

const id = x => x

const left   = Left.of(1)
const right  = Right.of(2)

type CenterT<A>  = Type<'Center',  A>
const Center: Data<CenterT<*>, mixed> = createType('Center')
const center = Center.of(1)

const mirrored_left  = Right.of(1)
const mirrored_right = Left.of(2)

const valueOf = match({
  Left: id,
  Right: id,
})

const assertValue = (a, b) =>
  expect( valueOf(a) ).toEqual( valueOf(b) )

test("an Either executes f for Left", () => {
  expect( either(id)(id)(left) ).toEqual( valueOf(left) )
})

test("an Either executes g for Right", () => {
  expect( either(id)(id)(right) ).toEqual( valueOf(right) )
})

test("either does nothing if it's not tagged Left or Right", () => {
  // $FlowIgnore
  expect( either(id)(id)(center) ).toEqual(undefined)
})

test("an Either Left becomes an Either Right when mirrored", () => {
  assertValue( mirror(left), mirrored_left )
})

test("an Either Right becomes an Either Left when mirrored", () => {
  assertValue( mirror(right), mirrored_right )
})

test("an Either Right can be matched to it's value", () => {
  expect( valueOf(right) ).toEqual(2)
})

test("an Either Left can be matched to it's value", () => {
  expect( valueOf(left) ).toEqual(1)
})
