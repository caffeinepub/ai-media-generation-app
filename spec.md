# Specification

## Summary
**Goal:** Remove all credit restrictions so that image and video generation is never blocked or limited by credit balance.

**Planned changes:**
- Remove credit deduction logic from the backend image and video generation endpoints so credits are never decremented on generation.
- Remove credit-gate checks on the frontend so the Generate button is always enabled regardless of credit balance.
- Remove any low-credits warnings, disabled states, or credit-threshold UI logic.
- Keep the credit balance display for informational purposes.
- Keep admin credit management and Stripe payment flows intact.

**User-visible outcome:** Users can generate images and videos freely without being blocked or warned about insufficient credits. The Generate button is always enabled, and the credit balance remains visible but no longer gates any action.
