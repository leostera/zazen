/*
 * Dependencies
 */

import {
  test as koan,
} from 'tape'

import {
  Arrow,
  Left,
  Right,
} from 'zazen'

/*
 * Helpers
 */

const focus = koan.only

const ___ = null

const add1 = x => x+1

const mul3 = x => x*3

const log = console.log.bind({})

/*
 *
 * Koan Set 3
 *
 * Making Choices with Arrows
 *
 */

koan(`an Arrow can hold two code paths`, ({deepEqual, end}) => {

  const arr1 = Arrow(add1)
  const arr3 = Arrow(mul3)
  const add_or_mul = arr1.sum(arr3)

  deepEqual(
    Left(4),
    ___(Left(3)),
    `the left side of the arrow adds 1`)

  deepEqual(
    ___(9),
    add_or_mul(Right(3)),
    `the right side of the arrow multiplies by 3`)

  end()

})

koan(`an Arrow can be made to run only on Left values`, ({deepEqual, end}) => {

  const arr1 = Arrow(add1)

  deepEqual(
    ___(4),
    arr1.left(___(3)),
    `the left side of the arrow adds 1`)

  deepEqual(
    Right(3),
    arr1.___(Right(3)),
    `the right side of the arrow multiplies by 3`)

  end()

})

koan(`an Arrow can be made to run only on Right values`, ({deepEqual, end}) => {

  const arr1 = Arrow(add1)

  deepEqual(
    ___(4),
    arr1.___(Right(3)),
    `the left side of the arrow adds 1`)

  deepEqual(
    ___(3),
    arr1.right(Left(3)),
    `the right side of the arrow multiplies by 3`)

  end()

})

koan(`an Arrow can fanned in to a single value on Either side`, ({deepEqual, end}) => {

  const arr1 = Arrow(add1)
  const arr3 = Arrow(mul3)
  const add_or_mul = arr1.fanin(arr3)

  deepEqual(
    4,
    ___(Left(3)),
    `the left side of the arrow adds 1`)

  deepEqual(
    9,
    add_or_mul(Right(3)),
    `the right side of the arrow multiplies by 3`)

  end()

})

