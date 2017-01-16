import type {
  Atom,
} from 'zazen/utils'

import {
  atom,
} from 'zazen/utils'

type Pair<A, B> = [A, B]

type LeftStr = "Left"
type RightStr = "Right"
export type Left  = Atom
export type Right = Atom
export type Either = [ Left | Right, mixed ]

const build_either = (t: LeftStr | RightStr, a: mixed): Either => {
  const e = [ atom(t), a ]
  // Okay, so __proto__ doesn't work, and neither does Symbol.toStringTag
  // need to figure this out without having to use `new` everywhere
  e.toString = () => {
    console.log(this)
    return `${t}(${Object.prototype.toString.call(a)})`
  }
  return e
}

const left  = (a: mixed): Either => build_either('Left', a)
const right = (a: mixed): Either => build_either('Right', a)

const either = (f: Function) => (g: Function) => ([tag, a]: Either): ?Either => {
  if( tag == atom('Left')  ) return left(f(a))
  // Need to figure out this shitty ?Either thing
  if( tag == atom('Right') ) return right(g(a))
}

const mirror = ([tag, a]: Either): Either => {
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
