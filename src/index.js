import { log, tick as now } from 'zazen/utils'

type Pair<T>  = [ T, T ]
type Arrow = {
  first():  Arrow;
  second(): Arrow;
  compose(b: Arrow): Arrow;
  combine(b: Arrow): Arrow;
  fanout (b: Arrow): Arrow;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (a: Function): Arrow  => {
  const f = x => {
    const v = a(x)
    f.__dependants.forEach( d => {
      d(v)
    })
    return v
  }

  f.first  = () => arrow( ([a, _]: Pair): Pair => [f(a), _] )
  f.second = () => arrow( ([_, b]: Pair): Pair => [_, f(b)] )

  const compose = g => arrow( x => f(g(x)) )
  const combine = g => arrow( ([a, b]) => [f(a),g(b)] )

  f.compose = compose
  f.combine = combine
  f.fanout  = g => combine(g).compose( arrow( x => [x,x] ) )

  f.merge = g => {
    g.dependant(f)
    return g
  }

  f.__dependants = []
  f.dependant = g => {
    f.__dependants.push(g)
    return f
  }

  return f
}

// Lifts a function into a Stream Arrow
// stream :: (b -> c) -> Arrow [b] [c]
const stream = (f: Function): Arrow => (arrow( a => a.map(f) ))

let to_coords = ({x,y}) => ({x,y})
let to_list = x => [x]

let merged =
(stream( x => x )
  .compose(to_list))
  .fanout(log.ns("Merged Clicks!"))
  .merge(clicks)

document.addEventListener('mousedown', clicks)
document.addEventListener('mousemove', moves)

export { arrow, stream }

window.m = merged
window.clicks = clicks
window.moves = moves
