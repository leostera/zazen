const Nat = Type('Nat').where({
  constraints: gte(0)
})

const One = Nat.of(1)
console.log(One) // 1 : Nat
Nat.is(One) // true
One.is(Nat) // true

match({
  Nat: x => x+1, // For non-dependant types
  [Nat()]: x => x+1, // alternative syntax that works for all types
})(One) // 2 : Nat

const Vect = Type('Vect', [Nat, String])
// Vect : Nat l -> String e -> Vect l e

const v1 = Vect.of(["Some", "Text"])
console.log(v1) // ["Some", "Text"] : Vect 2 String
// infers length and type from arguments

Vect.is(v1) // true
v1.is(Vect) // false
v1.is(Vect(2, String)) // true

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
