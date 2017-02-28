import {
  Cell,
  Graph,
} from './src/cell'

import {
  Left,
  Right,
} from 'zazen'

const l = console.log.bind(null)

/*
 *            (     +1     )
 *           /      |        \
 *       (+10)   (+100)     (*10)
 *      /  |  \            /  |  \
 * (+20) (+30) (+40)  (*20) (*30) (*40)
 *   |
 *  (+1)
 */
const g = Graph([
  Cell( x => x+1 ),
  [
    Cell( x => x+10 ),
    [
      Cell( x => x+20 ),
      Cell( x => x+1 ),
    ],
    Cell( x => x+30 ),
    Cell( x => x+40 ),
  ],
  Cell( x => x+100 ),
  [
    Cell( x => x*10 ),
    Cell( x => x*20 ),
    Cell( x => x*30 ),
    Cell( x => x*40 ),
  ],
])


l("G ----")
l(g([
  Right.of([5, 10]),
  [
    Right.of([4, 14]),
    [
      Right.of([4, 24]),
      Right.of([24, 25]),
    ],
    Right.of([4, 46]),
    Right.of([4, 56]),
  ],
  Right.of([4, 104]),
  [
    Right.of([6, 60]),
    Right.of([4, 24]),
    Right.of([4, 46]),
    Right.of([4, 56]),
  ],
]))

/*
Right([ 1, [
  Right([ 2,4]),
  Right([ 2,
    [ Right([ 5,
      [ Right([ 9,
        [ Right([109,309])]])]])]])]])
        */
