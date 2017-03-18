/*
 * A TypeClass is akin to an interface, defining a set of methods that must be
 * implemented on their instances for a specific data type
 */
const TypeClass = name => ({
  where: methods => ({
    '@@type': 'TypeClass',
    '@@name': name,
    methods,
    instance: name2 => ({
      where: overrides => ({
        '@@instanceOf': name,
        '@@instanceFor': name2,
        methods: Object.assign({}, methods, overrides)
      })
    })
  })
})

const Type = name => ({
  '@@type': name,
  of: x => ({
    '@@type': name,
    '@@value': x,
  })
})

const Functor = TypeClass('Functor').where({
  map: map => f => x => undefined
})
console.log(Functor)

const ListT = Type('List')
const ListF = Functor.instance('List').where({
  map: map => f => xs => Array.prototype.map.call(xs, f)
})
console.log(ListT)
console.log(ListF)

const World = ({
  datatypes,
  instances,
  typeClasses,
}) => {
  const _w = datatypes.reduce( (acc, d) => {
    acc[d['@@type']] = d
    return acc
  }, {})

  const lookup = instances.reduce( (acc, i) => {
    acc[i['@@instanceFor']] = i.methods.map
    return acc
  }, {})

  _w.map = f => x => lookup[x['@@type']](_w.map)(f)(x['@@value'])

  console.log(_w)

  return _w
}

const { List, map } = World({
  datatypes: [ListT],
  instances: [ListF],
  typeClasses: [Functor],
})

console.log(map( x => x+1 )( List.of([1,2,3]) ))
