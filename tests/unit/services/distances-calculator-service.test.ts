import { calculateDistance } from "../../../src/services/distances-calculator-service";

describe("Distances Calculator Service", () => {
  it("should calculate distance between two points correctly", () => {
    // Exemplo: Distância aproximada entre São Paulo e Rio de Janeiro
    // SP: -23.5505, -46.6333
    // RJ: -22.9068, -43.1729
    // A implementação usa Haversine, esperamos um valor positivo.
    
    const point1 = { lat: -23.5505, long: -46.6333 };
    const point2 = { lat: -22.9068, long: -43.1729 };

    const distance = calculateDistance(point1, point2);

    // Verifica se retornou um número e se não é zero (pois são pontos diferentes)
    expect(typeof distance).toBe("number");
    expect(distance).toBeGreaterThan(0);
  });

  it("should return 0 if points are the same", () => {
    const point = { lat: 10, long: 10 };
    const distance = calculateDistance(point, point);
    expect(distance).toBe(0);
  });
});