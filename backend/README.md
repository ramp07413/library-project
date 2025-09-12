# Library Management System Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Create Super Admin**
   ```bash
   npm run create-admin
   ```
   Default credentials: admin@library.com / admin123

5. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Authentication & Authorization

### User Roles
- **Student**: Can view their own data only
- **Admin**: Can manage library operations based on permissions
- **Super Admin**: Full access to all features

### Permissions System
Each admin can have granular permissions for:
- Students (create, read, update, delete)
- Payments (create, read, update, delete)
- Expenses (create, read, update, delete)
- Seats (create, read, update, delete)
- Alerts (create, read, update, delete)
- Dashboard (read)
- Admin Management (create, read, update, delete)

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### User Routes (Students)
- `GET /api/user/dashboard` - Student dashboard
- `GET /api/user/details` - Student details
- `GET /api/user/payments` - Payment history
- `GET /api/user/due-payments` - Due payments
- `GET /api/user/alerts` - Student alerts
- `GET /api/user/seat` - Seat information

### Admin Management
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/stats` - User statistics
- `POST /api/admin/users` - Create admin user
- `PUT /api/admin/users/:id/permissions` - Update permissions
- `PUT /api/admin/users/:id/status` - Activate/Deactivate user
- `DELETE /api/admin/users/:id` - Delete user (Super Admin only)

### Protected Routes (Require Authentication & Permissions)
All existing routes now require authentication and appropriate permissions.

## Authentication Headers
Include JWT token in requests:
```
Authorization: Bearer <your_jwt_token>
```

## Default Permissions

### Student Role
- Can read their own student data
- Can read their own payments
- Can read their own alerts
- Can read their seat information
- Cannot access admin features

### Admin Role
- Permissions set by Super Admin
- Can be granted specific module access

### Super Admin Role
- Full access to all features
- Can create/manage other admins
- Can set permissions for other users

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Granular permissions system
- Protected routes
- Input validation
- Error handling

## Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@library.com", "password": "admin123"}'
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <your_jwt_token>"
```
