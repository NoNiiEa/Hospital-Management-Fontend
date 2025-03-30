<!-- @format -->

# Hospital Management System

## Overview

A comprehensive hospital management system built with Nuxt.js, Vue 3, and Tailwind CSS. This system provides an intuitive interface for managing patients, medical personnel, and staff in a healthcare setting.

## Features

### Patient Management

- View and search patient records
- Add new patients to the system
- View detailed patient information including medical history and appointments
- Schedule appointments for patients
- Update patient information

### Medical Personnel Management

- View and manage doctor profiles
- Schedule doctor appointments
- Track doctor specializations and availability
- Assign patients to doctors

### Staff Management

- Add and manage hospital staff
- Assign staff roles and shifts
- Track staff contact information

### Admin Dashboard

- Comprehensive dashboard for hospital administrators
- Monitor patient, doctor, and staff information
- Search functionality across all user types
- Pagination for efficient data viewing

## Technologies Used

- **Frontend Framework**: Nuxt.js 3, Vue 3 with Composition API
- **UI/Styling**: Tailwind CSS for responsive design
- **API Communication**: Custom useApi composable with caching capabilities
- **TypeScript**: Type-safe code implementation
- **Routing**: Vue Router for page navigation
- **State Management**: Vue 3 Reactive System

## Project Structure

```
front/
├── assets/            # Static assets and CSS files
├── components/        # Reusable Vue components
├── composables/       # Vue 3 composables (useApi, etc.)
├── pages/             # Application pages/routes
├── public/            # Public static files
├── server/            # Server-side code
└── services/          # Service layer for API communication
```

## Setup and Installation

1. Clone the repository
2. Navigate to the front directory
3. Install dependencies:
   ```
   npm install
   # or
   yarn install
   # or
   bun install
   ```
4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## API Integration

The application uses a custom `useApi` composable that provides:

- Centralized API request handling
- Request caching for improved performance
- Type-safe responses with TypeScript
- Error handling and loading state management

## Authentication

The system includes a login page for different user roles (Admin, Doctor, Staff) with appropriate access controls.

## Responsive Design

The UI is fully responsive and optimized for various screen sizes using Tailwind CSS, providing a seamless experience on both desktop and mobile devices.

## Localization

The system includes Thai language support for the hospital's local context, with easy extensibility for additional languages.
