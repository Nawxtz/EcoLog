export const CO2_FACTORS: Record<string, number> = {
  walking: 0.21,
  cycling: 0.21,
  public_transport: 0.089,
  plant_based_meal: 1.5,
  recycling: 0.5,
  home_energy: 0.233,
}

export const UNIT_MAP: Record<string, string> = {
  walking: "km",
  cycling: "km",
  public_transport: "km",
  plant_based_meal: "meal",
  recycling: "kg",
  home_energy: "kWh",
}

export function calculateCO2Saved(type: string, amount: number): number {
  const factor = CO2_FACTORS[type] ?? 0
  return Math.round(amount * factor * 100) / 100
}

export function getUnitForType(type: string): string {
  return UNIT_MAP[type] ?? "unit"
}