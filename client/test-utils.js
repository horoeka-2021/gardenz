import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'

import reducer from './reducers'

export function renderWithRouter (
  ui,
  {
    initialEntries = ['/'],
    route = '/'
  } = {}
) {
  return {
    ...render(
      <Router initialEntries={initialEntries} initialIndex={0}>
        <Routes>
          <Route path={route} element={ui} / >
        </Routes>
      </Router>
    )
  }
}

export function renderWithRedux (
  ui,
  {
    initialEntries = ['/'],
    route = '/',
    initialState,
    store = createStore(reducer, initialState)
  } = {}
) {
  return {
    ...render(
      <Provider store={store}>
        <Router initialEntries={initialEntries} initialIndex={0}>
          <Routes>
            <Route path={route} element={ui} />
          </Routes>
        </Router>
      </Provider>
    ),
    store
  }
}
