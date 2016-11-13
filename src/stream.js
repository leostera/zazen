import type {
  Arrow,
} from 'zazen/arrow'

import {
  arrow,
} from 'zazen/arrow'

const stream = (f: Function): Arrow => (arrow( (x: mixed[]) => x.map(f)))

export {
  stream,
}
