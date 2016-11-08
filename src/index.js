import {
  tick as now,
  log,
  atom,
} from 'zazen/utils'

type Pair<T>  = [ T, T ]
type Arrow = {
  first():  Arrow;
  second(): Arrow;
  compose(b: Arrow): Arrow;
  combine(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {
  const first  = () => arrow( ([a, _]: Pair): Pair => [f(a), _] )
  const second = () => arrow( ([_, b]: Pair): Pair => [_, f(b)] )

  const compose = (g) => arrow( x => f(g(x)) )
  const combine = (g) => arrow( ([a, b]) => [f(a),g(b)] )
  const fanout  = (g) => combine(g).compose( arrow( x => [x,x] ) )

  f.first  = first
  f.second = second

  f.compose = compose
  f.combine = combine
  f.fanout  = fanout

  return f
}

type Stream = Arrow & {
  (a: mixed[]): mixed[];
}

// Lifts a function into a Stream Arrow
// stream :: (b -> c) -> Arrow [b] [c]
const stream = (m: Function): Stream => {
  const f = a => a.map(m)

  const compose = (g) => arrow( x => f(g(x)) )

  f.first  = () => arrow( ([a, _]: Pair): Pair => [f(a), _] )
  f.second = () => arrow( ([_, b]: Pair): Pair => [_, f(b)] )

  f.compose = compose

  return f
}

window.arrow = arrow
window.stream = stream
