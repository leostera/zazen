/*
 * A Datatype ...
 */
exports.Data = name => ({
  '@@type': name,
  of: x => ({
    '@@type': name,
    '@@value': x,
  })
})
