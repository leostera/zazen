/*
 * A TypeClass is akin to an interface, defining a set of methods that can be
 * be overriden on their instances for a specific data type
 */
exports.TypeClass = name => ({
  where: methods => ({
    '@@type': 'TypeClass',
    '@@name': name,
    inspect: () => `
    TypeClass ${name}

    Methods:
      ${Object.keys(methods).join('\n      ')}
    `,
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

