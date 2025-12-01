## 💼 Tranched Loan Management System

> A modern web application for loan management built with Svelte 5 and tRPC

![Demo](./frontend/src/lib/assets/demo-tranched.gif)

### Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Implemented Features](#implemented-features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Implementation Highlights](#implementation-highlights)
- [Future Improvements](#future-improvements)

### Project Description

Loan Management System is a full-featured application for managing loans that allows you to:

- View active and inactive loans in separate tables
- Select and move loans between categories
- Track the balance of each loan in real-time
- Handle errors with retry functionality
- Enjoy a modern and responsive interface

### Tech Stack

### Frontend
- **Svelte 5** (Runes API) — modern reactive framework
- **SvelteKit** — full-featured framework for Svelte
- **TypeScript** — typed JavaScript
- **TailwindCSS 4** — utility-first CSS framework
- **tRPC Client** — type-safe API client
- **Bun** — fast JavaScript runtime and package manager

### Backend
- **tRPC** — type-safe RPC framework
- **Zod** — schema validation
- **Node.js/Bun** — server runtime environment

### Implemented Features

- ✅ **Two Data Tables**
  - Inactive loans table with selection capability
  - Active loans table (read-only)
  - Display of `currentBalance` (calculated: `initialDebt - paid`)

- ✅ **Table Headers with Counts**
  - Dynamic display of loan counts from API
  - Using `getActiveLoanCount` and `getInactiveLoanCount`

- ✅ **Move Loans**
  - Multiple selection via checkboxes
  - "Move to Active" button to move selected loans
  - Error handling with 1/3 probability

- ✅ **Loading and Error States**
  - Row-level loading states (loading indicator for each loan)
  - Row-level error states (error display with Retry button)
  - Global loading and error states

- ✅ **Semantic HTML and Accessibility (a11y)**
  - Semantic HTML elements (`<table>`, `<section>`, `<nav>`)
  - ARIA attributes (`aria-label`, `aria-live`, `role`, `aria-describedby`)
  - Keyboard navigation (Enter/Space for row selection)
  - Focus management for improved accessibility

### Additional Features (Over-delivery)

- **Enhanced Interactivity**
  - Click on row to select loan (not just checkbox)
  - Dynamic "Move to Active" button with selected count
  - Visual indication of selected items
  - Button disabled when no selection

- **Performance Optimization**
  - Parallel data loading via `Promise.all`
  - Race condition protection (`isMoving` flag)
  - Efficient state management with Svelte 5 Runes

- **Enhanced Error Handling**
  - Centralized error message extraction function
  - Different error formats (tRPC, standard Error)
  - Retry mechanism for failed operations
  - User-friendly error messages

### Prerequisites

- [Bun](https://bun.sh/) version 1.1.8 or higher

### Install Dependencies

```bash

bun install
```

### Run the Project

```bash

bun run start
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Run Separately

```bash

cd backend
bun run start

cd frontend
bun run dev
```

### Future Improvements

If there was more time, I would add the following improvements:

### Testing
- **Unit tests** for utilities (`calculateBalance`, `extractErrorMessage`)
- **Component tests** for `LoanTable`, `Navbar` and other components
- **Integration tests** for complete user scenarios
- **E2E tests** with Playwright or Cypress

### Functionality
- **Select All / Deselect All** — button for bulk selection
- **Search and Filter** — search by ID, filter by balance
- **Sorting** — sort by columns (ID, balance, date)
- **Pagination** — page splitting for large lists
- **Local Caching** — save state in localStorage
- **Notifications** — toast notifications for successful operations
