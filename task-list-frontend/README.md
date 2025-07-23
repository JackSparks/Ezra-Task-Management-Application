# Task List Frontend

A React frontend application for the Task List API, providing a clean and intuitive interface for managing tasks.

## Features

- ✅ **View Tasks** - Display all tasks in organized sections (pending/completed)
- ✅ **Add New Tasks** - Create tasks with title and optional description
- ✅ **Toggle Completion** - Click checkbox or task name to mark complete/incomplete
- ✅ **Delete Tasks** - Remove unwanted tasks with confirmation
- ✅ **Real-time Updates** - Immediate UI updates after API calls
- ✅ **Error Handling** - User-friendly error messages with retry options
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Component-based Architecture** - Modular, reusable React components

## Technology Stack

- **React 18** - Frontend framework
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP client for backend communication

## Project Structure

```
src/
├── components/
│   ├── TaskForm.js          # Form for creating new tasks
│   ├── TaskForm.css         # TaskForm styles
│   ├── TaskItem.js          # Individual task display component
│   ├── TaskItem.css         # TaskItem styles
│   ├── TaskList.js          # List container for all tasks
│   └── TaskList.css         # TaskList styles
├── services/
│   └── taskService.js       # API service for backend communication
├── App.js                   # Main application component
├── App.css                  # Application-wide styles
└── index.js                 # Application entry point
```

## Backend Integration

This frontend connects to the .NET Core Task List API running on `http://localhost:5111`.

### API Endpoints Used:
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}/toggle` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete task

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Task List API backend running on `http://localhost:5111`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd task-list-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Component Details

### TaskForm Component
- **Purpose**: Create new tasks
- **Features**: Form validation, loading states, character limits
- **Props**: `onSubmit`, `loading`

### TaskItem Component  
- **Purpose**: Display individual tasks
- **Features**: Checkbox toggle, delete button, date formatting
- **Props**: `task`, `onToggle`, `onDelete`

### TaskList Component
- **Purpose**: Display and organize all tasks
- **Features**: Separate pending/completed sections, task statistics, empty states
- **Props**: `tasks`, `onToggle`, `onDelete`, `loading`

### TaskService
- **Purpose**: Handle all API communication
- **Methods**: `getAllTasks()`, `createTask()`, `toggleTask()`, `deleteTask()`

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (irreversible)

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
