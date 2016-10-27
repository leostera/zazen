// Base Combinators
const apply  = f => s => f(s)
const filter = (f, c) => s => f(s) && c(s)
const id     = a => a
const map    = (f, c) => s => c(f(s))

const combine = (...args) => {
  const c = args.pop()
  const vals = args.map( a => c(a) )
  return s => {

  }
}

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
const event = (name, c) => s => {
  document.addEventListener(name, c)
  return c(s)
}

const periodic = (f, t, c) => s => {
  setInterval(() => c(f), t)
  return c(s)
}

// Streams
const s0 =
  periodic({id: 0}, 500,
    log("periodic-1", id))

const s1 =
  periodic({id: 1}, 250,
    log("periodic-2", id))

const s2 =
  event('mousemove',
    filter(exists,
      filter(has('timeStamp'),
        map( m => ({x: m.x, y: m.y}),
          log("filter", id)))))

const combined =
  combine(
    s0,
    s1,
    s2,
    log("combined", id))

combined(id)
