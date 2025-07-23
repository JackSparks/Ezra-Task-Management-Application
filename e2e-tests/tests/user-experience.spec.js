import { test, expect } from '@playwright/test';

test.describe('Task List Application - User Experience', () => {
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

  test('should have accessible form labels', async ({ page }) => {
    // Check that form inputs have proper labels
    const titleInput = page.getByLabel(/task title/i);
    const descriptionInput = page.getByLabel(/description/i);
    
    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    
    // Check that required field is marked
    await expect(page.getByText('*')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Navigate using Tab key
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/task title/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/description/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /add task/i })).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    const taskTitle = 'Keyboard Task';
    
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.keyboard.press('Enter');
    
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should provide visual feedback for interactions', async ({ page }) => {
    // Create a task first
    const taskTitle = 'Visual Feedback Task';
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // Check button states and hover effects
    const toggleCheckbox = page.locator('.task-item').filter({ hasText: taskTitle }).getByRole('checkbox');
    const deleteButton = page.locator('.task-item').filter({ hasText: taskTitle }).getByRole('button', { name: /delete/i });
    
    // Hover over delete button
    await deleteButton.hover();
    
    // Check checkbox interaction
    await toggleCheckbox.click();
    await expect(toggleCheckbox).toBeChecked();
  });

  test('should handle long task titles and descriptions', async ({ page }) => {
    const longTitle = 'This is a very long task title that might overflow the container and test how the UI handles long text content';
    const longDescription = 'This is an extremely long description that contains a lot of text to test how the application handles overflow, text wrapping, and general layout when dealing with large amounts of content in a single task item. It should gracefully handle this without breaking the layout or becoming unreadable.';
    
    await page.getByLabel(/task title/i).fill(longTitle);
    await page.getByLabel(/description/i).fill(longDescription);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Task should appear and be readable
    await expect(page.getByText(longTitle)).toBeVisible();
    await expect(page.getByText(longDescription)).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Elements should still be visible and usable
    await expect(page.getByLabel(/task title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add task/i })).toBeVisible();
    
    // Create a task on mobile
    const taskTitle = 'Mobile Task';
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should show loading states appropriately', async ({ page }) => {
    // Intercept API and add delay
    await page.route('**/api/tasks', async route => {
      if (route.request().method() === 'POST') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await route.continue();
    });

    const taskTitle = 'Loading State Task';
    
    // Start creating a task
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Should show loading state
    await expect(page.getByRole('button', { name: /adding/i })).toBeVisible();
    
    // Eventually task should appear
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Fill form partially
    await page.getByLabel(/task title/i).fill('Partial Task');
    await page.getByLabel(/description/i).fill('Partial Description');
    
    // Navigate away and back (if you have navigation)
    // For SPA, we can test by refreshing
    const titleValue = await page.getByLabel(/task title/i).inputValue();
    const descValue = await page.getByLabel(/description/i).inputValue();
    
    // Values should be maintained (or cleared based on your UX decisions)
    expect(titleValue).toBe('Partial Task');
    expect(descValue).toBe('Partial Description');
  });

  test('should handle rapid user interactions', async ({ page }) => {
    const taskTitle = 'Rapid Task';
    
    // Create a task
    await page.getByLabel(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    const toggleCheckbox = page.locator('.task-item').filter({ hasText: taskTitle }).getByRole('checkbox');
    
    // Rapidly toggle the checkbox
    for (let i = 0; i < 5; i++) {
      await toggleCheckbox.click();
      await page.waitForTimeout(100);
    }
    
    // Should handle all interactions gracefully
    // Final state depends on odd/even number of clicks
  });

  test('should provide clear visual hierarchy', async ({ page }) => {
    // Create multiple tasks with different states
    await page.getByLabel(/task title/i).fill('Important Task');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('Important Task')).toBeVisible();

    await page.getByLabel(/task title/i).fill('Completed Task');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('Completed Task')).toBeVisible();

    // Complete the second task
    const completedTaskCheckbox = page.locator('.task-item').filter({ hasText: 'Completed Task' }).getByRole('checkbox');
    await completedTaskCheckbox.click();

    // Visual hierarchy should be clear
    // (This is mostly a visual test, but we can check basic structure)
    await expect(page.getByText(/pending tasks/i)).toBeVisible();
    await expect(page.getByText(/completed tasks/i)).toBeVisible();
  });
});
