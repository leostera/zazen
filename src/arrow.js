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
  f.class = arrow

  f.compose = g => f.class( x => f(g(x)) )
  f.pipe    = g => f.class( x => g(f(x)) ) //reverse compose

  //f.first :: SF a b -> SF (a, c) (b, c)
  f.first   = _ => f.class( ([a, _]: Pair): Pair => [f(a), _] )

  //f.second :: SF a b -> SF (c, a) (c, b)
  f.second  = _ => f.class( ([_, b]: Pair): Pair => [_, f(b)] )

  //f.combine :: SF a b -> SF c d -> SF (a, c) (b, d)
  f.combine = g => f.class( ([a, b]) => [f(a),g(b)] )

  //f.fanout :: SF a b -> SF a c -> SF a (b, c)
  f.fanout  = g => f.combine(g).compose( f.class( x => [x,x] ) )

  return f
}

const sf = (a: Function): Arrow => {
  let f = arrow( x => [sf(a), a(x)] )
  f.class = sf

  //f.first  :: SF a b -> SF (a, c) (b, c)
  //f.second :: SF a b -> SF (c, a) (c, b)
  //f.combine :: SF a b -> SF c d -> SF (a, c) (b, d)
  //f.fanout :: SF a b -> SF a c -> SF a (b, c)

  return f
}

export {
  arrow,
  sf,
}
