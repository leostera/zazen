import {
  check as verify,
  forall,
  nat,
} from 'jsverify'

import {
  log,
  atom,
} from 'zazen/utils'

import {
  Cell,
} from 'zazen'

const options = {
  quiet: true,
  tests: 1000,
}

const id   = x => x
const str  = JSON.stringify
const add1 = x => x + 1

test(`a Cell is just a function with dependants`, () => {
  const c = Cell( add1, id )

  expect( typeof c ).toEqual('function')
  expect( c(1) ).toEqual(2)
})

test(`a Cell will pass it's value on to it's dependants`, () => {
  const c = Cell( add1, x => expect(x).toEqual(2) )
  c(1)
})

test(`a Cell's child can be another Cell`, () => {
  const c =
  Cell( add1,
    Cell( add1,
      Cell( add1,
        Cell( add1,
          x => expect(x).toEqual(5)))))
  c(1)
})

test(`a Cell will only recompute on new parameters`, () => {
  let a = 0
  const c = Cell( add1, () => a++ )

  expect( a ).toEqual(0)
  c(1)
  expect( a ).toEqual(1)
  c(1)
  c(1)
  expect( a ).toEqual(1)
  c(22)
  expect( a ).toEqual(2)
})
