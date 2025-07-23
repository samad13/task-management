// src/components/__tests__/DarkModeToggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { DarkModeToggle } from '../DarkModeToggle'
import { expect, test } from 'vitest'

test('toggles dark mode', () => {
  render(<DarkModeToggle />)
  const button = screen.getByText(/Mode/i)
  fireEvent.click(button)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})
