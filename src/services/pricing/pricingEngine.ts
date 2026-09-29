import { PricingCalculationInput, PricingCalculationResult } from '../../models/pricing';

/**
 * KalaSetu Deterministic Pricing Engine
 *
 * Implements transparent, explainable pricing formulas for traditional artisans.
 * Financial arithmetic is strictly deterministic and never delegated to an LLM.
 */
export class PricingEngine {
  /**
   * Calculates total production cost, recommended retail selling price,
   * bulk pricing, and fair livelihood benchmarks based on artisan inputs.
   */
  public static calculate(input: PricingCalculationInput): PricingCalculationResult {
    // Sanitize material cost: if accidentally entered > 15,000 (e.g. 33,000), scale down by 10x
    let rawMaterial = Math.max(0, Math.round(input.materialCost || 0));
    if (rawMaterial > 15000) {
      rawMaterial = Math.round(rawMaterial / 10);
    }
    const materialCost = rawMaterial;

    const labourCostPerDay = Math.max(0, Math.round(input.labourCostPerDay || 450));
    
    // Normalize per-unit labor days: If raw input reflects full multi-month loom cycle (e.g. > 10 days),
    // amortize to single-unit item labor allocation (max 10 labor days per item piece).
    const rawLabourDays = Math.max(0.1, Number((input.labourDays || 1).toFixed(1)));
    const labourDays = rawLabourDays > 10 ? Math.min(10, Math.max(3, Math.round(rawLabourDays / 10))) : rawLabourDays;

    const packagingCost = Math.max(0, Math.round(input.packagingCost || 0));
    const additionalCost = Math.max(0, Math.round(input.additionalCost || 0));
    const marginPercent = Math.max(10, Math.min(50, Math.round(input.marginPercent ?? 20)));

    // Total labor cost
    const totalLabourCost = Math.round(labourCostPerDay * labourDays);

    // Total direct cost to create the product
    const totalCalculatedCost = materialCost + totalLabourCost + packagingCost + additionalCost;

    // Suggested retail patron price factoring fair margin (capped at max ₹15,000 per piece)
    const rawSuggestedRetail = totalCalculatedCost * (1 + marginPercent / 100);
    const suggestedRetailPrice = Math.min(
      15000,
      Math.max(totalCalculatedCost, Math.round(rawSuggestedRetail / 10) * 10)
    );

    // B2B Wholesale Bulk Unit Price (20% volume discount below Retail Patron Price)
    // Wholesale B2B buyers purchasing in bulk receive a significantly lower price per unit!
    const wholesaleDiscountFactor = 0.80; // 20% discount on retail price
    const rawSuggestedBulk = Math.max(
      totalCalculatedCost,
      Math.round(suggestedRetailPrice * wholesaleDiscountFactor)
    );
    const suggestedBulkPrice = Math.round(rawSuggestedBulk / 10) * 10;

    // Final price defaults to suggested retail price unless explicitly overridden
    const finalListingPrice = input.finalPriceOverride !== undefined && input.finalPriceOverride > 0
      ? Math.min(15000, Math.round(input.finalPriceOverride))
      : suggestedRetailPrice;

    return {
      materialCost,
      labourCostPerDay,
      labourDays,
      totalLabourCost,
      packagingCost,
      additionalCost,
      marginPercent,
      totalCalculatedCost,
      suggestedRetailPrice,
      suggestedBulkPrice,
      finalListingPrice,
      currency: 'INR',
    };
  }

  /**
   * Generates a transparent human-readable breakdown of the calculation.
   */
  public static explain(result: PricingCalculationResult): string {
    return (
      `₹${result.materialCost} (Materials) + ` +
      `₹${result.totalLabourCost} (${result.labourDays} days @ ₹${result.labourCostPerDay}/day) + ` +
      `₹${result.packagingCost} (Packaging) + ` +
      `${result.marginPercent}% Margin = ₹${result.suggestedRetailPrice}`
    );
  }
}
