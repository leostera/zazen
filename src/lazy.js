const repeat  = function* (x) { yield x, yield* repeat(x) }

const iterate = f => a => function* () {
  const fa = f(a)
  yield fa, yield* iterate(f, fa)
}

