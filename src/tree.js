import {
  match,
} from './cond'

import {
  Cell,
} from './cell'

import {
  Right,
  Left,
  either,
} from './either'

import {
  second,
} from './pair'

import {
  inspect,
} from './type'

import {
  blue,
  green,
  red,
} from 'chalk'

const Branch = (north, west, east) => ({
  '@@value': {north, west, east},
  '@@type': 'Branch',
  inspect: () => `Branch(north: ${inspect(north)}, west: ${inspect(west)}, east: ${inspect(east)})`,
  fold: f => f(north),
  map: f => {
    const newBranch = f({
      north,
      west: west['@@type'] === 'Branch' || west['@@type'] === 'Leaf'
        ? west['@@value'].north
        : west,
      east: east['@@type'] === 'Branch' || east['@@type'] === 'Leaf'
        ? east['@@value'].north
        : east
    })

    const newWest = west['@@type'] === 'Branch' || west['@@type'] === 'Leaf'
      ? match({
        Branch: x => Branch(
          newBranch.west,
          west['@@value'].west,
          west['@@value'].east
        ),
        Leaf: x => Leaf(newBranch.west)
      })(west)
      : newBranch.west

    const newEast = east['@@type'] === 'Branch' || east['@@type'] === 'Leaf'
      ? match({
        Branch: x => Branch(
          newBranch.east,
          east['@@value'].west,
          east['@@value'].east
        ),
        Leaf: x => Leaf(newBranch.east)
      })(east)
      : newBranch.east

    console.log(green('newEast'), newEast)

    return Branch(
      newBranch.north,
      west['@@type'] === 'Branch' || west['@@type'] === 'Leaf'
        ? newWest.map(f)
        : newWest,
      east['@@type'] === 'Branch' || east['@@type'] === 'Leaf'
        ? newEast.map(f)
        : newEast
    )
  }
})

const Leaf = (north) => ({
  '@@value': {north},
  '@@type': 'Leaf',
  inspect: () => `Leaf(${north})`,
  fold: f => f(north),
  map: f => Leaf(f({north}).north)
})

const myTree = Branch(
  [Cell( x => x + 1 ), Right.of([100, 300])],
  [Cell( x => x + 4 ), Right.of([200, 300])],
  Branch(
    [Cell( x => x * 2 ), Right.of([13, 22])],
    [Cell( x => x * 7 ), Right.of([62, 64])],
    [Cell( x => x / 2 ), Right.of([82, 84])]
  )
)

// const myTree = Branch(
//   1,
//   Branch(3, 5, 4),
//   Leaf(6)
// )

// console.log(myTree['@@value'].east)

const tree2 = myTree.map(({north, west, east}) => {
  const northResult = north[0](north[1])

  const argument = direction => [
    either(second)(second)(northResult),
    either(second)(second)(direction[1])
  ]

  const westResult = match({
    Left: () => west[0](Left.of(argument(west))),
    Right: () => west[0](Right.of(argument(west)))
  })(north[1])

  const eastResult = match({
    Left: () => east[0](Left.of(argument(east))),
    Right: () => east[0](Right.of(argument(east)))
  })(north[1])

  console.log(red('north'), north, northResult)
  console.log(red('west'), west, westResult)
  console.log(red('east'), east, eastResult)

  return {
    north: [north[0], northResult],
    west: [west[0], westResult],
    east: [east[0], eastResult]
  }
})

const getResultTree = ({north, west, east}) => {
  return ({
    north: north instanceof Array ? north[1] : north,
    east: east['@@type'] === 'Branch' || east['@@type'] === 'Leaf'
      ? east.map(getResultTree)
      : east[1],
    west: west['@@type'] === 'Branch' || west['@@type'] === 'Leaf'
      ? west.map(getResultTree)
      : west[1],
  })
}

const tree3 = tree2.map(getResultTree)

console.log(tree3['@@value'])



// Branch(
//   1,
//   Branch(4, 9, 8),
//   7
// )
