import React from 'react'
import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Garden from './Garden'
import { getGarden } from './gardenHelper'

jest.mock('./gardenHelper')
jest.mock('react-redux')
jest.mock('react-router-dom')
jest.mock('../../components/events/Events/Events', () => function Events () {
  return <div>Events</div>
})

describe('Garden with direct mock', () => {
  it('calls garden helper and displays garden data', () => {
    useSelector.mockReturnValue({
      garden: {
        name: 'test garden',
        description: 'an excellent test garden',
        url: 'cooltestgarden.com',
        events: [],
        address: 'cool place, nz',
        lat: 123,
        lon: -123
      },
      user: {
        id: 1
      }
    })
    useParams.mockReturnValue({ id: '23' })
    render(<Garden />)
    expect(getGarden.mock.calls[0][0]).toEqual('23')
    expect(getGarden.mock.calls[0][1]).toEqual({ id: 1 })
  })
})
