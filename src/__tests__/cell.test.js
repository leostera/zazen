import {
  Arrow,
  Cell,
  runCell,
  Left,
  Right,
  either,
} from 'zazen'

const options = {
  quiet: true,
  tests: 1000,
}

const id   = Arrow(x => x)
const str  = JSON.stringify
const add1 = Arrow(x => x + 1)

test(`a Cell is just a function`, () => {
  const c = Cell( id )

  expect( typeof c ).toEqual('function')
  expect( typeof c.inspect ).toEqual('function')
  // Why this weird inspection? Because istanbul, that's why.
  expect( c.inspect() ).toEqual('Cell(function (x) /* istanbul ignore next */{return x;})')
})

test(`a Cell is an Arrow`, () => {
  const c = Cell( add1 )

  expect(c.first).toBeTruthy()
  expect(c.second).toBeTruthy()
  expect(c.compose).toBeTruthy()
  expect(c.pipe).toBeTruthy()
  expect(c.product).toBeTruthy()
  expect(c.fanout).toBeTruthy()
  expect(c.sum).toBeTruthy()
  expect(c.fanin).toBeTruthy()
})

test(`a Cell takes an Either and returns an Either`, () => {
  const c = Cell( add1 )

  const params = Left.of([1,2])
  const result = c(params)
  const value = either(id)(id)(result)

  expect(value).not.toEqual(undefined)
})

test(`a Cell acts as identity on Left values`, () => {
  const c = Cell( add1 )

  const params = Left.of([1,10])
  const result = c(params)
  const value = either(id)(id)(result)

  expect(value).toEqual([1,10])
})

test(`a Cell performs work on Right values`, () => {
  const c = Cell( add1 )

  const params = Right.of([1,10])
  const result = c(params)
  const value = either(id)(id)(result)

  expect(value).toEqual([1,2])
})

test(`a Cell returns Right on recomputed values`, () => {
  const c = Cell( add1 )

  const params = Right.of([1,10])
  const result = c(params)
  const value = either(id)(id)(result)

  expect(result.is(Right)).toBeTruthy()
  expect(value).toEqual([1,2])
})

test(`a Cell returns Left on same-output values`, () => {
  const c = Cell( add1 )

  const params = Right.of([1,2])
  const result = c(params)
  const value = either(id)(id)(result)

  expect(result.is(Left)).toBeTruthy()
  expect(value).toEqual([1,2])
})

test(`runCell always recomputes the value`, () => {
  const c = Cell( add1 )

  const result = runCell(c)(1)
  const value = either(id)(id)(result)

  expect(result.is(Left)).toBeFalsy()
  expect(result.is(Right)).toBeTruthy()
  expect(value).toEqual([1,2])
})
