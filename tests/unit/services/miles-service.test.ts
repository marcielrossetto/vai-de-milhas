// 1. Importe o nome correto da função
import { generateMilesForTrip } from "../../../src/services/miles-service";
import * as MilesRepository from "../../../src/repositories/miles-repository";
import { calculateMiles } from "../../../src/services/miles-calculator-service";
import { tripFactory } from "../factories/trip.factory";

jest.mock("../../../src/repositories/miles-repository");
jest.mock("../../../src/services/miles-calculator-service");

const findMilesMock = MilesRepository.findMiles as jest.MockedFunction<typeof MilesRepository.findMiles>;
const saveMilesMock = MilesRepository.saveMiles as jest.MockedFunction<typeof MilesRepository.saveMiles>;
const calculateMilesMock = calculateMiles as jest.MockedFunction<typeof calculateMiles>;

describe("MilesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate miles when trip is valid", async () => {
    // Arrange
    const trip = tripFactory();
    const calculatedMiles = 3000;

    findMilesMock.mockResolvedValue(null); // Não existe conflito
    calculateMilesMock.mockReturnValue(calculatedMiles); 
    // O saveMiles no seu código retorna void ou Promise<void>, então resolvemos com undefined
    saveMilesMock.mockResolvedValue(undefined); 

    // Act
    // Chamamos a função com o nome correto
    const result = await generateMilesForTrip(trip);

    // Assert
    expect(findMilesMock).toHaveBeenCalledWith(trip.code);
    expect(calculateMilesMock).toHaveBeenCalledWith(trip);
    
    // Verifique se os argumentos batem com a implementação: saveMiles(code, miles)
    expect(saveMilesMock).toHaveBeenCalledWith(trip.code, calculatedMiles);
    
    // A implementação retorna apenas o número de milhas
    expect(result).toBe(calculatedMiles);
  });

  it("should throw error when trip code already exists", async () => {
    // Arrange
    const trip = tripFactory();
    
    // Simula que já encontrou milhas para esse código
    findMilesMock.mockResolvedValue({
      code: trip.code,
      miles: 5000
    } as any);

    // Act & Assert
    // Verifica se lança o objeto de erro esperado
    await expect(generateMilesForTrip(trip)).rejects.toEqual({
      type: "conflict",
      message: `Miles already registered for code ${trip.code}`
    });
    
    expect(saveMilesMock).not.toHaveBeenCalled();
    expect(calculateMilesMock).not.toHaveBeenCalled();
  });
});