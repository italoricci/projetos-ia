## Context

The cfp-platform monorepo uses Nx with Angular 22 for the frontend (`front`) and NestJS for the backend (`api`). A shared library (`shared-types`) already exists as a buildable esbuild library with path mapping `@cfp-platform/shared-types` configured in the root `tsconfig.base.json`. The platform currently has no lecture submission capability — speakers cannot submit talk proposals through the system.

The architecture enforces strict separation: the frontend is Angular standalone components with signals, the backend uses NestJS with class-validator for `@Body()` validation, and both must share the `Speaker` contract from `shared-types`.

## Goals / Non-Goals

**Goals:**
- Enable speakers to submit lecture proposals via a validated form
- Enforce type safety across the stack via a shared `Speaker` contract
- Validate incoming payloads strictly on the backend (400 on invalid input)
- Provide accessible UI with WAI-ARIA attributes
- Cover both frontend and backend with Jest unit tests

**Non-Goals:**
- Persistence layer (database, ORM, API routes for storage)
- Authentication or authorization for submission
- Email notifications or admin review workflow
- Frontend routing beyond the submission form

## Decisions

### 1. Speaker contract in shared-types
The `Speaker` interface will be defined in `shared-types/src/index.ts` and exported as `@cfp-platform/shared-types`. Both `api` and `front` will import from this package. This ensures a single source of truth for the speaker data shape.

**Alternative considered**: Duplicating the type in each project. Rejected because it creates drift risk and violates DRY.

### 2. NestJS validation with class-validator
The backend will use `@Body()` with `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, etc.) on a `CreateSpeakerDto` class. NestJS's built-in validation pipe will automatically reject invalid payloads with 400.

**Alternative considered**: Manual validation in the controller. Rejected because class-validator is the standard NestJS pattern and provides declarative, testable validation rules.

### 3. Angular standalone components with signals
The frontend will use standalone components (no NgModules) with `signal()` for reactive state management. The form state will be a signal object tracking `name`, `email`, `talkTitle`, and `submissionStatus`. WAI-ARIA attributes (`aria-label`, `aria-describedby`, `role="form"`) will be applied for accessibility.

**Alternative considered**: ReactiveFormsModule with FormGroup. Rejected because signals are the modern Angular approach for standalone components and align with the strict architecture rules.

### 4. Jest for unit tests on both sides
Both `api` and `front` already have Jest configured via Nx. Tests will be co-located with source files (`.spec.ts` suffix).

**Alternative considered**: No tests. Rejected because the rules mandate unit tests for both backend validation and frontend signal state.

## Risks / Trade-offs

- [Risk] `shared-types` is CJS format only — if the Angular app needs ESM, a build format change may be needed later. → Mitigation: The current esbuild config outputs CJS which works for NestJS; Angular can consume it via the path mapping in tsconfig.
- [Risk] No integration test between frontend and backend — unit tests only cover isolated behavior. → Mitigation: The `api-e2e` and `front-e2e` projects exist for integration testing if needed later.

## Migration Plan

1. Add `Speaker` interface to `shared-types`
2. Implement backend DTO and controller in `api`
3. Implement frontend components in `front`
4. Write backend unit tests
5. Write frontend unit tests
6. Run `nx test` for both projects to verify

## Open Questions

- Should the `Speaker` interface include additional fields beyond name, email, and talk title (e.g., bio, affiliation)?
- Is there an existing API prefix or versioning convention for the NestJS app?