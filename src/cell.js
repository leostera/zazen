import {
  arrow as arr,
} from 'zazen'

const dirty = (oldArgs, newArgs) => true

const cell = (fn, child) => {
  const cell_fn = arr((...args) => {
    const arg_s = `(${args.join(', ')})`
    if(cell_fn.last_args[0] !== args[0]) {
      cell_fn.last_args = args
      cell_fn.last_val = fn.apply({}, args)
      child(cell_fn.last_val)
    }
    return cell_fn.last_val
  })

  cell_fn.last_args = []
  cell_fn.last_val = undefined
  cell_fn.dirty = true

  return cell_fn
}


// const effect = (effect) => {
//   let theNext = () => {}
//   const listener = effect(theNext)
//
//   return ({next, state}) => {
//     theNext = next
//     return listener(state)
//   }
// }

const effect = (f) => {
  let state = { }
  const g = f(state)

  return cell( x => x )
    .loop(state, (...args) => (g.apply({}, args)) )
}

effect(
  (next) => {
    const onClick = () => next({type: 'CLICKED'})

    return cell((state) => ({
      type: 'div',
      props: [{name: 'onClick', value: onClick}],
      children: []
    }), x => x)
  }
)

export {
  cell,
}
