import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { updateEvent, cancelEvent } from './editEventHelper'

import EventForm from '../../../components/events/EventForm/EventForm'
import { useSelector } from 'react-redux'
import { getEvent } from '../../Event/eventHelper'
import { containerVariants } from '../../animationVariants'
import { motion } from 'framer-motion'

export default function EditEvent () {
  const [event, setEvent] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const user = useSelector(globalState => globalState.user)

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    getEvent(id, user)
      .then((eventData) => {
        setEvent(eventData)
        return null
      })
  }, [])

  function submitEvent (form) {
    updateEvent(event.gardenId, { id, ...form }, navigate)
  }

  function cancelSubmit () {
    cancelEvent(id, history.goBack)
  }

  return (

    event
      ? <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit" >
        <EventForm
          formData={event}
          action='Update Event'
          submitEvent={submitEvent}
          cancelSubmit={cancelSubmit}
        />
      </motion.div>
      : null
  )
}
