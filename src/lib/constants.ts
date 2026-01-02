/**
 * Brand constants for consistent branding across the application
 * IMPORTANT: Always use "3rdeyeadvisors" - never "3rd Eye Advisors"
 */

export const BRAND_NAME = "3rdeyeadvisors";
export const BRAND_AUTHOR = "3EA Research Team";
export const BRAND_EMAIL = "info@the3rdeyeadvisors.com";
export const BRAND_DOMAIN = "the3rdeyeadvisors.com";
export const BRAND_URL = "https://www.the3rdeyeadvisors.com";

/**
 * Subscription Pricing - Single source of truth
 * Update these values when prices change
 */
export const PRICING = {
  monthly: {
    amount: 99,
    display: "$99",
    period: "/month",
    stripePrice: "price_1SfmuFLxeGPiI62jZkGuCmqm",
  },
  annual: {
    amount: 1188,
    display: "$1,188",
    period: "/year",
    stripePrice: "price_1Sl04YLxeGPiI62jjtRmPeC9",
  },
};

/**
 * Commission rate for referrals (50%)
 */
export const COMMISSION_RATE = 0.5;

/**
 * Calculated commission amounts based on pricing and rate
 */
export const COMMISSIONS = {
  monthly: Math.round(PRICING.monthly.amount * COMMISSION_RATE * 100) / 100,
  annual: Math.round(PRICING.annual.amount * COMMISSION_RATE * 100) / 100,
};