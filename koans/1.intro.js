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
 * Koan 1: Intro
 */

koan('an arrow is just a function', ({equal, end}) => {
  const anArrow = arrow( x => x )

  equal(
    typeof anArrow,
    'Function',
    'the type of an arrow is function')

  equal(
    anArrow(1),
    2,
    'we can invoke an arrow')

  end()
})
