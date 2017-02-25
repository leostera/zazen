import type {
  EitherT,
} from './either'

import type {
  PairT,
} from './pair'

import type {
  Data,
  Type,
  TypeChecker,
} from './type'

import {
  Left,
  Right,
  createMatch,
  match as matchEither,
} from './'

import {
  type
} from './type'

type GetXT = Type<'GetX', ?null>
type GetYT = Type<'GetY', ?null>
type SetXT = Type<'SetX', number>
type SetYT = Type<'SetY', number>
type MessageT = GetXT | SetXT | GetYT | SetYT
type UnknownMessageT = Type<'UnknownMessage', string>

type PointParams = PairT<number, number>
type PointT = Type<'Point', PointParams>
type PointH = (m: MessageT) => EitherT<UnknownMessageT, number | PointT>
type PointC = (a: PointParams) => PointH

const UnknownMessage: Data<UnknownMessageT, ?null> = type('UnknownMessage')
const GetX: Data<GetXT, ?null> = type('GetX')
const GetY: Data<GetYT, ?null> = type('GetY')
const SetX: Data<SetXT, number> = type('SetX')
const SetY: Data<SetYT, number> = type('SetY')

const pointId: TypeChecker<MessageT> = x => x
const match = createMatch(pointId)

const makePoint: PointC = ([x, y]) => message => match({
  GetX: () => Right.of(x),
  GetY: () => Right.of(y),
  SetX: v => Right.of(makePoint([v, y])),
  SetY: v => Right.of(makePoint([x, v])),
  _: () => Left.of(UnknownMessage.of(`Unknown message`))
})

matchEither({
  Right: x => x
})( makePoint([2, 1])( GetX.of() ) )

export default makePoint
