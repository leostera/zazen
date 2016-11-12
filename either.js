import type { Atom } from 'zazen/utils'

import {
  atom
} from 'zazen/utils'

type Left  = Atom
type Right = Atom
type Either<T> = [ Left | Right, T ]

const either = (f: Function, g: Function, [LR, a]: Either): mixed => {
  if( LR === atom('Left')  ) return f(a)
  if( LR === atom('Right') ) return g(a)
}

const mirror = ([LR, a]: Either): ?Either => {
  if (LR === atom('Left')  ) return [atom('Right'), a]
  if (LR === atom('Right') ) return [atom('Left'), a]
}

const untag = ([LR, a]: Either): ?mixed => {
  if (LR === atom('Left')  ) return a
  if (LR === atom('Right') ) return a
}

export {
  either,
  mirror,
  untag,
}
