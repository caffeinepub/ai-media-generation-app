# Specification

## Summary
**Goal:** Build an AI Media Studio app where authenticated users can generate images and videos via the Replicate API, manage credits, purchase more via Stripe, and view their media gallery — all behind Internet Identity authentication with a dark ultra-modern UI.

**Planned changes:**
- Implement Internet Identity authentication; protect all pages (generation, gallery, credits, admin) from unauthenticated access
- Build a credit system in the backend (Motoko single actor) storing per-user balances in stable storage; deduct 500 credits atomically per generation and reject if insufficient
- Integrate Replicate API on the backend for image generation: accept prompt, call model, store result URL, return to frontend
- Integrate Replicate API on the backend for video generation: accept prompt, call model, store result URL, return to frontend
- Build a generation page with Image and Video tabs, each with a prompt input, Generate button, live status indicator (idle/processing/complete/error), and inline result rendering; show current credit balance and disable Generate when balance < 500
- Build a personal gallery page showing all generated images and videos per user with media preview, prompt, type badge, and timestamp
- Build an admin panel restricted to a designated admin principal showing all users (principal, credit balance, generation count) with ability to manually adjust balances
- Integrate Stripe payments: show at least three credit bundle options (1000, 5000, 10000 credits), initiate payment from frontend, increment backend balance on successful payment, refresh displayed balance immediately
- Apply a dark ultra-modern visual theme: near-black background, cyan/emerald accents (no blue/purple), glassmorphism or neon glow on cards/buttons, sharp modern typography, fully responsive

**User-visible outcome:** Users can log in with Internet Identity, purchase credits via Stripe, generate AI images and videos with a prompt, view all their generated media in a personal gallery, and admins can manage user credit balances — all within a sleek dark-themed interface.
