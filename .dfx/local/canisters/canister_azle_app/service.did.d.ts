import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Car {
  'id' : string,
  'model' : string,
  'year' : string,
  'isAvailable' : boolean,
  'updatedAt' : [] | [bigint],
  'brand' : string,
}
export type _AzleResult = { 'Ok' : Car } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : [] | [Car] } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : Array<Car> } |
  { 'Err' : string };
export interface _SERVICE {
  'addCar' : ActorMethod<[Car], _AzleResult>,
  'bookCar' : ActorMethod<[string], _AzleResult>,
  'deleteCar' : ActorMethod<[string], _AzleResult_1>,
  'getCars' : ActorMethod<[], _AzleResult_2>,
  'getcar' : ActorMethod<[string], _AzleResult>,
  'returnCar' : ActorMethod<[string], _AzleResult>,
  'searchCars' : ActorMethod<[string], _AzleResult_2>,
  'updateCar' : ActorMethod<[string, Car], _AzleResult>,
}
