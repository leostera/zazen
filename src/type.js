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
  '@@value': B
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
  of: x => ({
    '@@type': name,
    '@@value': x,
  })
})

export {
  createType,
}
