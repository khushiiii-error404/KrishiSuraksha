import { Policy } from "../types";

/**
 * Calculates Payout based on PMFBY (Pradhan Mantri Fasal Bima Yojana) guidelines.
 * Reference: Operational Guidelines PDF
 */

export const calculatePremium = (sumInsured: number, season: 'Kharif' | 'Rabi'): number => {
  // PMFBY Clause 10.1: Maximum Insurance charges payable by farmer
  // Kharif: 2.0% of SI
  // Rabi: 1.5% of SI
  // Commercial/Horticultural: 5% (Not handled in this simple function yet)
  const rate = season === 'Kharif' ? 0.02 : 0.015;
  return Math.floor(sumInsured * rate);
};

export const calculatePMFBYPayout = (
  severity: number, // 0-100 (Acts as proxy for Yield Loss %)
  policy: Policy,
  disasterType: string
): number => {
  
  const sumInsured = policy.sumInsured;
  let payout = 0;

  // Trigger Thresholds based on PMFBY operational realities
  if (severity < 20) {
    return 0; // Deductible / Minimal loss not covered
  }

  // Logic per Clause 15.1.3: Claim Payout = (Shortfall / Threshold) * Sum Insured
  // We use 'severity' as the assessed Shortfall Percentage.
  const lossPercentage = severity / 100;
  payout = sumInsured * lossPercentage;

  // Clause 15.3: Localized Calamity Loss Assessment
  // (Hailstorm, Landslide, Inundation, Cloud Burst, Natural Fire)
  if (disasterType === 'Fire' || disasterType === 'Flood' || disasterType === 'Storm') {
    // If severity is catastrophic (>80%), assume total loss for individual farm basis
    if (severity > 80) {
        payout = sumInsured;
    }
  }

  // Clause 15.5: On-Account Payment (Mid-Season Adversity)
  // Cap at 25% if it's a preliminary mid-season assessment (Drought usually falls here)
  if (disasterType === 'Drought') {
    // Mid-season relief is often capped at 25% until final CCE data comes in
    // However, for this "Instant Payout" demo, we will pay the full calculated amount
    // but in a real scenario, this might be capped.
    // payout = Math.min(payout, sumInsured * 0.25); 
  }

  return Math.floor(payout);
};

export const getClauseCitation = (disasterType: string): string => {
  switch (disasterType) {
    case 'Flood':
    case 'Storm':
    case 'Fire':
      return "Clause 15.3: Localized Calamities (Inundation/Fire)";
    case 'Drought':
      return "Clause 15.5: Mid-Season Adversity (On-Account Payment)";
    case 'Pest':
    case 'Disease':
      return "Clause 8.1.1: Yield Losses (Standing Crop)";
    default:
      return "PMFBY General Provisions";
  }
};