import {
  check as verify,
  forall,
  nat,
} from 'jsverify'

import {
  log,
  atom,
} from 'zazen/utils'

import {
  Arrow,
  Left,
  Right,
} from 'zazen'

const options = {
  quiet: true,
  tests: 1000,
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
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => Arrow( () => f(x) )() == f(x) ))

check('an Arrow is composable with regular functions',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => Arrow(f).compose( () => x )() == f(x) ))

check('an Arrow is composable with other arrows',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => Arrow(f).compose( Arrow(() => x) )() == f(x) ))

check('an Arrow is combinable with regular functions',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).combine(f)([x,x]),
      [f(x),f(x)])))

check('an Arrow is combinable with other arrows',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).combine(Arrow(f))([x,x]),
      [f(x),f(x)])))

check('an Arrow is fanout-able with regular functions',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).fanout(x => add1(f(x)))(x),
      [f(x),add1(f(x))])))

check('an Arrow is fanout-able with other arrows',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).fanout(Arrow(x => add1(f(x))))(x),
      [f(x),add1(f(x))])))

check('an Arrow is summable with other arrows on Left',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).sum(Arrow(x => add1(f(x))))(Left(x)),
      Left(f(x)))))

check('an Arrow is summable with other arrows on Right',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).sum(Arrow(x => add1(f(x))))(Right(x)),
      Right(add1(f(x))))))

check('an Arrow is fanin-able with other arrows on Left',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).fanin(Arrow(x => add1(f(x))))(Left(x)),
      f(x))))

check('an Arrow is fanin-able with other arrows on Right',
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(
      Arrow(f).fanin(Arrow(x => add1(f(x))))(Right(x)),
      add1(f(x)))))

test('an Arrow is loop-able', () => {
  let loop = Arrow(x=>x+1).loop( {n: 0}, (x,s) => { s.n+=x; return s.n })
  expect(loop(1)).toBe(1)
  expect(loop(1)).toBe(2)
  expect(loop(1)).toBe(3)
})
