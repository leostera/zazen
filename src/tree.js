import {
  match,
} from './cond'

const inspect = x => x.inspect
  ? x.inspect()
  : x.toString()

const Branch = (north, west, east) => ({
  '@@value': {north, west, east},
  '@@type': Symbol.for('Branch'),
  inspect: () => `Branch(north: ${inspect(north)}, west: ${inspect(west)}, east: ${inspect(east)})`,
  fold: f => f(north),
  map: f => {
    const newBranch = f({
      north,
      west: west['@@value'] ? west['@@value'].north : west,
      east: east['@@value'] ? east['@@value'].north : east
    })

    const newWest = west['@@type']
      ? match({
        Branch: x => Branch(
          newBranch.west,
          west['@@value'].west,
          west['@@value'].east
        ),
        Leaf: x => Leaf(newBranch.west)
      })(west)
      : newBranch.west

    const newEast = west['@@type']
      ? match({
        Branch: x => Branch(
          newBranch.east,
          east['@@value'].west,
          east['@@value'].east
        ),
        Leaf: x => Leaf(newBranch.east)
      })(east)
      : newBranch.east

    return Branch(
      newBranch.north,
      newWest.map
        ? newWest.map(f)
        : newWest,
      newEast.map
        ? newEast.map(f)
        : newEast
    )
  }
})

const Leaf = (north) => ({
  '@@value': {north},
  '@@type': Symbol.for('Leaf'),
  inspect: () => `Leaf(${north})`,
  fold: f => f(north),
  map: f => Leaf(f({north}).north)
})

const myTree = Branch(1, 2, 3)
// const myTree = Branch(
//   1,
//   Branch(3, 5, 4),
//   Leaf(6)
// )

console.log(myTree)

const tree2 = myTree.map(({north, west, east}) => ({
  north: north,
  west: north + west,
  east: north + east
}))

console.log(tree2)
// Branch(
//   1,
//   Branch(4, 9, 8),
//   7
// )
