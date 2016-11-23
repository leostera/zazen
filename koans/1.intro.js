const {
  test,
  ok,
  notOk
} = require('tap')

const options = []

const koan = (name, fn) => test(name, options, fn)

/*
 * An Arrow is just a function.
 *
 * It has some more capabilities, but ultimately it's just a function.
 *
 * Let's try to make an arrow...
 */

koan('an arrow is just a function', () => {
  ok(true, 'this is fine')
})
