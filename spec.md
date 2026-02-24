# Specification

## Summary
**Goal:** Harden the Replicate API integration for image and video generation by fixing HTTP outcall issues, adding structured error handling, a secure API key configuration system, retry logic with exponential backoff, and improved error messaging in the UI.

**Planned changes:**
- Audit and fix the backend Replicate API HTTP outcall for image generation: correct request payload schema, stable API key retrieval, deterministic transform function stripping non-deterministic headers, full response parsing, and typed error variants (`#ApiKeyMissing`, `#ApiError(text)`, `#Timeout`, `#ParseError`) instead of generic traps
- Apply the same hardening to the video generation HTTP outcall
- Add a backend `setReplicateApiKey` admin-only function that stores the key in stable memory, and a `hasReplicateApiKey` query that returns whether the key is configured (key value never exposed)
- Update the Admin page to show the Replicate API key status (configured/not configured), a password input with a Save button to set or rotate the key, success/error toasts on save, and a warning banner when the key is not configured
- Implement exponential backoff retry logic in the GenerationTab: after a generation error, show a Retry button that retries up to 3 times with 2s/4s/8s delays, display retry progress ("Retrying… attempt N/3"), use a stable idempotency key per prompt session, and show a "Start over" option after 3 failed attempts
- Map typed backend error variants to specific user-facing messages in GenerationTab instead of showing a generic error

**User-visible outcome:** Admins can configure the Replicate API key from the Admin page and see its status. Users get clear, specific error messages during generation failures, can retry with one click using automatic exponential backoff, and the system no longer traps on generation errors.
