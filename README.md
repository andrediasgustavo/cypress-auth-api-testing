```markdown
# Cypress API Testing

This project contains an automated API testing suite built with Cypress. It validates the endpoints of the Restful-Booker API, covering the complete lifecycle of a booking system including authentication, creation, retrieval, modification, and deletion.

## Test Coverage

The test suite is divided into specific files focusing on individual API endpoints:

* **Authentication (`auth.cy.js`)**: Validates the POST `/auth` endpoint. It tests token generation using valid credentials, and handles negative scenarios such as invalid usernames, invalid passwords, and empty payloads.
* **Create Booking (`create-booking.cy.js`)**: Validates the POST `/booking` endpoint. It checks for successful booking creation, and handles errors related to missing mandatory fields and incorrect `Content-Type` headers.
* **Get Booking (`get-booking.cy.js`)**: Validates the GET `/booking/:id` endpoint. It verifies successful data retrieval matching the creation payload, and tests error responses for non-existent IDs and invalid `Accept` headers.
* **Update Booking (`update-booking.cy.js`)**: Validates the PUT `/booking/:id` endpoint. It confirms data modification, verifies persistence through a subsequent GET request, and includes extensive security tests for missing or invalid authorization tokens.
* **Delete Booking (`delete-booking.cy.js`)**: Validates the DELETE `/booking/:id` endpoint. It ensures the booking is removed (verifying via a subsequent GET request returning 404), and checks security constraints regarding authorization tokens.

## Test Data Management

Test payloads are separated from the test logic using Cypress fixtures. The file `booking.json` acts as the central repository for request data, containing specific objects like `createPayload` and `updatePayload` to standardize the data sent during tests.

## Local Setup and Execution

1. Install the project dependencies:

```bash
   npm install
```

2. Create a `cypress.env.json` file in the root directory to store your environment variables locally. This file must contain the API credentials:


3. Execute the test suite:

```bash
    npx cypress run
```

## Continuous Integration (GitHub Actions)

The project includes automated CI/CD pipelines configured via GitHub Actions. Both pipelines run on `ubuntu-latest` environments and use Node.js version `22.14`.

* **Integration Pipeline**: Triggers automatically on every `push` and `pull_request` to the `main` branch to ensure code stability.


* **Scheduled Pipeline**: Runs a daily health check of the API at midnight UTC using a cron schedule (`0 0 * * *`).


**Required GitHub Secrets:**
To run the pipelines successfully, the following repository secrets must be configured to securely pass credentials to the Cypress runner:

* `CYPRESS_USERNAME`

* `CYPRESS_PASSWORD`
