import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task manager app', () => {
  render(<App />);
  const headerElement = screen.getByText(/task manager/i);
  expect(headerElement).toBeInTheDocument();
});
