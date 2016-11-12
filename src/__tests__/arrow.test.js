import {
  check as verify,
  forall,
  nat,
} from 'jsverify'

import {
  log,
  atom,
} from 'zazen/utils'

import { arrow } from 'zazen'

const options = {
  tests: 1000
}

const str  = JSON.stringify
const add1 = x => x+1

const equal_pairs = ([a,b], [c,d]) => a === c && b === d

const eq = (a,b) => {
  if( a.length === 2 && b.length === 2 ) return equal_pairs(a,b)
  else return a === b
}

const check = (name, predicate) => {
  test(name, () => {
    let r = verify( predicate, options )
    expect(r).toBe(true)
  })
}

check("an Arrow returns its function's value when called",
  forall('json -> json', 'json', nat(100),
    (f, x) => arrow( () => f(x) )() == f(x) ))

check('an Arrow is composable with regular functions',
  forall('json -> json', 'json', nat(100),
    (f, x) => arrow(f).compose( () => x )() == f(x) ))

check('an Arrow is composable with other arrows',
  forall('json -> json', 'json', nat(100),
    (f, x) => arrow(f).compose( arrow(() => x) )() == f(x) ))

check('an Arrow is combinable with regular functions',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).combine(f)([x,x]),
      [f(x),f(x)])))

check('an Arrow is combinable with other arrows',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).combine(arrow(f))([x,x]),
      [f(x),f(x)])))

check('an Arrow is fanout-able with regular functions',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).fanout(x => add1(f(x)))(x),
      [f(x),add1(f(x))])))

check('an Arrow is fanout-able with other arrows',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).fanout(arrow(x => add1(f(x))))(x),
      [f(x),add1(f(x))])))

check('an Arrow is summable with other arrows on Left',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).sum(arrow(x => add1(f(x))))([atom('Left'), x]),
      [atom('Left'), f(x)])))

check('an Arrow is summable with other arrows on Right',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).sum(arrow(x => add1(f(x))))([atom('Right'), x]),
      [atom('Right'), add1(f(x))])))

check('an Arrow is fanin-able with other arrows on Left',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).fanin(arrow(x => add1(f(x))))([atom('Left'), x]),
      f(x))))

check('an Arrow is fanin-able with other arrows on Right',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      arrow(f).fanin(arrow(x => add1(f(x))))([atom('Right'), x]),
      add1(f(x)))))

check('an Arrow is left-able',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq( arrow(f).left(x), [atom('Left'), f(x)] )))

check('an Arrow is right-able',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq( arrow(f).right(x), [atom('Right'), x] )))
