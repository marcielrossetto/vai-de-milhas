import { create } from "../../../src/services/miles-service";
import * as MilesRepository from "../../../src/repositories/miles-repository";
import { calculateMiles } from "../../../src/services/miles-calculator-service";
import { tripFactory } from "../factories/trip.factory";

// 1. Mocks dos módulos externos
jest.mock("../../../src/repositories/miles-repository");
jest.mock("../../../src/services/miles-calculator-service");

// 2. Criação de variáveis tipadas para os Mocks (evita erros de TypeScript)
const findMilesMock = MilesRepository.findMiles as jest.MockedFunction<typeof MilesRepository.findMiles>;
const saveMilesMock = MilesRepository.saveMiles as jest.MockedFunction<typeof MilesRepository.saveMiles>;
const calculateMilesMock = calculateMiles as jest.MockedFunction<typeof calculateMiles>;

describe("MilesService", () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create miles when trip is valid", async () => {
    // Arrange (Preparação)
    findMilesMock.mockResolvedValue(null); // Não existe viagem duplicada
    calculateMilesMock.mockReturnValue(3000); // Cálculo retorna 3000 milhas
    
    const savedTrip = {
      id: 1,
      code: "ABC123",
      miles: 3000,
      // Adicione outras propriedades se o seu objeto de retorno tiver mais campos
    };
    saveMilesMock.mockResolvedValue(savedTrip);

    const trip = tripFactory({ code: "ABC123" });

    // Act (Ação)
    const result = await create(trip);

    // Assert (Verificação)
    expect(findMilesMock).toHaveBeenCalledWith("ABC123");
    expect(calculateMilesMock).toHaveBeenCalledWith(trip);
    expect(saveMilesMock).toHaveBeenCalled();
    expect(result).toEqual(savedTrip);
  });

  it("should throw error when trip code already exists", async () => {
    // Arrange
    findMilesMock.mockResolvedValue({
      id: 1,
      code: "DUPLICATE",
      miles: 1500,
    } as any); // 'as any' ou o tipo da entidade Miles se você tiver

    const trip = tripFactory({ code: "DUPLICATE" });

    // Act & Assert
    // Verifica se lança um erro genérico (toBeDefined) ou específico
    await expect(create(trip)).rejects.toThrow(); 
    
    // Garante que não tentou salvar nem calcular se já existia
    expect(saveMilesMock).not.toHaveBeenCalled();
    expect(calculateMilesMock).not.toHaveBeenCalled();
  });
});