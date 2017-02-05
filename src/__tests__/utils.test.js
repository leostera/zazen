import {
  log,
  atom,
  tick
} from 'zazen/utils'

test('atom returns a global Symbol', () => {
  expect(atom('test')).not.toEqual(atom('what'))
  expect(atom('test')).toEqual(atom('test'))
})

test('atom returns a list of global Symbols', () => {
  expect(atom('test', 'composed')).not.toEqual(atom('test', 'other'))
  expect(atom('test', 'composed')).toEqual(atom('test', 'composed'))
})

jest.useFakeTimers()
test('tick returns some number bigger or equal to 0', () => {
  for (let i = 0; i < 1000; i++) {
    expect(tick()).toBeGreaterThanOrEqual(0)
  }
})

test('log exists', () => {
  expect(log).toBeInstanceOf(Function)
  expect(log()).toBe(undefined)
})
