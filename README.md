# Smart Cold-Chain Management System

This repository contains the source code for the **Smart Cold-Chain Management System**, a platform designed to monitor and manage health facilities, temperature-sensitive shipments, and IoT temperature data in real-time.

## Project Structure

The project is organized into three main directories:

- `/client`: The React frontend web application.
- `/server`: The Node.js backend API.
- `/simulator`: A placeholder for an IoT sensor data simulator.

---

## 1. Client (Frontend)

The frontend is a React application built with Vite. It has recently been refactored to use a modern, professional light SaaS dashboard design system.

### Tech Stack
- **Framework:** React
- **Build Tool:** Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** CSS Modules with a custom global design token system (CSS Variables).
- **Icons:** `lucide-react`

### UI Architecture (SaaS Dashboard)
The application uses a shell layout provided by the `<Layout>` component:
- **Sidebar (Fixed Left):** Contains the brand logo, main navigation links (with active state styling), and a system status badge.
- **Topbar (Sticky Top):** Features a global search input, a notification bell, and a user profile avatar.
- **Main Content Area:** A scrollable region where individual page components are rendered.

### Key Directories and Files (`/client/src`)

- **`index.css`**: Defines global design tokens (colors, shadows, typography, layout dimensions) for the light theme, along with base resets and scrollbar styling.
- **`App.jsx`**: The root component that sets up routing (`BrowserRouter`), global contexts (`ToastProvider`), and wraps all routes in the `<Layout>` component.
- **`/components`**:
  - `Layout/`: Contains the `Layout.jsx` and `Layout.module.css` that define the dashboard shell (sidebar + topbar).
  - `ClinicForm/`: Component for adding new health facilities.
  - `ClinicList/`: Component for displaying and removing registered clinics.
  - `Navbar/`: The legacy dark-themed top navigation bar (currently unused but preserved).
- **`/pages`**:
  - `DashboardPage.jsx`: The main overview landing page featuring KPI stat cards and a placeholder for temperature trends.
  - `ClinicsPage.jsx`: The facility management page containing the form and list components.
  - *Placeholders*: `ShipmentsPage` and `MonitorPage` are currently stubbed out in `App.jsx`.
- **`/context`**: Contains `ToastContext.jsx` for the global notification system.
- **`/hooks`**: Contains custom hooks like `useClinics.js` for data fetching and state management.
- **`/services`**: Contains `api.js` for backend communication (e.g., `checkHealth`, `getClinics`).

---

## 2. Server (Backend)

The backend is a Node.js application.

### Key Files (`/server`)
- **`server.js`**: The main entry point for the backend server.
- **`package.json` / `package-lock.json`**: Defines backend dependencies.
- **`/.env`**: Environment variables configuration.
- **`/config`**: Directory for configuration files.

---

## 3. Simulator

The `/simulator` directory is currently a placeholder (contains only a `.gitkeep` file). It is intended to house scripts or applications that simulate IoT devices (e.g., temperature sensors) sending telemetry data to the backend.

---

## Recent Updates

- **UI Overhaul**: Transitioned from a basic dark-themed top-nav layout to a full-featured light-themed SaaS dashboard.
- **Layout Component**: Introduced a new `<Layout>` component to handle the sidebar and topbar structure across all routes.
- **Design Tokens**: Centralized color, shadow, and radius definitions in `index.css` to ensure consistency across the light theme.
- **Component Refactoring**: Updated `DashboardPage`, `ClinicsPage`, `ClinicForm`, and `ClinicList` to utilize the new light theme design tokens, improving visual hierarchy with white cards and soft shadows on a light grayish-blue background (`#F5F7FA`).
