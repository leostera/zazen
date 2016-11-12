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
  f.compose = g => arrow( x => f(g(x)) )
  f.pipe    = g => arrow( x => g(f(x)) ) //reverse compose

  //f.first :: SF a b -> SF (a, c) (b, c)
  f.first   = _ => arrow( ([a, _]: Pair): Pair => [f(a), _] )

  //f.second :: SF a b -> SF (c, a) (c, b)
  f.second  = _ => arrow( ([_, b]: Pair): Pair => [_, f(b)] )

  //f.combine :: SF a b -> SF c d -> SF (a, c) (b, d)
  f.combine = g => arrow( ([a, b]) => [f(a),g(b)] )

  //f.fanout :: SF a b -> SF a c -> SF a (b, c)
  f.fanout  = g => f.combine(g).compose( arrow( x => [x,x] ) )

  return f
}

// Lifts a function into a Signal Function
// sf :: (b -> c) -> SF b c
// SF b c = Signal b -> Signal c
// Signal b = Time -> b

type Signal = (a: any) => any;
type SF = Arrow & {
  loop(): SF;
}

const sf = (a: Signal): SF => {
  let f = arrow( x => [sf(a), a(x)] )

  //f.first  :: SF a b -> SF (a, c) (b, c)
  //f.second :: SF a b -> SF (c, a) (c, b)
  //f.combine :: SF a b -> SF c d -> SF (a, c) (b, d)
  //f.fanout :: SF a b -> SF a c -> SF a (b, c)

  return f
}

const sfLoop = (a: Signal, state: mixed): SF => {
  let f = sf( (x): Pair => [sf(a, state), a(x, state)] )
  return f
}

export {
  arrow,
  sf,
  sfLoop,
}
