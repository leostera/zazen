// Base Combinators
const apply  = f => s => f(s)
const filter = (f, c) => s => f(s) && c(s)
const id     = a => a
const map    = (f, c) => s => c(f(s))

// Side-effectful Combinators
const log = (prefix, combinator) => s => {
  console.log(performance.now()|0, prefix, "=>", s)
  return combinator(s)
}

// Some Mappers/Filters
const has    = name => o => o[name] !== undefined
const to     = name => o => o[name]
const exists = o => !!o
const odd    = a => !!(a%2)

// Streams

/* more realistic app state
const tap = (f, c) => s => {
  f(s)
  return c
}

let prevState
const saveStore = (nextState) => {
  prevState !== nextState && push(nextState)
  prevState = nextState
}

const listeners = compose(
    filter((listener) => listener != null),
    map((effect) => effect(push)),
)(effects)

const push =
  scan(reducer, initialState,
    tap(saveStore,
      map(applyListener,
        render)))
*/
