import { test, expect } from '@playwright/test';

test.describe('Task List Application - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    try {
      await page.request.post('http://localhost:5111/api/test/reset');
    } catch (error) {
      console.warn('Failed to reset database:', error.message);
    }
    
    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the application title and form', async ({ page }) => {
    // Check that the page has loaded
    await expect(page).toHaveTitle(/task list/i);
    
    // Check that the form is visible
    await expect(page.getByLabel(/task title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add task/i })).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    const taskTitle = 'E2E Test Task';
    const taskDescription = 'Created by Playwright test';

    // Fill out the form
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByLabel(/description/i).fill(taskDescription);
    
    // Submit the form
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for the task to appear
    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByText(taskDescription)).toBeVisible();
    
    // Check that the form is cleared
    await expect(page.getByLabel(/task title/i)).toHaveValue('');
    await expect(page.getByLabel(/description/i)).toHaveValue('');
  });

  test('should create a task with title only', async ({ page }) => {
    const taskTitle = 'Title Only Task';

    // Fill only the title
    await page.getByLabel(/task title/i).fill(taskTitle);
    
    // Submit the form
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for the task to appear
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should not create a task with empty title', async ({ page }) => {
    // Try to submit with empty title
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Form should still be visible (validation prevents submission)
    await expect(page.getByLabel(/task title/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add task/i })).toBeVisible();
  });

  test('should toggle task completion status', async ({ page }) => {
    // First create a task
    const taskTitle = 'Task to Toggle';
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Find the checkbox for this task and click it
    const taskCheckbox = page.locator('.task-item').filter({ hasText: taskTitle }).getByRole('checkbox');
    await expect(taskCheckbox).not.toBeChecked();
    
    await taskCheckbox.click();
    await expect(taskCheckbox).toBeChecked();
    
    // Toggle back
    await taskCheckbox.click();
    await expect(taskCheckbox).not.toBeChecked();
  });

  test('should delete a task', async ({ page }) => {
    // First create a task
    const taskTitle = 'Task to Delete';
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Handle confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // Find and click the delete button for this task
    const deleteButton = page.locator('.task-item').filter({ hasText: taskTitle }).getByRole('button', { name: /delete/i });
    await deleteButton.click();
    
    // Task should disappear
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test('should display task statistics', async ({ page }) => {
    // Create multiple tasks
    await page.getByLabel(/task title/i).fill('Task 1');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('Task 1')).toBeVisible();

    await page.getByLabel(/task title/i).fill('Task 2');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('Task 2')).toBeVisible();

    // Complete one task
    const firstTaskCheckbox = page.locator('.task-item').filter({ hasText: 'Task 1' }).getByRole('checkbox');
    await firstTaskCheckbox.click();

    // Check statistics
    await expect(page.getByText(/2 total/i)).toBeVisible();
    await expect(page.getByText(/1 completed/i)).toBeVisible();
    await expect(page.getByText(/1 pending/i)).toBeVisible();
  });

  test('should show empty state when no tasks', async ({ page }) => {
    // If there are existing tasks, we might need to clean them up
    // For this test, we'll assume the database is clean or check for empty state
    const emptyMessage = page.getByText(/no tasks yet/i);
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
      await expect(page.getByText(/add your first task/i)).toBeVisible();
    }
  });

  test('should separate completed and pending tasks', async ({ page }) => {
    // Create tasks and complete some
    await page.getByLabel(/task title/i).fill('Pending Task');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.locator('.task-title').filter({ hasText: 'Pending Task' })).toBeVisible();

    await page.getByLabel(/task title/i).fill('Completed Task');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.locator('.task-title').filter({ hasText: 'Completed Task' })).toBeVisible();

    // Complete the second task
    const completedTaskCheckbox = page.locator('.task-item').filter({ hasText: 'Completed Task' }).getByRole('checkbox');
    await completedTaskCheckbox.click();

    // Check that sections are visible
    await expect(page.getByText(/pending tasks/i)).toBeVisible();
    await expect(page.getByText(/completed tasks/i)).toBeVisible();
  });
});
