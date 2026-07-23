## 1. Shared Types

- [ ] 1.1 Add `Speaker` interface to `shared-types/src/index.ts` with fields: `name`, `email`, `talkTitle`
- [ ] 1.2 Verify `shared-types` builds successfully with `nx build shared-types`

## 2. Backend (api)

- [ ] 2.1 Create `CreateSpeakerDto` class in `api/src/app/` with `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`)
- [ ] 2.2 Create `SubmissionsController` with a POST endpoint that accepts `@Body() CreateSpeakerDto`
- [ ] 2.3 Register the controller in `app.module.ts`
- [ ] 2.4 Write unit test verifying invalid payloads (missing name, invalid email) return 400 Bad Request
- [ ] 2.5 Run backend tests with `nx test api`

## 3. Frontend (front)

- [ ] 3.1 Create standalone `SubmissionFormComponent` with signal-based state for `name`, `email`, `talkTitle`, `submissionStatus`
- [ ] 3.2 Add WAI-ARIA attributes (`role="form"`, `aria-label`, `aria-describedby`) to form elements
- [ ] 3.3 Implement signal that blocks submission when required fields are empty or email is invalid
- [ ] 3.4 Write unit test validating initial signal state (all fields empty, submissionStatus is `idle`)
- [ ] 3.5 Write unit test validating submission is blocked when name is empty
- [ ] 3.6 Write unit test validating submission is blocked when email format is invalid
- [ ] 3.7 Run frontend tests with `nx test front`

## 4. Integration

- [ ] 4.1 Verify `front` can import `Speaker` from `@cfp-platform/shared-types`
- [ ] 4.2 Verify `api` can import `Speaker` from `@cfp-platform/shared-types`
- [ ] 4.3 Run `nx run-many -t test -p api front` to confirm all tests pass