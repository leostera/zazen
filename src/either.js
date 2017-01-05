import type {
  Atom,
} from 'zazen/utils'

import {
  atom,
} from 'zazen/utils'

export type Left  = Atom
export type Right = Atom
export type Either = [ Left | Right, mixed ]

const left  = (a: Either) => [atom('Left'),  a]
const right = (a: Either) => [atom('Right'), a]

const either = (f: Function, g: Function, [tag, a]: Either): ?Either => {
  if( tag == atom('Left')  ) return [atom('Left'),  f(a)]
  if( tag == atom('Right') ) return [atom('Right'), g(a)]
}

const mirror = ([tag, a]: Either): ?Either => {
  if (tag === atom('Left')  ) return [atom('Right'), a]
  if (tag === atom('Right') ) return [atom('Left'), a]
}

const untag = ([tag, a]: Either): ?mixed => {
  if (tag === atom('Left')  ) return a
  if (tag === atom('Right') ) return a
}

export {
  left,
  right,
  either,
  mirror,
  untag,
}
