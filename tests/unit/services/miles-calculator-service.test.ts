import { calculateMiles } from "../../../src/services/miles-calculator-service";
import { calculateDistance } from "../../../src/services/distances-calculator-service";
import { ServiceClass, AffiliateStatus } from "../../../src/protocols";

jest.mock("../../../src/services/distances-calculator-service");

const calculateDistanceMock =
  calculateDistance as jest.MockedFunction<typeof calculateDistance>;

describe("MilesCalculatorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate miles applying service, affiliate and birthday bonuses", () => {
    calculateDistanceMock.mockReturnValue(1000);

    const result = calculateMiles({
      code: "TEST-CODE-123",
      origin: { lat: 0, long: 0 },
      destination: { lat: 1, long: 1 },
      miles: false,
      plane: "A320",
      service: ServiceClass.EXECUTIVE,
      affiliate: AffiliateStatus.GOLD,
      date: "2025-05-10", // Maio → bônus de aniversário
    });

    expect(result).toBeGreaterThan(1000);
    expect(calculateDistanceMock).toHaveBeenCalledTimes(1);
  });

  it("should return 0 when trip is paid with miles", () => {
    const result = calculateMiles({
      code: "TEST-CODE-456",
      origin: { lat: 0, long: 0 },
      destination: { lat: 1, long: 1 },
      miles: true,
      plane: "A320",
      service: ServiceClass.ECONOMIC,
      affiliate: AffiliateStatus.BRONZE,
      date: "2025-06-10",
    });

    expect(result).toBe(0);
    expect(calculateDistanceMock).not.toHaveBeenCalled();
  });
});
