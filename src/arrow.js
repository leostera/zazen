import {
  atom,
} from 'zazen/utils'

import type {
  Either,
} from 'zazen/either'

import {
  either,
  mirror,
  untag,
} from 'zazen/either'

type Pair  = [ mixed, mixed ]

type Arrow = Function & {
  id(b: mixed): mixed;

  first(p: Pair):  Arrow<Pair>;
  second(p: Pair): Arrow<Pair>;

  compose(b: Arrow): Arrow;
  pipe(b: Arrow):    Arrow;

  combine(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;

  left(x: mixed):  Either;
  right(x: mixed): Either;

  sum(b: Arrow):   Arrow;
  fanin(b: Arrow): mixed;

  loop(b: Object, g: Arrow): mixed;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {
  f.id = x => x

  /***
   * Arrow
   ***/
  f.first   = x => arrow( ([a, b]: Pair): Pair => [f(a), f.id(b)] )(x)
  f.second  = x => arrow( ([a, b]: Pair): Pair => [f.id(a), f(b)] )(x)

  f.compose = g => arrow( (x: mixed): mixed => f(g(x)) )
  f.pipe    = g => arrow( (x: mixed): mixed => g(f(x)) ) //reverse compose

  f.combine = g => arrow( ([a, b]: Pair): Pair => [f(a),g(b)] )
  f.fanout  = g => arrow( (x: mixed): Pair => [x,x] ).pipe(f.combine(g))

  /***
   * ArrowChoice
   ***/
  f.left  = x => f.sum(f.id)( ([atom('Left'),  x]: Either) )
  f.right = x => f.sum(f.id)( ([atom('Right'), x]: Either) )

  f.sum   = g => arrow( (e: Either): ?Either => either(f, g, e) )
  f.fanin = g => f.sum(g).pipe(arrow(untag))

  /***
   * ArrowLoop
   ***/
  f.loop = (s, g) => arrow(x => arrow( (a, b) => g(a, b) )(x, s))

  return f
}

export {
  arrow,
}
