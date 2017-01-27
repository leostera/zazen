/*
 * Dependencies
 */

import {
  test as koan,
} from 'tape'

import {
  mirror,
  either,
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
 * Koan Set 2
 *
 * Functional Code Branching with Either
 *
 */

koan(`Either values are constructed with Left and Right`, ({deepEquals, end}) => {

  deepEquals(
    ["Left", 2],
    ___(2),
    `a Left(2) is a tagged tuple`)

  deepEquals(
    ["Right", 2],
    ___(2),
    `a Right(2) is a tagged tuple`)

  end()

})

koan(`an Either chooses between two code paths, Left or Right`, ({ok, end}) => {

  const path = either(add1)(mul3)

  ok( 4 == path(___(3)),
    `the left branch of this either adds 1`)

  ok( 9 == path(___(3)),
    `the right branch of this either multiplies by 3`)

  end()

})

koan(`a Left or a Right can be mirrored into the other`, ({deepEquals, end}) => {

  deepEquals(
    Right(1),
    ___(Left(1)),
    `mirroring a left gives you a right of the same value`)

  deepEquals(
    ___(1),
    mirror(___(1)),
    `mirroring a right gives you a left of the same value`)

  end()

})
