
// https://www.w3.org/TR/hr-time/#monotonic-clock
const tick = (): number => {
  let t = -1//window && window.performance && window.performance.now()|0 || -1
  return t < 0 ? 0 : t
}

const _now_time = (): string => (new Date()).toTimeString().split(' ')[0]
const now = (): string => `${_now_time()}:${tick()}`

const log = (x: mixed): mixed => (
  ("${NODE_ENV}"!=="production") && console.log(now(), x),
  x
)

log.ns = (namespace: string): Function => log.bind({}, namespace)

export type Atom = Symbol | Symbol[]
const atom = (...args: Array<string>): Atom => {
  let keys: Symbol[]= args.map(Symbol.for)
  return keys.length === 1 ? keys[0] : keys
}

export {
  atom,
  log,
  tick,
}
