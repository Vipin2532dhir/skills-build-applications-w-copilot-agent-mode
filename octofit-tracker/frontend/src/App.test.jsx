import { createRoot } from 'react-dom/client'
import { act } from 'react'
import App from './App'

describe('App', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  it('renders the landing page and counter button', () => {
    act(() => {
      createRoot(container).render(<App />)
    })

    expect(container.querySelector('h1')?.textContent).toBe('Get started')
    expect(container.querySelector('button')?.textContent).toBe('Count is 0')
  })

  it('increments the counter when the button is clicked', () => {
    act(() => {
      createRoot(container).render(<App />)
    })

    const button = container.querySelector('button')
    expect(button).not.toBeNull()

    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(button?.textContent).toBe('Count is 1')
  })
})
