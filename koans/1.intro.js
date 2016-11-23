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

koan('an arrow is just a function', ({ok, end}) => {
  const anArrow = arrow( x => x )

  ok(typeof anArrow == 'wat',
    'the type of an arrow is function')

  ok(anArrow == 2,
    'we can invoke an arrow')

  end()
})
