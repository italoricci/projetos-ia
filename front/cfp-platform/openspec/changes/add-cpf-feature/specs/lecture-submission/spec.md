## ADDED Requirements

### Requirement: Speaker can submit a lecture proposal
The system SHALL allow a speaker to submit a lecture proposal through a form that collects name, email, and talk title.

#### Scenario: Successful submission with valid data
- **WHEN** the speaker fills in all required fields with valid data and clicks submit
- **THEN** the frontend sends the payload to the backend and the backend accepts it (200 response)

#### Scenario: Submission blocked when form is invalid
- **WHEN** the speaker attempts to submit with empty or invalid fields
- **THEN** the frontend blocks the submission and displays validation errors

### Requirement: Backend rejects invalid payloads with 400
The API SHALL validate all incoming submission payloads using class-validator and return 400 Bad Request for any invalid data.

#### Scenario: Missing required field
- **WHEN** a payload is sent with an empty or missing `name` field
- **THEN** the backend responds with 400 Bad Request

#### Scenario: Invalid email format
- **WHEN** a payload is sent with an invalid email format
- **THEN** the backend responds with 400 Bad Request

### Requirement: Frontend signal reflects initial state correctly
The Angular component SHALL initialize its signal state with empty strings for all fields and a `submissionStatus` of `idle`.

#### Scenario: Component mounts with initial signal state
- **WHEN** the submission component is first rendered
- **THEN** the signal `name` is `''`, `email` is `''`, `talkTitle` is `''`, and `submissionStatus` is `'idle'`

### Requirement: Frontend blocks submission when signal state is invalid
The Angular component SHALL prevent form submission when any required field is empty or the email format is invalid.

#### Scenario: Submit button disabled when name is empty
- **WHEN** the `name` signal is an empty string
- **THEN** the submit button is disabled and aria-disabled is set to true

#### Scenario: Submit button disabled when email is invalid
- **WHEN** the `email` signal does not match a valid email pattern
- **THEN** the submit button is disabled and aria-disabled is set to true