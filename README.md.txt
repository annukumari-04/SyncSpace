# SyncSpace

SyncSpace is a premium, modern Project and Task Management platform designed for teams. It features role-based access control, real-time analytics, and a dynamic theming engine, built on the robust MERN stack.

##  Features

###  Role-Based Access Control (RBAC)
- **Admin**: Full access to create projects, assign tasks, manage team members, and view comprehensive performance analytics across the entire workspace.
- **Member**: Streamlined view to track assigned tasks, update task statuses, and monitor specific project progress.

###  Interactive Dashboards
- **Admin Dashboard**: A bird's-eye view of all workspace activities. Features dynamic widgets for Total Tasks, Active Projects, and a Team Member Performance grid that calculates completion ratios in real-time.
- **Member Dashboard**: Focused view on personal task queue and immediate deliverables.

###  Premium UI/UX
- **Dynamic Theming**: Seamlessly switch between a sleek deep-contrast Dark Mode and a crisp, off-white Light Mode without page reloads.
- **Micro-animations**: Powered by Framer Motion, every interaction feels fluid and responsive.
- **Glassmorphism**: Modern, frosted-glass interface components.

###  Core Management
- **Projects**: Create and track overarching projects.
- **Tasks**: Granular task creation with priority levels (Low, Medium, High), statuses (Todo, In Progress, Completed), and direct member assignment.
- **Team Management**: Admins can invite and provision new accounts directly from the frontend interface.
- **Profile Management**: View account details and preview profile photo uploads.

##  Technology Stack

**Frontend**
- React (Vite)
- Tailwind CSS (Utility-first styling, Custom semantic design tokens)
- Framer Motion (Animations)
- React Router (Routing)
- Axios (API Client)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT Authentication)
- bcryptjs (Password hashing)

##  Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine.

### Installation

1. **Clone the repository**
2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   *The backend will run on `http://localhost:5001`*

2. **Start the Frontend Client**
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`*

##  Default Roles
When creating users, you can assign them one of two roles:
- `Admin`: Global management capabilities.
- `Member`: Restricted access for task execution.