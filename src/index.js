//@flow

import { log } from './log'

type Arrow = {
  id(): Function;
  next(g: Function): Function;
}

// Lifts a function into an Arrow
// arrrow :: (b -> c) -> Arrow b c
const arrow = (f: Function): Arrow  => {
  f.id   = () => f
  f. = g => x => g(f(x))
  return f
}
