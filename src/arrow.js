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

export type ArrowT = Function & {
  id(b: mixed): mixed;

  first(p: Pair<mixed, mixed>):  ArrowT;
  second(p: Pair<mixed, mixed>): ArrowT;

  compose(b: ArrowT): ArrowT;
  pipe(b: ArrowT):    ArrowT;

  combine(b: ArrowT): ArrowT;
  fanout (b: ArrowT): ArrowT;

  Left(x: mixed):  Either<mixed, mixed>;
  Right(x: mixed): Either<mixed, mixed>;

  sum(b: ArrowT):   ArrowT;
  fanin(b: ArrowT): mixed;

  loop(b: Object, g: ArrowT): mixed;
}

const pair = f => g => ([a,b]) => [f(a), g(b)]
const dupe = x => [x,x]

const compose = f => g => x => f(g(x))

const id = x => x

// Lifts a function into an arr
// arrrow :: (b -> c) -> arr b c
const Arrow = (f: Function): ArrowT  => {

  /***
   * arr
   ***/
  f.first   = x => Arrow( pair(f)(id) )(x)
  f.second  = x => Arrow( pair(id)(f) )(x)

  f.compose = g => Arrow( compose(f)(g) )
  f.pipe    = g => Arrow( compose(g)(f) ) //reverse compose

  f.combine = g => Arrow( pair(f)(g) )
  f.fanout  = g => f.combine(g).compose(dupe)

  /***
   * arrChoice
   ***/
  f.left  = x => f.sum(id)
  f.right = x => Arrow(id).sum(f)

  // arr ([t,a]: Either<*,*> ): Either<*,*>
  // raises a type check error on `t` being `Left` instead of `Right`
  // and `Right` instead of `Left`
  // :(
  f.sum = g => Arrow( ([t,a]) =>
    cond(
      [eq(t, 'Left'),  Left(f(a))],
      [eq(t, 'Right'), Right(g(a))]))

  f.fanin = g => f.sum(g).pipe(untag)

  /***
   * arrLoop
   ***/
  f.loop = (s, g) => Arrow(x => Arrow( (a, b) => g(a, b) )(x, s))

  return f
}

export {
  Arrow,
}
