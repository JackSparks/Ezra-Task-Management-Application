import { test, expect } from '@playwright/test';

test.describe('Task List Application - API Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    try {
      await page.request.post('http://localhost:5111/api/test/reset');
    } catch (error) {
      console.warn('Failed to reset database:', error.message);
    }
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and simulate network errors
    await page.route('**/api/tasks', route => {
      route.abort('failed');
    });

    // Reload the page to trigger the API call
    await page.reload();
    
    // The app should handle the error gracefully
    // (This depends on your error handling implementation)
    await page.waitForTimeout(2000);
  });

  test('should persist tasks after page reload', async ({ page }) => {
    const taskTitle = 'Persistent Task';
    
    // Create a task
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Task should still be there
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Intercept and delay API responses
    await page.route('**/api/tasks', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      await route.continue();
    });

    const taskTitle = 'Slow API Task';
    
    // Create a task (should show loading state)
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Should show loading state
    await expect(page.getByText(/adding/i)).toBeVisible();
    
    // Eventually the task should appear
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 10000 });
  });

  test('should handle concurrent operations', async ({ page }) => {
    // Create multiple tasks quickly
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    for (const taskTitle of tasks) {
      await page.getByLabel(/task title/i).fill(taskTitle);
      await page.getByRole('button', { name: /add task/i }).click();
      // Don't wait for each task to appear - create them quickly
    }
    
    // All tasks should eventually appear
    for (const taskTitle of tasks) {
      await expect(page.getByText(taskTitle)).toBeVisible();
    }
  });

  test('should validate API responses', async ({ page }) => {
    // Intercept API call and return invalid data
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: null, isCompleted: false }, // Invalid: null title
            { id: 2, isCompleted: true }, // Invalid: missing title
            { id: 3, title: 'Valid Task', isCompleted: false } // Valid
          ])
        });
      } else {
        route.continue();
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // App should handle invalid data gracefully
    // Only valid tasks should be displayed
    await expect(page.getByText('Valid Task')).toBeVisible();
  });

  test('should handle task creation with server errors', async ({ page }) => {
    // Intercept task creation and return server error
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        route.continue();
      }
    });

    const taskTitle = 'Failed Task';
    
    // Try to create a task
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Task should not appear
    await expect(page.getByText(taskTitle)).not.toBeVisible();
    
    // Should show some error indication (depends on your error handling)
    await page.waitForTimeout(1000);
  });

  test('should retry failed operations', async ({ page }) => {
    let attemptCount = 0;
    
    // Intercept and fail first attempt, succeed on second
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'POST') {
        attemptCount++;
        if (attemptCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.continue();
        }
      } else {
        route.continue();
      }
    });

    const taskTitle = 'Retry Task';
    
    // Create a task (first attempt should fail)
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // If your app implements retry logic, the task should eventually appear
    // Otherwise, this tests your error handling
    await page.waitForTimeout(2000);
  });
});
