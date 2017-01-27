/*
 * Dependencies
 */

import {
  test as koan,
} from 'tape'

import {
  eq,
  ap,
  cond,
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
 * Koan Set 4
 *
 * Functional Code Branching with cond
 *
 */

koan(`a cond takes N conditions and returns the first match`, ({ok, end}) => {

  ok(
    cond(
      [ true, 3 ]) == ___,
    `the true condition always matches`)

  ok(
    cond(
      [ ___, 3 ],
      [ true,  4 ]) == 4,
    `the false condition never matches`)

  ok(
    cond(
      [ ___, 3 ]) == undefined,
    `if no match is found, nothing is returned`)

  ok(
    cond(
      [ () => false, 3 ],
      [ () => ___,  4 ]) == 4,
    `conditions can be predicates (boolean functions)`)

  ok(
    cond(
      [ () => true, () => ___(41) ]) == 42,
    `the returning expression can be a function that will be evaluated
     if and only if the predicate passes`)

  end()

})
