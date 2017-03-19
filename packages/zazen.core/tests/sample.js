const { TypeClass } = require('../src/TypeClass')
const { Data } = require('../src/Data')
const { World } = require('../src/World')

/*
 * Define TypeClasses
 */
const Functor = TypeClass('Functor').where({
  map: map => f => x => undefined
})

console.log(Functor)

const Monoid = TypeClass('Monoid').where({
  concat: concat => a => b => undefined,
  empty: undefined,
})

console.log(Monoid)

/*
 * Define some instances
 */
const ListF = Functor.instance('List').where({
  map: map => f => xs => Array.prototype.map.call(xs, f)
})

const ListMonoid = Monoid.instance('List').where({
  concat: concat => a => b => Array.prototype.concat.call(a, b),
  empty: [],
})

/*
 * Define some Data
 */
const ListT = Data('List')

/*
 * Glue everything together
 */
const { List, map, concat } = World({
  datatypes: [ListT],
  instances: [ListF, ListMonoid],
  typeClasses: [Functor, Monoid],
})

const a = List.of([1,2,3])
console.log(a)
const b = List.of([4,5,6])
console.log(b)
const c = map( x => x+1 )(a)
console.log(c)
const d = concat(b, c)
console.log(d)

