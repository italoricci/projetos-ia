## Why

The platform needs a lecture submission module so speakers can submit their talk proposals through a structured, validated workflow. Currently there is no mechanism for collecting or validating speaker-submitted content, which blocks the core conference submission flow.

## What Changes

- Add a lecture submission form in the `front` Angular application with standalone components and signal-based state management
- Add a submission endpoint in the `api` NestJS backend with strict `@Body()` validation via `class-validator`
- Define and export the `Speaker` contract from `shared-types` so both frontend and backend consume the same type definitions
- Add unit tests for the NestJS backend validating that invalid payloads are rejected with 400 Bad Request
- Add unit tests for the Angular frontend validating the initial signal state and submission blocking behavior

## Capabilities

### New Capabilities
- `lecture-submission`: End-to-end lecture submission flow including form UI, API endpoint, validation, and unit tests

### Modified Capabilities

## Impact

- `shared-types` library will gain a new `Speaker` interface export
- `api` will gain a new controller and DTO with class-validator decorators
- `front` will gain new standalone components using Angular signals and WAI-ARIA attributes
- Both `api` and `front` will gain Jest unit test suites