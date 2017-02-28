import {
  id,
  compose,
} from '../prelude'

test(`id :: a -> a`, () => expect( id(1) ).toEqual( 1 ))

const add1 = x => x+1
const mul3 = x => x*3

test(`compose :: (b -> c) -> (a -> b) -> a -> c`,
  () => expect( compose(add1)(mul3)(1) ).toEqual( 4 ))
