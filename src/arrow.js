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

  product(b: ArrowT): ArrowT;
  fanout (b: ArrowT): ArrowT;

  left(x: mixed):  Either<mixed, mixed>;
  right(x: mixed): Either<mixed, mixed>;

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
  f[Symbol.for('TypeName')] = 'Arrow'

  /***
   * arr
   ***/
  f.first   = x => f.product(id)(x)
  f.second  = x => swap(f.first(id)(swap(x)))

  f.compose = g => Arrow( compose(f)(g) )
  f.pipe    = g => Arrow(g).compose(f) //reverse compose

  f.product = g => Arrow( pair(f)(g) )
  f.fanout  = g => f.product(g).compose(dupe)

  /***
   * arrChoice
   ***/
  // arr ([t,a]: Either<*,*> ): Either<*,*>
  // raises a type check error on `t` being `Left` instead of `Right`
  // and `Right` instead of `Left`
  // :(
  f.sum = g => Arrow( ([t,a]) =>
    cond(
      [eq(t, 'Left'),  Left(f(a))],
      [eq(t, 'Right'), Right(g(a))]))

  f.fanin = g => f.sum(g).pipe(untag)

  f.left  = x => f.sum(id)(x)
  f.right = x => Arrow(id).sum(f)(x)

  return f
}

export {
  Arrow,
}
