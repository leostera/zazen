import {
  run,
  run_cond,
  reducer,
  ap,
  eq,
  cond,
} from 'zazen/cond'


const assert = (x) => () => expect(x).toEqual(true)

/*
 * @todo: turn these into tests
 */
test("an Either executes f for Left", assert( run(1) === 1 ))
test("", assert( run( () => 1 ) === 1) )
test("", assert( run_cond([1, () => 2]) === 2) )
test("", assert( reducer(undefined, [ 1, () => 2 ]) === 2) )
test("", assert( reducer(undefined, [ false, () => 2 ]) === undefined) )

test("branching", assert(
  cond(
    [false, 0],
    [true, 1]) === 1 ))

const x = 1
test("branching returns function value", assert(
  cond(
    [x, () => x],
    [true, "else!"]) === 1 ))

test("branching with function predicate", assert(
  cond(
    [false, () => 2],
    [() => 1 < 2, () => 1],
    [true, 0]) === 1 ))

test("branching  with blowing up function predicate", () => {
  const c = () => {
    return cond(
      [false, () => "I'm always ignored"],
      [() => a < 2, () => "I'm always a run-time error!"],
      [true, "else!"])
  }
  expect( c ).toThrow()
})

