import type {
  EitherT,
} from './either'

import {
  Left,
  Right,
  either,
} from './either'

import type {
  PairT,
} from './pair'

import {
  dupe,
  runPair,
  swap,
} from './pair'

import {
  compose,
  id,
} from './prelude'

/*
 * Arrow type should type check on (a -> b) or ((a,b) -> (c,d)) functions
 */
export type ArrowT = (a: *) => * & {
  '@@type': 'Arrow';
  '@@value': (a: *) => *;
  inspect: () => string;

  first:  (p: PairT<*, *>) => ArrowT;
  second: (p: PairT<*, *>) => ArrowT;

  compose: (b: ArrowT) => ArrowT;
  pipe:    (b: ArrowT) => ArrowT;

  product: (b: ArrowT) => ArrowT;
  fanout:  (b: ArrowT) => ArrowT;

  sum:   (b: ArrowT) => ArrowT;
  fanin: (b: ArrowT) => *;

  left:  (x: *) => EitherT<*, *>;
  right: (x: *) => EitherT<*, *>;

}

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
  f.second  = x => swap(f.first(swap(x)))

  f.compose = g => Arrow( compose(f)(g) )
  f.pipe    = g => Arrow(g).compose(f) //reverse compose

  f.product = g => Arrow( runPair(f)(g) )
  f.fanout  = g => f.product(g).compose(dupe)

  /***
   * arrChoice
   ***/
  f.sum   = g => Arrow( either( a => Left.of(f(a)) )( a => Right.of(g(a)) ) )
  f.fanin = g => f.sum(g).pipe( either(id)(id) )

  f.left  = x => f.sum(id)(x)
  f.right = x => Arrow(id).sum(f)(x)

  return f
}

export {
  Arrow,
}
