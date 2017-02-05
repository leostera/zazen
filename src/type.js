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
  inspect: () => string,
  is: (x: Data<Type<A, B>, any>) => boolean,
}

export type Setoid<A, B> = Type<A, B> & {
  equals(a: Setoid<A, B>): boolean
}
type Equals<A> = (x: A) => (y: A) => boolean

export type Functor<A, B> = Type<A, B> & {
  map(f: (a: B) => B): Functor<A, B>
}
type Map<A> = (x: A) => (f: (a: A) => A) => A

export type Foldable<A, B> = Type<A, B> & {
  fold(f: (a: B) => B): B
}
type Fold<A> = (a: A) => (f: (a: A) => A) => A

type Concat<A> = (x: A) => (x: A) => A
export type SemiGroup<A, B> = Type<A, B> & {
  '@@concat': Concat<B>,
  concat(x: SemiGroup<A, B>): SemiGroup<A, B>
}

/*
 * Generic Data Type, used to ensure that all lifters can be properly
 * type-checked.
 */
export type Data<A, B> = {
  '@@type': any,
  of(x: B): A
}

export type Monoid<A, B> = Data<A, B> & {
  empty(): SemiGroup<any, B>
}
type Empty<A> = A

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

const foldable = (fold: Fold<any>) => (name: any) => ({
  '@@type': name,
  of: x => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name,
    fold: fold(x)
  })
})

const functor = (map: Map<any>) => (name: any) => {
  const of = (x: *): Functor<*,*> => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name,
    map: f => of(map(x)(f))
  })

  return {
    '@@type': name,
    of
  }
}

const semiGroup = (concat: Concat<any>) => (name: any) => {
  const of = (x: *): SemiGroup<*,*> => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name,
    '@@concat': concat,
    concat: y => of(concat(x)(y['@@value']))
  })

  return {
    '@@type': name,
    of
  }
}

const setoid = (equals: Equals<any>) => (name: any) => ({
  '@@type': name,
  of: x => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name,
    equals: y => equals(x)(y['@@value'])
  })
})

const monoid = (concat: Concat<any>, empty: Empty<any>) => (name: any) => {
  const of = x => ({
    '@@type': name,
    '@@value': x,
    inspect: () => `${name}(${x})`,
    is: y => y['@@type'] === name,
    concat: y => of(concat(x)(y['@@value']))
  })

  return {
    '@@type': name,
    of,
    empty: () => of(empty)
  }
}

export {
  createType,
  foldable,
  functor,
  monoid,
  semiGroup,
  setoid,
}
