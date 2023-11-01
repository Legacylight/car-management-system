export const idlFactory = ({ IDL }) => {
  const Car = IDL.Record({
    'id' : IDL.Text,
    'model' : IDL.Text,
    'year' : IDL.Text,
    'isAvailable' : IDL.Bool,
    'updatedAt' : IDL.Opt(IDL.Nat64),
    'brand' : IDL.Text,
  });
  const _AzleResult = IDL.Variant({ 'Ok' : Car, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({ 'Ok' : IDL.Opt(Car), 'Err' : IDL.Text });
  const _AzleResult_2 = IDL.Variant({ 'Ok' : IDL.Vec(Car), 'Err' : IDL.Text });
  return IDL.Service({
    'addCar' : IDL.Func([Car], [_AzleResult], []),
    'bookCar' : IDL.Func([IDL.Text], [_AzleResult], []),
    'deleteCar' : IDL.Func([IDL.Text], [_AzleResult_1], []),
    'getCars' : IDL.Func([], [_AzleResult_2], ['query']),
    'getcar' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'returnCar' : IDL.Func([IDL.Text], [_AzleResult], []),
    'searchCars' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'updateCar' : IDL.Func([IDL.Text, Car], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
