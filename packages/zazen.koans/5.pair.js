/*
 * Dependencies
 */

import {
  test as koan,
} from 'tape'

import {
  Left,
  Pair,
  Right,
  swap,
  untag,
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
 * Koan Set 5
 *
 * Dealing with Pairs
 *
 */

koan(`a Pair can be constructed with an array literal`, ({deepEquals, end}) => {

  deepEquals(
    ___,
    Pair(1,2),
    `it takes little to make a pair`)

  end()

})

koan(`a Pair can be swapped`, ({deepEquals, end}) => {

  deepEquals(
    [0,1],
    ___(___([0,1])),
    `swapping an even amount of times makes swap the identity`)

  deepEquals(
    ___,
    swap(___),
    `this is the minimum pair that when swapped is not itself`)

  end()

})

koan(`a Tagged Pair can be untagged`, ({deepEquals, end}) => {

  deepEquals(
    true,
    untag(["Value", ___]),
    `untagging a pair gives you it's second element`)

  end()

})

koan(`Left and Right are tagged pairs`, ({deepEquals, end}) => {

  deepEquals(
    42,
    ___(Left(42)),
    `Either values are untaggable`)

  deepEquals(
    [42, "Left"],
    swap(___(42)),
    `Either values are swappable`)

  end()

})
