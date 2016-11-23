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

const _ = () => null

const add1 = x => x+1

const mul3 = x => x*3


/*
 * Koan 1: Intro
 */

koan('an arrow is just a function', ({ok, end}) => {

  ok( _(add1),
    'we lift a function into an arrow with the arrow function')

  ok('function' == typeof _,
    'the type of an arrow is function')

  ok(2 == _,
    'we can invoke an arrow')

  end()

})

koan('an arrow can be composed with another arrow', ({ok, end}) => {



})
