import {
  Arrow,
} from './arrow'

import {
  Left,
  Right,
} from './either'

const id = x => x

const Cell = f => {
  const c = Arrow(
    x => (([head, tail]) => head === tail[0]
      ? Left.of(tail)
      : Right.of([head, tail[1]])
    )(Arrow(f).product(Arrow(id).product(id))(x))
  )

  c.sum = g => 
}

const a = Cell( x => x * 2 )
const b = Cell( x => x + 2 )

console.log(a.sum(b)([2, [2, null]]))
