# Task Management Application

A full-stack task management application built with .NET 8 backend API and React frontend, featuring a clean, modern interface for managing daily tasks.

## 🌟 Features

### Backend (.NET Core API)
- ✅ **RESTful API** - Clean REST endpoints following best practices
- ✅ **Entity Framework Core** - SQLite database with automatic migrations
- ✅ **Swagger Documentation** - Interactive API documentation
- ✅ **CORS Support** - Configured for React frontend integration
- ✅ **Clean Architecture** - Separation of concerns with services, DTOs, and endpoints
- ✅ **Minimal APIs** - Modern .NET endpoint pattern

### Frontend (React)
- ✅ **Component-based Design** - Modular, reusable React components
- ✅ **Real-time Updates** - Immediate UI feedback after API operations
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Error Handling** - User-friendly error messages with retry options
- ✅ **Modern UI/UX** - Clean, intuitive interface with animations

### User Functionality
- ✅ **View Tasks** - Display all tasks organized by completion status
- ✅ **Add New Tasks** - Create tasks with title and optional description
- ✅ **Toggle Completion** - Mark tasks as complete/incomplete via checkbox or click
- ✅ **Delete Tasks** - Remove unwanted tasks with confirmation
- ✅ **Task Statistics** - View counts of total, pending, and completed tasks

## 🏗️ Architecture

```
Task Management App/
├── TaskListApp/                 # .NET Core Backend
│   ├── Data/
│   │   └── TaskDbContext.cs     # EF Core DbContext
│   ├── DTOs/
│   │   └── TaskDtos.cs          # Data transfer objects
│   ├── Endpoints/
│   │   └── TaskEndpoints.cs     # Minimal API endpoints
│   ├── Models/
│   │   └── TaskItem.cs          # Domain model
│   ├── Services/
│   │   ├── ITaskService.cs      # Service interface
│   │   └── TaskService.cs       # Service implementation
│   └── Program.cs               # Application entry point
│
└── task-list-frontend/          # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── TaskForm.js       # Create task form
    │   │   ├── TaskItem.js       # Individual task component
    │   │   └── TaskList.js       # Task list container
    │   ├── services/
    │   │   └── taskService.js    # API communication service
    │   └── App.js               # Main application component
    └── public/
```

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js (version 14+)
- Visual Studio Code or Visual Studio

### Backend Setup (ASP.NET Core API)

1. **Navigate to backend directory:**
   ```bash
   cd TaskListApp
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore --source https://api.nuget.org/v3/index.json
   ```

3. **Build the project:**
   ```bash
   dotnet build
   ```

4. **Run the API:**
   ```bash
   dotnet run --project "d:\Documents\Job_Search\2025\Interviews\Ezra\TaskListApp\TaskListApp.csproj"
   ```

5. **Access Swagger documentation:**
   - API: `http://localhost:5111`
   - Swagger UI: `http://localhost:5111` (set as default route)

### Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd task-list-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Frontend: `http://localhost:3000`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get specific task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}/toggle` | Toggle task completion |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/health` | Health check |

### Example API Usage

```javascript
// Get all tasks
GET http://localhost:5111/api/tasks

// Create new task
POST http://localhost:5111/api/tasks
Content-Type: application/json
{
  "title": "New Task",
  "description": "Task description"
}

// Toggle task completion
PUT http://localhost:5111/api/tasks/1/toggle
```

## 💾 Database

- **Technology:** SQLite with Entity Framework Core
- **File:** `tasks.db` (auto-created in project root)
- **Schema:** Automatic migration on startup
- **Seed Data:** Two sample tasks for testing

### Task Model
```csharp
public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
```

## 🎨 Frontend Components

### TaskForm Component
- **Purpose:** Create new tasks
- **Features:** Form validation, loading states, character limits
- **Location:** `src/components/TaskForm.js`

### TaskItem Component
- **Purpose:** Display individual tasks
- **Features:** Checkbox toggle, delete button, date formatting
- **Location:** `src/components/TaskItem.js`

### TaskList Component
- **Purpose:** Display and organize all tasks
- **Features:** Separate sections for pending/completed, statistics
- **Location:** `src/components/TaskList.js`

## 🌐 Integration

The frontend and backend are integrated via:
- **CORS Policy:** Allows requests from `http://localhost:3000`
- **REST API:** Frontend uses Fetch API to communicate with backend
- **Error Handling:** Comprehensive error handling on both ends
- **Real-time Updates:** UI updates immediately after successful API calls

## 🛠️ Technologies Used

### Backend
- **.NET 8** - Framework
- **ASP.NET Core** - Web framework
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **Swashbuckle** - Swagger/OpenAPI documentation
- **Minimal APIs** - Endpoint pattern

### Frontend
- **React 18** - Frontend framework
- **JavaScript ES6+** - Programming language
- **CSS3** - Styling with Flexbox/Grid
- **Fetch API** - HTTP client

## 🚦 Running Both Applications

1. **Start the backend API:**
   ```bash
   # Terminal 1
   cd TaskListApp
   dotnet run --project TaskListApp.csproj
   ```

2. **Start the React frontend:**
   ```bash
   # Terminal 2
   cd task-list-frontend
   npm start
   ```

3. **Access the applications:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5111`
   - Swagger Docs: `http://localhost:5111`

## 📱 Features Demo

1. **Add Tasks:** Use the form at the top to create new tasks
2. **Toggle Completion:** Click the checkbox or task name to mark complete
3. **View Statistics:** See task counts at the top of the list
4. **Delete Tasks:** Click the red X button to remove tasks
5. **Responsive Design:** Resize browser window to see mobile layout

## 🔧 Development Notes

- Backend runs on port 5111
- Frontend runs on port 3000
- CORS is configured to allow frontend-backend communication
- Database persists data between application restarts
- Swagger UI provides interactive API testing
- React app includes hot reloading for development

## 🏁 Next Steps

This foundation is ready for additional features like:
- Task editing
- Categories/tags
- Due dates
- Search functionality
- User authentication
- Real-time updates with SignalR
