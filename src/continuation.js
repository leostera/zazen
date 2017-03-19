import {
  Cell,
  Graph,
  either,
  id,
  Right,
  Left,
} from './'

const cookResult = previousResults => action => {
  const rootResult = either(id)(id)(previousResults[0])
  const newRootInput = [rootResult[1], action]

  return [
    Right.of([newRootInput, rootResult[1]])
  ].concat(previousResults.slice(1))
}

const remap = next => graph => graph.map(
  effect =>
    effect instanceof Array
      ? remap(next)(effect)
      : effect(next)
)

const App = (graph, results) => {
  let previousResults
  let resultGraph

  const next = action => {
    previousResults = resultGraph(cookResult(previousResults)(action))
  }

  resultGraph = Graph(remap(next)(graph))
  previousResults = resultGraph(results)

  return previousResults
}

App(
  [
    next => Cell( ([state, action]) => state + action ),
    next => Cell( x => (console.log(x), `${x} effect`) ),
    [
      next => Cell( x => x < 50 && x ),
      next => Cell( x => (setTimeout(() => next(10), 1000), `${x} effect`) )
    ]
  ],
  [
    Right.of([[1, 1], 1]),
    Right.of([undefined, undefined]),
    [
      Right.of([undefined, undefined]),
      Right.of([undefined, undefined])
    ]
  ]
)
