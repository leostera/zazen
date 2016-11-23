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

const focus = koan.only

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

koan(`an arrow is just a function`, ({ok, end}) => {

  const arr = arrow(add1)

  ok(`function` == typeof ___,
    `the type of an arrow is function`)

  ok(2 == ___,
    `we can invoke an arrow`)

  end()

})

koan(`an arrow can be composed with another arrow`, ({ok, end}) => {

  const arr1 = arrow(add1)

  const arr3 = arrow(mul3)

  ok(4 == arr1.___(arr3)(1),
    `the output of arr3 goes into arr1`)

  ok(6 == arr1.___(arr3)(1),
    `the output of arr1 goes into arr3`)

  ok(10 == arr3.pipe(arr1)(___),
    `the output of arr1 goes into arr3`)

  ok(9 == arr3.compose(arr1)(___),
    `the output of arr3 goes into arr1`)

  end()

})

koan(`an arrow can be combined with another arrow`, ({deepEquals, end}) => {

  const arr1 = arrow(add1)

  const arr3 = arrow(mul3)

  deepEquals(
    [2, 3], ___.combine(___)([1, 1]),
    `Left input goes through left arrow to left output,
     right input goes through right arrow to right output`)

  deepEquals(
    [2, 3], arr1.___(arr3)(1),
    `Input goes through both arrows`)

  end()

})

koan(`an arrow can be also bypass it's function`, ({deepEquals, end}) => {

  const arr3 = arrow(mul3)

  deepEquals(
    [9, 3], arr3.___([3, 3]),
    `Bypass the second element`)

  deepEquals(
    [__, ___], arr3.second([3, 3]),
    `Bypass the first element`)

  end()

})
