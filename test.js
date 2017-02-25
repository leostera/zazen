import {
  Cell,
  Graph,
} from './src/cell'

import {
  Left,
  Right,
} from 'zazen'

const add = x => Cell( y => y+x )

const add1 = add(1)
const add100 = add(100)

const mul3 = Cell( x => x*3 )
const l = console.log.bind(null)

const g = Graph([
  add(1),
  [
    add(100)
  ]
])


l("G ----")
l(g(

  Right.of([
    1,
    Right.of([
      4,
      [ Right.of([2, 102]) ]
    ])
  ])

))

/*
Right([ 1, [
  Right([ 2,4]),
  Right([ 2,
    [ Right([ 5,
      [ Right([ 9,
        [ Right([109,309])]])]])]])]])
        */
