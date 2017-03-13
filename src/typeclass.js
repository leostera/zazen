const World = ({ types, classes, instances }) => true
  // take all instances' functions and use the defined types to
  // create generic exportable functions using `match`
  // so that when we call those functions they go through the pattern matching
  // and we know what instance of which typeclass to call

const Data = name => ({
  '@@type': 'Type',
  of: value => ({
    '@@type': name,
    '@@value': value,
    inspect: inspect(name)(value)
  })
})

const SumType = (...names) => ({
  '@@type': names,
  constructors: map(Data)(names)
})

const TypeClass = name => signature => spec => ({
  '@@type': signature,
})

const Bool = SumType('True', 'False')
const Ordering = SumType('LT', 'GT', 'EQ')

const Eq = TypeClass('Eq').where({
  equals:  ['a', 'a', Bool],
  inequal: ['a', 'a', Bool],
})

const Nat = Eq('Nat').where({
  equals:  a => b => a == b,
  inequal: a => b => a != b,
})

const Ord = TypeClass('Ord').from('Eq').where({
  compare: ['a', 'a', Ordering],
  lt:  ['a', 'a', Bool],
  gt:  ['a', 'a', Bool],
  lte: ['a', 'a', Bool],
  gte: ['a', 'a', Bool],
  max: ['a', 'a', 'a'],
  min: ['a', 'a', 'a'],
})

const Functor = TypeClass('Functor').where({
  map: ['a -> b', 'f a', 'f b']
})

const List = Data('List')

const ListFunctor = Functor(List).where({
  map: f => a => a.map(f) // implementation specific
})

const Arrow = TypeClass('Arrow')({

})

export default World({
  types: [Bool, Ordering],
  classes: [Eq, Functor, Arrow],
  instances: [List, Nat]
})
