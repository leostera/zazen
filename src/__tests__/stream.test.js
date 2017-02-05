import {
  check as verify,
  forall,
  nat
} from 'jsverify'

import {
  log,
  atom
} from 'zazen/utils'

import {
  Stream
} from 'zazen'

const options = {
  quiet: true,
  tests: 1000
}

const str = JSON.stringify
const add1 = x => x + 1

const equal_pairs = ([a, b], [c, d]) => a === c && b === d

const eq = (a, b) => {
  if (a.length === 2 && b.length === 2) return equal_pairs(a, b)
  else return a === b
}

const check = (name, predicate) => {
  test(name, () => {
    let r = verify(predicate, options)
    expect(r).toBe(true)
  })
}

check("a Stream Arrow maps over all it's arguments with it's function",
  forall('integer -> integer', 'integer', nat(100),
    (f, x) => eq(Stream(f)([x, x]), [f(x), f(x)])))
