import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import EventItem from './EventItem'

function Events ({ events, isAdmin }) {
  return (
    <>
      {
        isAdmin
          ? <Link to='/events/new' className="button my-4 is-pulled-right">Add New Event</Link>
          : null
      }
      <h2 className="">Events</h2>
      <div className="box clearfix">
        {events.map((event) =>
          <EventItem key={event.id} event={event} isAdmin={isAdmin} />
        )}
      </div>
    </>
  )
}

function mapStateToProps (state) {
  return {
    isAdmin: state.user.isAdmin
  }
}

export default connect(mapStateToProps)(Events)
