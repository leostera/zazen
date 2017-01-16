import {
  atom,
  log,
} from 'zazen/utils'

import {
  either,
  mirror,
  untag,
} from 'zazen'

const id = x => x
const left  = [atom('Left'), 1]
const right = [atom('Right'), 2]
const center = [atom('Center'), Infinity]

const mirrored_left  = [atom('Right'), 1]
const mirrored_right = [atom('Left'), 2]

test("an Either executes f for Left", () => {
  expect( either(id)(id)(left) ).toEqual(left)
})

test("an Either executes g for Right", () => {
  expect( either(id)(id)(right) ).toEqual(right)
})

test("an Either Left becomes an Either Right when mirrored", () => {
  expect( mirror(left) ).toEqual(mirrored_left)
})

test("an Either Right becomes an Either Left when mirrored", () => {
  expect( mirror(right) ).toEqual(mirrored_right)
})

test("an Either Right can be untagged to it's value", () => {
  expect( untag(right) ).toEqual(2)
})

test("an Either Left can be untagged to it's value", () => {
  expect( untag(left) ).toEqual(1)
})

test("untag does nothing if it's not tagged Left or Right", () => {
  expect( untag(center) ).toEqual(undefined)
})

test("mirror does nothing if it's not tagged Left or Right", () => {
  expect( mirror(center) ).toEqual(undefined)
})

test("either does nothing if it's not tagged Left or Right", () => {
  expect( either(id)(id)(center) ).toEqual(undefined)
})
