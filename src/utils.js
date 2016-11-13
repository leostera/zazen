
// https://www.w3.org/TR/hr-time/#monotonic-clock
const tick = (): number => {
  let t = window.performance && window.performance.now()|0 || -1
  return t < 0 ? 0 : t
}

const _now_time = (): string => (new Date()).toTimeString().split(' ')[0]
const now = (): string => `${_now_time()}:${tick()}`

const log = (...args: any[]): void => {
  // @todo: use ${NODE_ENV} here instead
  // let envsubst do the job
  ("${NODE_ENV}" !== "production")
    && console.log(now(), ...args)
}

log.ns = (namespace: string): Function => log.bind({}, namespace)

const error: Function = log.ns("ERROR:")
const info:  Function = log.ns("INFO:")

export type Atom = Symbol | Symbol[]
const atom = (...args: Array<string>): Atom => {
  let keys: Symbol[]= args.map(Symbol.for)
  return keys.length === 1 ? keys[0] : keys
}

export {
  atom,
  error,
  info,
  log,
  tick
}
