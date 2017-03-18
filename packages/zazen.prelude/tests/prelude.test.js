import {
  compose,
  eq,
  id,
  log,
  or,
} from '../prelude'

test(`id :: a -> a`, () => expect( id(1) ).toEqual( 1 ))

const add1 = x => x+1
const mul3 = x => x*3

test(`compose :: (b -> c) -> (a -> b) -> a -> c`,
  () => expect( compose(add1)(mul3)(1) ).toEqual( 4 ))

test(`eq :: a -> a -> Bool`,
  () => expect( eq(1)(1) ).toEqual(true) )

test(`eq :: [a] -> [a] -> Bool`,
  () => expect( eq([1,2])([1,2]) ).toEqual(true))

 test(`eq :: [a] -> [b] -> Bool`,
  () => expect( eq([1,2])(['a','b']) ).toEqual(false))

const a = { a: { b: [1], c: true } }
const b = { a: { b: [1,2] } }

test(`eq :: {a} -> {a} -> Bool`,
  () => expect( eq(a)(a) ).toEqual(true) )

test(`eq :: {a} -> {b} -> Bool`,
  () => expect( eq(a)(b) ).toEqual(false) )

test(`or :: Bool -> Bool -> Bool`,
  () => {
    expect( or(true)(true) ).toEqual(true)
    expect( or(true)(false) ).toEqual(true)
    expect( or(false)(true) ).toEqual(true)
    expect( or(false)(false) ).toEqual(false)
  })

test(`log :: x -> IO x`,
  () => expect( log(1) ).toEqual( 1 ) )
