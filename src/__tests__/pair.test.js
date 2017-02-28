import {
  Pair,
  swap,
  untag,
  first,
  second,
} from '../pair'

const a = [1,2]
const b = [2,1]
const c = ["what", 3]

test(`Can create a Pair`,
  () => expect( Pair(1,2) ).toEqual( [1,2] ))

test(`first extracts the first element of a pair`,
  () => expect( first(Pair(1,2)) ).toEqual( 1 ))

test(`second extracts the second element of a pair`,
  () => expect( second(Pair(1,2)) ).toEqual( 2 ))

test(`Can swap a pair`,
  () => expect( swap(a) ).toEqual(b))

test(`Can untag a tagged pair`,
  () => expect( untag(c) ).toEqual(3))
