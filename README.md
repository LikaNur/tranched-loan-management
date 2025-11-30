# Tranched Frontend Exercise

Welcome to the Tranched frontend exercise!

This exercise is designed to test your proficiency with a task that's relatively close to one you might encounter whilst working for Tranched.

## Objectives

You will create two data tables to display loans: one for inactive loans and one for active loans.

Each table should include the loan count fetched from the API and display a calculated value called `currentBalance` (which is `initialDebt - paid`).

Users should be able to select inactive loans from the inactive loans table and move them to the active loans table by pressing a button. You'll need to handle loading and error states as there is a 1/3 chance of the moveLoanToActive operation failing.

## Project Structure

This is a monorepo managed with Bun.
The frontend is located in the `frontend/` directory (i.e frontend) and the backend is in the `backend/` directory.

If you'd like to further your understanding of the backend logic, it can be found in `backend/router.ts`.

The backend client for the frontend can be found in `frontend/src/lib/core/client.ts`

## Setup Instructions

### Install Bun

First, you need to install Bun. Follow the instructions below:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installing Bun, verify the installation:

```bash
bun --version
```

### Install Dependencies

Navigate to the root directory of the project and run the following command to install all dependencies for both frontend and backend:

```bash
bun install
```

### Start the Project

To start both the backend and frontend, run the following command from the root directory:

```bash
bun run start
```

## Task Requirements

1. **Create Data Tables:**

   - **Inactive Loans Table:** Fetch and display inactive loans. Include a new column for `currentBalance` (calculated as `initialDebt - paid`).
   - **Active Loans Table:** Fetch and display active loans. Include a new column for `currentBalance`.

2. **Table Headers:**

   - The title of each table should include the loan count fetched from the API by using `getActiveLoanCount` & `getInactiveLoanCount`

3. **Move Loans to Active:**

   - Users should be able to select one or more loans from the inactive loans table and press a button to move them to the active loans table.
   - Handle the 1/3 chance of the `moveLoanToActive` mutation failing, including displaying appropriate loading and error states.

4. **Leverage Sveltekit and tRPC Client:**
   - Utilize the existing setup with Sveltekit, tRPC client to interact with the backend API.

## Evaluation Criteria

- Correct implementation of data fetching and mutation using the Sveltekit framework.
- Proper handling of loading and error states down to a row level.
- Code quality and adherence to best practices.
- Semantic HTML with accessible elements.

## Getting Help

If you have any questions or need further clarification, please don't hesitate to reach out.

Good luck, and happy coding!
