// let f
// 
// (a, b)
// with b = (1, (2, (3, 4)))
// 
// 
// f(a) === first(b) => Left (a, b)
//                   => Right(a, (first(b), g(f(a), second(b))))
//
//
//

import {
  cond,
  Arrow,
  Left,
  Right,
} from 'zazen'

const Cell = f => {
  const _c = (x, [h, t]) => {
    const fx = f(x)

    return cond(
      [() => fx === h, Left([h, t])],
      [true, Right([fx, t])])
  }

  _c.compose = g => 

  _c.pipe = g => (Cell(id).sum(g)).compose(_c)

  _c.sum = g => Cell( ([t,a]) =>
    cond(
      [eq(t, 'Left'),  Left(f(a))],
      [eq(t, 'Right'), Right(g(a))]))

  return _c
}

const add1Cell = Cell( x => x + 1 )
const mul2Cell = Cell( y => y * 2 )

const add1ThenMul2Cell = add1Cell.pipe(mul2Cell)

const add1Values = add1Cell(1, [1, 2]) // => Left([1, 2])
const add1NewValues = add1Cell(2, [1, 2]) // => Right([2, 3])

const values = add1ThenMul2Cell(1, [1, [2, 4]]) // Left([1, [2, 4]])
const newValues = add1ThenMul2Cell(1, [2, [4, 6]]) // Right([2, Right([3, 6])])

