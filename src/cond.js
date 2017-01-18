const eq = (a, b) => () => a === b
const ap = (f, a) => () => f(a)

const run = a => typeof a == 'function' && a() || a
const run_cond = ([pred, branch]) => run(pred) && run(branch)
const reducer = (a, cond) => a || run_cond(cond) || a

type Cond = (...pairs: Array<[mixed, mixed]>) => mixed
const cond: Cond = (...conds) => conds.reduce(reducer, undefined)

console.log(run(1) === 1)
console.log(run( () => 1 ) === 1)
console.log(run_cond([1, () => 2]) === 2)
console.log(reducer(undefined, [ 1, () => 2 ]) === 2)
console.log(reducer(undefined, [ false, () => 2 ]) === undefined)

console.log("cond with else branch", "=>",
  cond(
    [false, "I'm always ignored"],
    [true, "else!"]))

const x = 1
console.log("cond with variable check", "=>",
  cond(
    [x, () => `I'm always true: ${x}`],
    [true, "else!"]))

console.log("cond with function predicate", "=>",
  cond(
    [false, () => "I'm always ignored"],
    [() => 1 < 2, () => "I'm always a run-time success!"],
    [true, "else!"]))

console.log("cond with blowing up function predicate", "=>",
  cond(
    [false, () => "I'm always ignored"],
    [() => a < 2, () => "I'm always a run-time error!"],
    [true, "else!"]))

export {
  cond,
  eq,
  ap,
}
