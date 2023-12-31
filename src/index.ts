import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Car = Record<{
    isAvailable: boolean;
    id: string;
    brand: string;
    model: string;
    year: string;
    updatedAt: Opt<nat64>;
}>;
const carStorage = new StableBTreeMap<string, Car>(0, 44, 1024);

$query
export function searchCars(query: string): Result<Vec<Car>, string> {
    try {
        const lowerCaseQuery = query.toLowerCase();
        const filteredCars = carStorage.values().filter(
            (car) =>
                car.brand.toLowerCase().includes(lowerCaseQuery) ||
                car.model.toLowerCase().includes(lowerCaseQuery)
        );
        return Result.Ok(filteredCars);
    } catch (error) {
        return Result.Err(`Error searching for a car: ${error}`);
    }
}

$update
export function bookCar(id: string): Result<Car, string> {
    return match(carStorage.get(id), {
        Some: (car) => {
            if (car.isAvailable) {
                return Result.Err<Car, string>(`Car with id=${id} is already booked`);
            }

            const newCar: Car = { ...car, isAvailable: true };
            carStorage.insert(id, newCar);

            return Result.Ok(newCar);
        },
        None: () => Result.Err<Car, string>(`Car with id=${id} not found`),
    }) as Result<Car, string>;
}

$update
export function returnCar(id: string): Result<Car, string> {
    return match(carStorage.get(id), {
        Some: (car) => {
            if (!car.isAvailable) {
                return Result.Err<Car, string>(`Car with id=${id} is not currently available`);
            }

            const newCar: Car = { ...car, isAvailable: false };
            carStorage.insert(id, newCar);

            return Result.Ok(newCar);
        },
        None: () => Result.Err<Car, string>(`Car with id=${id} not found`),
    }) as Result<Car, string>;
}

$update
export function addCar(car: Car): Result<Car, string> {
    try {
        // Generate a unique ID for the car
        car.id = uuidv4();
        // Initialize available to false when adding a new car
        car.isAvailable = false;

        // Validate the car object
        if (!car.brand || !car.model || !car.year) {
            return Result.Err('Missing required fields in the car object');
        }

        // Update the updatedAt field with the current timestamp
        car.updatedAt = Opt.Some(ic.time());

        // Add the car to carStorage
        carStorage.insert(car.id, car);

        return Result.Ok(car);
    } catch (error) {
        return Result.Err(`Error adding car: ${error}`);
    }
}

$update
export function updateCar(id: string, car: Car): Result<Car, string> {
    return match(carStorage.get(id), {
        Some: (existingCar) => {
            // Validate the updated car object
            if (!car.brand || !car.model || !car.year) {
                return Result.Err('Missing required fields in the car object');
            }

            // Create a new car object with the updated fields
            const updatedCar: Car = {
                ...existingCar,
                ...car,
                updatedAt: Opt.Some(ic.time()),
            };

            // Update the car in carStorage
            carStorage.insert(id, updatedCar);

            return Result.Ok(updatedCar);
        },
        None: () => Result.Err<Car, string>(`Car with id=${id} does not exist`),
    }) as Result<Car, string>;
}

$query
export function getCars(): Result<Vec<Car>, string> {
    try {
        const cars = carStorage.values();
        return Result.Ok(cars);
    } catch (error) {
        return Result.Err(`Error getting cars: ${error}`);
    }
}

$query
export function getcar(id: string): Result<Car, string> {
    return match(carStorage.get(id), {
        Some: (car) => Result.Ok<Car, string>(car),
        None: () => Result.Err<Car, string>(`Car with id=${id} not found`),
    }) as Result<Car, string>;
}

$update
export function deleteCar(id: string): Result<Opt<Car>, string> {
    try {
        // Validate the id parameter
        if (!isValidUUID(id)) {
            return Result.Err('Invalid car ID');
        }

        // Delete the car from carStorage
        const deletedCar = carStorage.remove(id);
        if (!deletedCar) {
            return Result.Err(`Car with ID ${id} does not exist`);
        }

        return Result.Ok(deletedCar);
    } catch (error) {
        return Result.Err(`Error deleting car: ${error}`);
    }
}

export function isValidUUID(id: string): boolean {
    return /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
}
// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};