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
  f.first  = () => arrow( ([a, _]: Pair): Pair => [f(a), _] )
  f.second = () => arrow( ([_, b]: Pair): Pair => [_, f(b)] )

  const compose = (g) => arrow( x => f(g(x)) )
  const combine = (g) => arrow( ([a, b]) => [f(a),g(b)] )

  f.compose = compose
  f.combine = combine
  f.fanout  = (g) => combine(g).compose( arrow( x => [x,x] ) )

  return f
}

// Lifts a function into a Stream Arrow
// stream :: (b -> c) -> Arrow [b] [c]
const stream = (f: Function): Arrow => arrow( a => a.map(f) )

export { arrow, stream }
