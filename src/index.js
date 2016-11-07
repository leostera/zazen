import {
  tick as now,
  log,
  atom,
} from 'zazen/utils'

type Arrow = {
  id(): Function;
  next(g: Function): Function;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (a: Function): Arrow  => {
  const f = g => x => g(a(x))

  f.id   = () => f
  f.toString = () => `[Arrow]`

  return f
}

type Operator = [ Symbol, Function ]

// Arrows Operators to define
const operators: Operator[] = [
  [atom('>>>'), compose],
  [atom('&&&'), fork],
  [atom('***'), combine],
  [atom('|||'), choose],
  [atom('+++'), join],
  [atom('<+>'), or],
]
