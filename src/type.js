/*
 * Generic TypeChecker used to coerce inputs of functions when using them.
 * See: https://github.com/ostera/zazen/pull/20
 */
export type TypeChecker<A> = (a: A) => A

/*
 * Generic TypeRepresentation Type, used to ensure that types have the right
 * internal structure.
 */
export type Type<A, B> = {
  '@@type': A,
  '@@value': B,
  inspect(): String,
  is(x: B): boolean
}

export type Setoid<A, B> = Type<A, B> & {
  equals(a: Setoid<A, B>): boolean
}

export type Functor<A, B> = Type<A, B> & {
  map(f: (a: B) => B): Functor<A, B>
}
type Map<A> = (x: A) => (f: (a: A) => A) => Functor<*, A>

export type Foldable<A, B> = Type<A, B> & {
  fold(f: (a: B) => B): B
}

export type SemiGroup<A, B> = Type<A, B> & {
  concat(x: SemiGroup<A, B>): SemiGroup<A, B>
}

export type Monoid<A, B> = SemiGroup<A, B> & {
  id(): Monoid<A, B>
}

/*
 * Generic Data Type, used to ensure that all lifters can be properly
 * type-checked.
 */
export type Data<A, B> = {
  of: (x: B) => A
}

/*
 * Generic Type Creator. If used with Flow's Inference engine, works smoothly
 * to verify that `of` blows up in time for the wrong types.
 */
const createType = (name: any): any => ({
  '@@type': name,
  of: x => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name
  })
})

const createFunctor = (map: Map<any>) => (name: any): any => {
  const of = x => ({
    ...createType(name).of(x),
    map: f => of(map(x)(f))
  })

  return {of}
}

export {
  createType,
  createFunctor,
}
