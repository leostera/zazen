import type {
  Atom,
} from 'zazen/utils'

import {
  atom,
} from 'zazen/utils'

export type Left  = Atom
export type Right = Atom
export type Either = [ Left | Right, mixed ]

const left  = (a: mixed): Either => [atom('Left'), a]
const right = (a: mixed): Either => [atom('Right'), a]

const either = (f: Function) => (g: Function) => ([tag, a]: Either): ?Either => {
  if( tag == atom('Left')  ) return left(f(a))
  if( tag == atom('Right') ) return right(g(a))
}

const mirror = ([tag, a]: Either): ?Either => {
  if( tag == atom('Left')  ) return right(a)
  if( tag == atom('Right') ) return left(a)
}

const untag = ([tag, a]: Either): mixed => {
  if ( tag == atom('Left') || tag === atom('Right') ) return a
}

export {
  left,
  right,
  either,
  mirror,
  untag,
}
