import { generateMilesForTrip } from "../../../src/services/miles-service";
import * as MilesRepository from "../../../src/repositories/miles-repository";
import { calculateMiles } from "../../../src/services/miles-calculator-service";
import { tripFactory } from "../factories/trip.factory";

jest.mock("../../../src/repositories/miles-repository");
jest.mock("../../../src/services/miles-calculator-service");

const findMilesMock =
  MilesRepository.findMiles as jest.MockedFunction<typeof MilesRepository.findMiles>;

const saveMilesMock =
  MilesRepository.saveMiles as jest.MockedFunction<typeof MilesRepository.saveMiles>;

const calculateMilesMock =
  calculateMiles as jest.MockedFunction<typeof calculateMiles>;

describe("MilesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate miles when trip is valid", async () => {
    const trip = tripFactory();
    const calculatedMiles = 3000;

    findMilesMock.mockResolvedValue(null);
    calculateMilesMock.mockReturnValue(calculatedMiles);
    saveMilesMock.mockResolvedValue(undefined);

    const result = await generateMilesForTrip(trip);

    expect(findMilesMock).toHaveBeenCalledWith(trip.code);
    expect(calculateMilesMock).toHaveBeenCalledWith(trip);
    expect(saveMilesMock).toHaveBeenCalledWith(trip.code, calculatedMiles);
    expect(result).toBe(calculatedMiles);
  });

  it("should throw conflict error when trip code already exists", async () => {
    const trip = tripFactory();

    findMilesMock.mockResolvedValue({
      code: trip.code,
      miles: 5000,
    } as any);

    await expect(generateMilesForTrip(trip)).rejects.toEqual({
      type: "conflict",
      message: `Miles already registered for code ${trip.code}`,
    });

    expect(calculateMilesMock).not.toHaveBeenCalled();
    expect(saveMilesMock).not.toHaveBeenCalled();
  });
});
