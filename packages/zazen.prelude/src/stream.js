import type {
  ArrowT,
} from 'zazen/arrow'

import {
  Arrow,
} from 'zazen/arrow'

type StreamT = ArrowT

const Stream = (f: Function): StreamT => (Arrow( (x: mixed[]) => x.map(f)))

export {
  Stream,
}
