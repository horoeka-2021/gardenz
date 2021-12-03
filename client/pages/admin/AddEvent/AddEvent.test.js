import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'

import { renderWithRouter } from '../../../test-utils'

import AddEvent from './AddEvent'
import { addEvent } from './addEventHelper'

jest.mock('./addEventHelper')

describe('form', () => {
  it('is empty', () => {
    renderWithRouter(<AddEvent />)
    const titleInput = screen.getByRole('textbox', { name: 'Event Title' })
    expect(titleInput).toHaveValue('')
  })
})

describe('submit button', () => {
  it('has "Create Event" name from props', () => {
    renderWithRouter(<AddEvent />)
    const addButton = screen.getByRole('button')
    expect(addButton).toHaveTextContent('Submit')
  })

  it('calls addEvent helper with event data on click', async () => {
    addEvent.mockImplementation((event, navigateTo) => {
      expect(event.title).toBe('test title')
      expect(typeof navigateTo).toBe('function')
    })

    renderWithRouter(<AddEvent />)

    const titleInput = screen.getByRole('textbox', { name: 'Event Title' })
    const dateInput = screen.getByRole('date')
    const volunteersNeededInput = screen.getByRole('spinbutton', { name: 'Volunteers Needed' })
    const descriptionInput = screen.getByRole('textbox', { name: 'Description' })
    const addButton = screen.getByRole('button')

    userEvent.type(titleInput, 'test title')
    userEvent.type(dateInput, '2021-07-28')
    userEvent.type(volunteersNeededInput, '2')
    userEvent.type(descriptionInput, 'description')
    userEvent.click(addButton)
    // })

    await waitFor(() => {
      expect(addEvent).toHaveBeenCalled()
    })
  })
})
