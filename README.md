# 🌲 Woodland

**Woodland** is a custom-built internal management application for a small boutique hotel with 8 luxurious wooden cabins. This React + Vite + TypeScript SPA enables hotel staff to manage bookings, guests, cabins, and internal settings through a user-friendly interface.

> ⚠️ This is an internal app used only by hotel employees. Account creation is restricted to ensure access control.

---

## 📦 Tech Stack

- **Frontend**

  - [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [React Router](https://reactrouter.com/) – Routing
  - [styled-components](https://styled-components.com/) – Scoped CSS-in-JS
  - [React Hook Form](https://react-hook-form.com/) – Form management
  - [React Query](https://tanstack.com/query) – Remote state & caching
  - [React Icons](https://react-icons.github.io/react-icons/)
  - [React Hot Toast](https://react-hot-toast.com/) – Notifications
  - [Recharts](https://recharts.org/) – Charts & data viz
  - [date-fns](https://date-fns.org/) – Date utilities

- **State Management**

  - React Query for async data
  - Context API with `useState` for UI state

- **Backend**
  - [Supabase](https://supabase.io/) – Auth, DB, and storage

---

## 📋 Key Features

### 🔐 User Authentication & Management
![Login page](<img width="811" alt="Screenshot 2025-06-03 at 12 48 28" src="https://github.com/user-attachments/assets/85768331-93ae-4013-bd7a-3ee06697a56f" />
)
- Secure login system via Supabase
- Employees can upload avatars, and update their name and password
- Account creation only possible internally

### 🛏️ Cabins Management

- Table view of all cabins with:
  - Photo, name, capacity, price, discount
- Create, update, delete cabins with photo upload support

### 📆 Bookings Management

- View all bookings: arrival/departure dates, status, paid amount
- Booking status filters: `unconfirmed`, `checked in`, `checked out`
- Guests, nights, observations, and breakfast included
- Check in/out guests & confirm payment
- Add breakfast during check-in if not previously added

### 👤 Guest Management

- Guest data includes name, email, national ID, nationality, and flag
- Easy identification of guests

### 📊 Dashboard

- Daily check-in/out actions
- Key metrics: bookings, check-ins, revenue, occupancy
- Stay duration statistics
- Sales charts: total vs extras (breakfast)

### ⚙️ Settings

- Define app-wide settings:
  - Breakfast price
  - Min/max nights per booking
  - Max guests per booking
- Dark mode toggle

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/woodland.git
cd woodland

# Install dependencies
npm install

# Run the dev server
npm run dev
```
