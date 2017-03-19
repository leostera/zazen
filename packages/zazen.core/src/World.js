/*
 * A World, borrowing Obi-Wan Kenobi's words, "binds the galaxy together".
 * It's intended to be a run-time dispatcher enabling ad-hoc polymorphism.
 */
exports.World = ({
  datatypes,
  instances,
  typeClasses,
}) => {
  const _w = datatypes.reduce( (acc, d) => {
    acc[d['@@type']] = d
    return acc
  }, {})

  const lookup = instances.reduce( (acc, i) => {
    acc[i['@@instanceFor']] = acc[i['@@instanceFor']] || {}
    acc[i['@@instanceFor']] = Object.assign(acc[i['@@instanceFor']], i.methods)
    return acc
  }, {})

  console.log("Lookup table: \n", lookup)

  _w.map = f => x => lookup[x['@@type']].map(_w.map)(f)(x['@@value'])
  _w.concat = x => y => lookup[x['@@type']].concat(_w.concat)(x['@@value'])(y['@@value'])

  console.log(_w)

  return _w
}

