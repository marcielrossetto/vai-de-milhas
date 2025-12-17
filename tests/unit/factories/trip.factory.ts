import { faker } from "@faker-js/faker";
// CORREÇÃO: Adicione mais um "../" para subir 3 níveis
import { Trip, ServiceClass, AffiliateStatus } from "../../../src/protocols";

export function tripFactory(overrides: Partial<Trip> = {}): Trip {
  return {
    code: faker.string.alphanumeric(6),
    origin: {
      lat: faker.location.latitude(),
      long: faker.location.longitude(),
    },
    destination: {
      lat: faker.location.latitude(),
      long: faker.location.longitude(),
    },
    miles: false,
    plane: "A320",
    service: ServiceClass.ECONOMIC,
    affiliate: AffiliateStatus.BRONZE,
    date: "2025-06-10",
    ...overrides,
  };
}