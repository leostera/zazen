const One = 1
console.log(One) // 1

match({
  Nat: x => x+1, // For non-dependant types
  [Nat()]: x => x+1, // alternative syntax that works for all types
})(One) // 2 : Nat

const v1 = ["Some", "Text"]
console.log(v1) // ["Some", "Text"]
// infers length and type from arguments

match({
  [Vect(2, String)]: xs => xs.join('-')
})(v1) // "Some-Text" : String


const v2 = Vect(3, Number).of(["Hello", "World"]) // this blows up

/* should this be defined by defining a monoidal instance for vector? */
const addVectors = v1 => v2 => _ 

/* and if so, where do we re-pack the Vect into a Vect (n+m) e ? */
const VectMonoid = Monoid('Vect').where({
  concat: a => b => a.concat(b) // Vect is an Array afterall
})
