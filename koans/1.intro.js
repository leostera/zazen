/*
 * Dependencies
 */

import {
  test as koan,
} from 'tape'

import {
  arrow,
} from 'zazen'

/*
 * Helpers
 */

const ___ = null

const add1 = x => x+1

const mul3 = x => x*3

/*
 *
 * Koan Set 1
 *
 * Introduction to Arrows
 *
 */

koan('an arrow is just a function', ({ok, end}) => {

  const arr = arrow(add1)

  ok('function' == typeof ___,
    'the type of an arrow is function')

  ok(2 == ___,
    'we can invoke an arrow')

  end()

})

koan('an arrow can be composed with another arrow', ({ok, end}) => {

  const arr1 = arrow(add1)

  const arr3 = arrow(mul3)

  ok(4 == arr1.___(arr3)(1),
    "the output of arr3 goes into arr1")

  ok(6 == arr1.___(arr3)(1),
    "the output of arr1 goes into arr3")

  ok(6 == arr3.___(arr1)(1),
    "the output of arr1 goes into arr3")

  ok(4 == arr3.__(arr1)(1),
    "the output of arr3 goes into arr1")

  end()

})
