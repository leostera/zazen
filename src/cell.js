import {
  arrow,
} from 'zazen'

const dirty = () => true

const cell = (fn, child) => {
  const cell_fn = arrow((...args) => {
    if(cell_fn.last_args[0] !== args[0]) {
      console.log(`Recalculating cell with ${args}`)
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

const adder = n => x => {
  const y = x+n
  console.log(`adder(${n})(${x}) -> ${y}`)
  return y
}

cell( adder(1) ,
  cell( adder(2),
    cell(
      cell( adder(3), adder(4) ),
        adder(10) )))(1)


