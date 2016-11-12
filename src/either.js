import type {
  Atom,
} from 'zazen/utils'

import {
  atom,
} from 'zazen/utils'

export type Left  = Atom
export type Right = Atom
export type Either = [ Left | Right, mixed ]

const either = (f: Function, g: Function, [LR, a]: Either): ?Either => {
  if( LR === atom('Left')  ) return [atom('Left'),  f(a)]
  if( LR === atom('Right') ) return [atom('Right'), g(a)]
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
