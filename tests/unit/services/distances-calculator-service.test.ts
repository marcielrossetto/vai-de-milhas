// src/services/distances-calculator-service.ts

export function calculateDistance(point1: { lat: number, long: number }, point2: { lat: number, long: number }): number {
  // Implementação básica para passar no teste (Fórmula de Haversine simplificada ou mockada)
  // O teste espera que calcule a distância e arredonde.
  
  const R = 6371; // Raio da terra em km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLong = deg2rad(point2.long - point1.long);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) *
      Math.cos(deg2rad(point2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km

  return Math.round(distance);
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}