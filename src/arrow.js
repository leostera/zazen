import type {
  EitherT,
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
  '@@type': 'Arrow';

  id(b: mixed): mixed;

  first(p: Pair<mixed, mixed>):  ArrowT;
  second(p: Pair<mixed, mixed>): ArrowT;

  compose(b: ArrowT): ArrowT;
  pipe(b: ArrowT):    ArrowT;

  product(b: ArrowT): ArrowT;
  fanout (b: ArrowT): ArrowT;

  left(x: mixed):  EitherT<mixed, mixed>;
  right(x: mixed): EitherT<mixed, mixed>;

  sum(b: ArrowT):   ArrowT;
  fanin(b: ArrowT): mixed;
}

const pair = f => g => ([a,b]) => [f(a), g(b)]

const dupe = x => [x,x]

const compose = f => g => x => f(g(x))

const id = x => x

// Lifts a function into an arr
// arrow :: (b -> c) -> arr b c
const Arrow = (f: Function): ArrowT  => {
  f['@@type']  = 'Arrow'
  f['@@value'] = f
  f.inspect = () => `${f['@@type']}(${f.toString()})`

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
  f.sum = g => Arrow( either( a => Left.of(f(a)) )( a => Right.of(g(a)) ) )

  f.fanin = g => f.sum(g).pipe( either( x => x )( x => x ) )

  f.left  = x => f.sum(id)(x)
  f.right = x => Arrow(id).sum(f)(x)

  return f
}

export {
  Arrow,
}
