import {
  Cell,
  Graph,
  Left,
  Right,
} from 'zazen'

test(`a Graph can be applied to partially recompute`, () => {
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
    ],
  ])


  const result = g([
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
    ],
  ])

  console.log(result)

  expect(result).toHaveLength(4)
  expect(result[1]).toHaveLength(4)
  expect(result[3]).toHaveLength(3)

  expect(result[0].is(Right)).toBeTruthy()
  expect(result[2].is(Right)).toBeTruthy()

  expect(result[1][0].is(Right)).toBeTruthy()
  expect(result[1][2].is(Left)).toBeTruthy()
  expect(result[1][3].is(Left)).toBeTruthy()

  expect(result[1][1][0].is(Right)).toBeTruthy()
  expect(result[1][1][1].is(Right)).toBeTruthy()

  expect(result[3][0].is(Left)).toBeTruthy()
  expect(result[3][1].is(Left)).toBeTruthy()
  expect(result[3][2].is(Left)).toBeTruthy()
})
