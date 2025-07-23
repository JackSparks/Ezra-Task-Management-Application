# Task List API Documentation

A RESTful API for managing tasks, built with ASP.NET Core (.NET 8) and Entity Framework Core (SQLite).

---

## Base URL

    http://localhost:5111

---

## Endpoints

### 1. Get All Tasks
- **Method:** GET
- **Route:** `/api/tasks`
- **Description:** Returns a list of all tasks ordered by creation date (newest first).
- **Response Example:**
```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "This is a sample task",
    "isCompleted": false,
    "createdAt": "2025-07-22T16:41:09.1969676Z",
    "completedAt": null
  }
]
```

---

### 2. Get Task by ID
- **Method:** GET
- **Route:** `/api/tasks/{id}`
- **Description:** Returns a specific task by its ID.
- **Response Example:**
```json
{
  "id": 1,
  "title": "Sample Task",
  "description": "This is a sample task",
  "isCompleted": false,
  "createdAt": "2025-07-22T16:41:09.1969676Z",
  "completedAt": null
}
```

---

### 3. Create New Task
- **Method:** POST
- **Route:** `/api/tasks`
- **Description:** Creates a new task.
- **Request Body:**
```json
{
  "title": "New Task",
  "description": "Optional description"
}
```
- **Response Example:**
```json
{
  "id": 2,
  "title": "New Task",
  "description": "Optional description",
  "isCompleted": false,
  "createdAt": "2025-07-22T17:00:00.0000000Z",
  "completedAt": null
}
```

---

### 4. Toggle Task Completion
- **Method:** PUT
- **Route:** `/api/tasks/{id}/toggle`
- **Description:** Toggles the completion status of a task (complete/incomplete).
- **Response Example:**
```json
{
  "id": 1,
  "title": "Sample Task",
  "description": "This is a sample task",
  "isCompleted": true,
  "createdAt": "2025-07-22T16:41:09.1969676Z",
  "completedAt": "2025-07-22T18:00:00.0000000Z"
}
```

---

### 5. Delete Task
- **Method:** DELETE
- **Route:** `/api/tasks/{id}`
- **Description:** Permanently deletes a task by its ID.
- **Response:**
  - `204 No Content` on success

---

### 6. Health Check
- **Method:** GET
- **Route:** `/health`
- **Description:** Returns API health status.
- **Response Example:**
```json
{
  "status": "Healthy"
}
```

---

## Error Responses
- **404 Not Found:** Task not found
- **400 Bad Request:** Invalid input data
- **500 Internal Server Error:** Unexpected server error

---

## Data Model

### TaskItem
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

---

## Usage Notes
- All endpoints return JSON.
- CORS is enabled for `http://localhost:3000` (React frontend).
- Swagger UI is available at the base URL for interactive API testing.
- Database is persisted in `tasks.db` (SQLite).

---

## Example Workflow
1. **Create a task** via POST `/api/tasks`
2. **View all tasks** via GET `/api/tasks`
3. **Toggle completion** via PUT `/api/tasks/{id}/toggle`
4. **Delete a task** via DELETE `/api/tasks/{id}`

---

## See Also
- [Frontend README](../task-list-frontend/README.md)
- [Swagger UI](http://localhost:5111)
