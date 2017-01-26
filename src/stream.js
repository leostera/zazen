import type {
  ArrowT,
} from 'zazen/arrow'

import {
  Arrow,
} from 'zazen/arrow'

type StreamT = ArrowT

const stream = (f: Function): StreamT => (Arrow( (x: mixed[]) => x.map(f)))

export {
  stream,
}
