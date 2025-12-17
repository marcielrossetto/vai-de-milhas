// tests/unit/services/miles-calculator-service.test.ts
import { calculateMiles } from "../../../src/services/miles-calculator-service";
import { calculateDistance } from "../../../src/services/distances-calculator-service";

// Diz ao Jest para substituir este módulo por uma versão mockada automática
jest.mock("../../../src/services/distances-calculator-service");

// Cria uma referência tipada para o mock, permitindo usar .mockReturnValue sem erros de TS
const calculateDistanceMock = calculateDistance as jest.MockedFunction<typeof calculateDistance>;

describe("MilesCalculatorService", () => {
  
  // Limpa o estado dos mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate miles applying bonuses", () => {
    // Configura o mock para retornar 1000 sempre que for chamado
    calculateDistanceMock.mockReturnValue(1000);

    const miles = calculateMiles({
      origin: { lat: 0, long: 0 },
      destination: { lat: 1, long: 1 },
      miles: false,
      plane: "A320",
      service: "EXECUTIVE",
      affiliate: "GOLD",
      date: "2025-05-10",
    });

    // Verifica se calculou (o valor deve ser maior que 1000 por causa dos bônus)
    expect(miles).toBeGreaterThan(1000);
    // Verifica se o serviço de distância foi chamado corretamente
    expect(calculateDistanceMock).toHaveBeenCalledTimes(1);
  });

  it("should return 0 when trip is paid with miles", () => {
    const miles = calculateMiles({
      origin: { lat: 0, long: 0 },
      destination: { lat: 1, long: 1 },
      miles: true, // Pago com milhas
      plane: "A320",
      service: "ECONOMIC",
      affiliate: "BRONZE",
      date: "2025-06-10",
    });

    expect(miles).toBe(0);
  });
});