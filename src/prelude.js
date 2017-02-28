
type composeFn = (f: Function) => (g: Function) => *
const compose: composeFn = f => g => x => f(g(x))

const id = (x: *): * => x

export {
  compose,
  id,
}
