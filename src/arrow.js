import {
  Left,
  Right,
  either,
} from './either'

import {
  swap,
  untag,
} from './pair'

export type Arrow = Function & {
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

const pair = f => g => ([a,b]) => [f(a), g(b)]
const dupe = x => [x,x]

const compose = f => g => x => f(g(x))

const id = x => x

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {

  /***
   * Arrow
   ***/
  f.first   = x => arrow( pair(f)(id) )(x)
  f.second  = x => arrow( pair(id)(f) )(x)

  f.compose = g => arrow( compose(f)(g) )
  f.pipe    = g => arrow( compose(g)(f) ) //reverse compose

  f.combine = g => arrow( pair(f)(g) )
  f.fanout  = g => arrow( dupe ).pipe(f.combine(g))

  /***
   * ArrowChoice
   ***/
  f.left  = x => f.sum(id)(left(x))
  f.right = x => f.sum(id)(right(x))

  f.sum   = g => arrow( either(f)(g) )
  f.fanin = g => f.sum(g).pipe(untag)

  /***
   * ArrowLoop
   ***/
  f.loop = (s, g) => arrow(x => arrow( (a, b) => g(a, b) )(x, s))

  return f
}

export {
  arrow,
}
