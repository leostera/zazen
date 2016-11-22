import type {
  Arrow,
} from './arrow'

import {
  arrow,
} from './arrow'

const stream = (f: Function): Arrow => (arrow( (x: mixed[]) => x.map(f)))

export {
  stream,
}
