import {
  swap,
  untag
} from 'zazen'

const a = [1, 2]
const b = [2, 1]
const c = ['what', 3]

test('Can swap a pair',
  () => expect(swap(a)).toEqual(b))

test('Can untag a tagged pair',
  () => expect(untag(c)).toEqual(3))
