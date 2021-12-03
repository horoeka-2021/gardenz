import React from 'react'
import { screen } from '@testing-library/react'

import { renderWithRedux } from '../../test-utils'

import EmailVolunteerError from './EmailVolunteerError'
import { getEventDetails, checkUserIdsMatch } from './emailVolunteerErrorHelper'
import { getIsAuthenticated, getLogoutFn } from '../../auth-utils'
import { toggleVolunteerStatus } from '../../components/volunteers/VolunteerButton/volunteerButtonHelper'
import { dispatch } from '../../store'
import { CLEAR_USER } from '../../actions/user'

/*
Mocks all the tests using jest.mock
*/

jest.mock('./emailVolunteerErrorHelper')
jest.mock('../../auth-utils')
jest.mock('../../components/volunteers/VolunteerButton/volunteerButtonHelper')
jest.mock('../../store')

afterAll(() => {
  jest.resetAllMocks()
})

const mockPush = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockPush
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: 1 })
}))

describe('EmailVolunteerError', () => {
  it('should display correct event name', () => {
    /*
      Mocks the api calls and return event details
    */
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy1', gardenName: 'dummy' })
    )
    renderWithRedux(<EmailVolunteerError />)
    return screen.findByRole('event-details').then(() => {
      const title = screen.getByRole('event-details')
      expect(title.textContent).toMatch('dummy1')
      return null
    })
  })

  it('should ask user to sign in if not authenticated', () => {
    /*
      Mocks the api calls and return event details
      Mocks the authentication and set user as authenticated
    */
    getIsAuthenticated.mockImplementation(() => false)
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy', gardenName: 'dummy' })
    )
    renderWithRedux(<EmailVolunteerError />)

    return screen.findByRole('message').then(() => {
      const url = screen.getByRole('link', { name: 'Sign in' })
      expect(getEventDetails).toHaveBeenCalled()
      expect(url).toBeInTheDocument()
      expect(url.href).toMatch('/signin')
      return null
    })
  })

  it('should display volunteer button if user is authenticated', () => {
    getIsAuthenticated.mockImplementation(() => true)
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy', gardenName: 'dummy' })
    )
    renderWithRedux(<EmailVolunteerError />)

    return screen.findByRole('button', { name: 'Volunteer' }).then(() => {
      const button = screen.getByRole('button', { name: 'Volunteer' })
      expect(getEventDetails).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
      expect(button.textContent).toMatch('Volunteer')
      return null
    })
  })

  it('should redirect to event page when volunteer btn is clicked', () => {
    getIsAuthenticated.mockImplementation(() => true)
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy', gardenName: 'dummy' })
    )
    // Mocking the toggleVounteerStatus method
    toggleVolunteerStatus.mockImplementation((first, second, third) => third())
    renderWithRedux(<EmailVolunteerError />)

    return screen.findByRole('button', { name: 'Volunteer' }).then(() => {
      const button = screen.getByRole('button', { name: 'Volunteer' })
      expect(getEventDetails).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
      button.click()
      expect(mockPush).toHaveBeenCalled()
      expect(toggleVolunteerStatus.mock.calls[0]).toContain(1)
      expect(toggleVolunteerStatus.mock.calls[0]).toContain(true)
      return null
    })
  })

  it('should display logout button if not same user', () => {
    getIsAuthenticated.mockImplementation(() => true)
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy', gardenName: 'dummy' })
    )
    checkUserIdsMatch.mockImplementation(() => false)
    renderWithRedux(<EmailVolunteerError />)

    return screen.findByRole('alert-msg').then(() => {
      const alert = screen.getByRole('alert-msg')
      expect(getEventDetails).toHaveBeenCalled()
      expect(alert).toBeInTheDocument()
      expect(alert.textContent).toMatch('NOTE: You are currently logged in as:')
      return null
    })
  })

  it('should logout and redirect the user to sigin page', () => {
    getIsAuthenticated.mockImplementation(() => true)
    getEventDetails.mockImplementation(() =>
      Promise.resolve({ title: 'dummy', gardenName: 'dummy' })
    )
    checkUserIdsMatch.mockImplementation(() => false)
    const mockLogoutFn = jest.fn()
    getLogoutFn.mockImplementation(() => mockLogoutFn)

    renderWithRedux(<EmailVolunteerError />)

    return screen.findByRole('button', { name: 'Click here' }).then(() => {
      const button = screen.getByRole('button', { name: 'Click here' })
      expect(getEventDetails).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
      button.click()
      expect(mockLogoutFn).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_USER })
      expect(mockPush).toHaveBeenCalledWith('/signin')
      return null
    })
  })
})
