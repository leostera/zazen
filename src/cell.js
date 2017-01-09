import {
  arrow,
} from 'zazen/arrow'

const dirty = (oldArgs, newArgs) => true

const cell = (fn, child) => {
  const cell_fn = arrow((...args) => {
    const arg_s = `(${args.join(', ')})`
    if(cell_fn.last_args[0] !== args[0]) {
      console.log(`Recalculating cell with ${arg_s}`)
      cell_fn.last_args = args
      cell_fn.last_val = fn.apply({}, args)
      child(cell_fn.last_val)
    } else {
      console.log(`Skipping recalculation for ${arg_s}`)
    }
    return cell_fn.last_val
  })

  cell_fn.last_args = []
  cell_fn.last_val = undefined
  cell_fn.dirty = true

  return cell_fn
}

export {
  cell,
}
