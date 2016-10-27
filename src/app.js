// Base Combinators
const filter = (f, c) => s => f(s) && c(s)
const id     = a => a
const map    = (f, c) => s => c(f(s))

// Side-efectul Combinators
const log = (prefix, combinator) => s => {
  console.log(performance.now()|0, prefix, "=>", s)
  return combinator(s)
}

// Mappers/Filters
const has    = name => o => o[name] !== undefined
const to     = name => o => o[name]
const exists = o => !!o
const odd    = a => !!(a%2)

// Producers
const event = (name, c) => {
  document.addEventListener(name, c)
  return c
}

const periodic = (f, t, c) => {
  setInterval(() => c(f), t)
  return c
}

// Streams
const s0 =
  periodic({a: 1}, 500,
    log("periodic", id))

const s1 =
  event('mousemove',
    filter(exists,
      filter(has('timeStamp'),
        map( m => ({x: m.x, y: m.y}),
          log("filter", id)))))
