/*
 * A Datatype ...
 */

const Data = ({name, params}) => {
  const constraints = params
    .sort( (a,b) => b.arity - a.arity )
    .map( ({type, constraint}) => ({type, constraint: constraint(type)}) )


  const constructor = constraints.reduce(
      (last, {type, constraint}) => next => {

console.log(`
Running type constraint: ${constraint.toString()}
On value: ${JSON.stringify(next)}
------------------------------------------------------------------`);

        const result = constraint(next)
        console.log(`Result: ${result}`);

        if(!result) {
          console.log(`
Oops! We expected a ${type['@@type']} but instead found a ${next['@@type']}.
          `) 
        }

        return last
      },
      {
        '@@type': name,
        of: x => ({
          '@@type': name,
          '@@value': x
        }),
        is: x => x['@@type'] == name
      })

  return constructor
}

const Type = {
  '@@type': 'Type',
  is: x => x['@@type'] !== undefined || x['@@type'] !== null,
  wrap: native => ({
    '@@type': native.name, 
    of: x => ({
      '@@type': native.name,
      '@@value': x
    }) 
  }) 
}

const Nat = Data({
  name: 'Nat',
  params: [],
  refinements: [
    x => x > 0,
  ]
})

const Vect = Data({
  name: 'Vect',
  params: [{
    arity: 0,
    type: Nat,
    constraint: _nat => x => _nat.is(x),
  }, {
    arity: 1,
    type: Type,
    constraint: _type => x => _type.is(x),
  }],
  refinements: [
    n => t => x => x.length === n['@@value'],
    n => t => x => x.map(t.is).reduce(and, true),
  ]
})

const Str = Type.wrap(String)

const VectStringString = Vect(Str)(Str)
const Vect2String = Vect(Nat.of(3))(Str)
console.log(Vect2String)
const v1 = Vect2String.of(["Hello", "World"])
console.log(v1)
