import type {
  Either,
} from './either'

import {
  Left,
  Right,
  either,
} from './either'

import type {
  Pair,
} from './pair'

import {
  swap,
  untag,
} from './pair'

import {
  eq,
  cond,
} from './cond'

export type Arrow = Function & {
  id(b: mixed): mixed;

  first(p: Pair<mixed, mixed>):  Arrow;
  second(p: Pair<mixed, mixed>): Arrow;

  compose(b: Arrow): Arrow;
  pipe(b: Arrow):    Arrow;

  combine(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;

  Left(x: mixed):  Either<mixed, mixed>;
  Right(x: mixed): Either<mixed, mixed>;

  sum(b: Arrow):   Arrow;
  fanin(b: Arrow): mixed;

  loop(b: Object, g: Arrow): mixed;
}

const pair = f => g => ([a,b]) => [f(a), g(b)]
const dupe = x => [x,x]

const compose = f => g => x => f(g(x))

const id = x => x

// Lifts a function into an arr
// arrrow :: (b -> c) -> arr b c
const arr = (f: Function): Arrow  => {

  /***
   * arr
   ***/
  f.first   = x => arr( pair(f)(id) )(x)
  f.second  = x => arr( pair(id)(f) )(x)

  f.compose = g => arr( compose(f)(g) )
  f.pipe    = g => arr( compose(g)(f) ) //reverse compose

  f.combine = g => arr( pair(f)(g) )
  f.fanout  = g => f.combine(g).compose(dupe)

  /***
   * arrChoice
   ***/
  f.left  = x => f.sum(id)
  f.right = x => arr(id).sum(f)

  f.sum = g => arr( ([t,a]: Either<*,*>) =>
    cond(
      [eq(t, 'Left'),  Left(f(a))],
      [eq(t, 'Right'), Right(g(a))]))

  f.fanin = g => f.sum(g).pipe(untag)

  /***
   * arrLoop
   ***/
  f.loop = (s, g) => arr(x => arr( (a, b) => g(a, b) )(x, s))

  return f
}

export {
  arr,
}
