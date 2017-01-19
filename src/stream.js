import type {
  Arrow,
} from 'zazen/arrow'

import {
  arr,
} from 'zazen/arrow'

const stream = (f: Function): Arrow => (arr( (x: mixed[]) => x.map(f)))

export {
  stream,
}
