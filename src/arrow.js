import { atom } from 'zazen/utils'

const id   = (a: mixed): mixed => a

type Pair  = [ mixed, mixed ]
const flip = ([a,b]: Pair): Pair => [b,a]
const dupe = (x): Pair => [x,x]

type Arrow = {
  first():  Arrow<Pair>;
  second(): Arrow<Pair>;
  combine(b: Arrow): Arrow;
  compose(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;
  pipe(b: Arrow):    Arrow;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {
  f.first   = _ => arrow( ([a, b]: Pair): Pair => [f(a), id(b)] )
  f.second  = _ => arrow( ([a, b]: Pair): Pair => [id(a), f(b)] )

  f.compose = g => arrow( x => f(g(x)) )
  f.pipe    = g => arrow( x => g(f(x)) ) //reverse compose

  f.combine = g => arrow( ([a, b]) => [f(a),g(b)] )
  f.fanout  = g => arrow(dupe).pipe(f.combine(g))

  f.fanin   = (g, m) => f.combine(g).pipe(m)

  f.left  = _ => {}
  f.right = _ => {}

  return f
}

export {
  arrow,
}
