import {
  tick as now,
  log,
  atom,
} from 'zazen/utils'

// Lift an arrow into a an arrow of tuples
// const first  = (a: Arrow) => arrow( (a,b) => (a.f(a),b) )
// const second = (a: Arrow) => arrow( (a,b) => (a,a.f(b)) )

type Arrow = {
  id(): Arrow;
  compose(a: Function): Arrow;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => ({
  f: f,
  id: () => arrow(f),
  compose: g => arrow( x => f(g(x)) ),
  [atom("name")]: "Arrow",
})

type Stream = {
  run(inputs: mixed): [mixed];
}

// Lifts a function into a Stream Arrow
// stream :: (b -> c) -> Arrow [b] [c]
const stream = (f: Function): Stream => ({
  ...arrow(f),
  run: (...a) => a.map(f),
  [atom("name")]: "Stream",
})

window.arrow = arrow
window.stream = stream
