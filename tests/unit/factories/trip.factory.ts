import { faker } from "@faker-js/faker";

export function tripFactory(overrides: Partial<any> = {}) {
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
    service: "ECONOMIC",
    affiliate: "BRONZE",
    date: "2025-06-10",
    ...overrides,
  };
}
