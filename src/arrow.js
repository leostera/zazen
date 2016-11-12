type Pair  = [ mixed, mixed ]
type Arrow = {
  first():  Arrow<Pair>;
  second(): Arrow<Pair>;
  compose(b: Arrow): Arrow;
  combine(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {
  f.first   = _ => arrow( ([a, _]: Pair): Pair => [f(a), _] )
  f.second  = _ => arrow( ([_, b]: Pair): Pair => [_, f(b)] )
  f.compose = g => arrow( x => f(g(x)) )
  f.combine = g => arrow( ([a, b]) => [f(a),g(b)] )
  f.fanout  = g => f.combine(g).compose( arrow( x => [x,x] ) )
  f.pipe    = g => arrow( x => g(f(x)) ) //reverse compose
  return f
}

export {
  arrow,
}
