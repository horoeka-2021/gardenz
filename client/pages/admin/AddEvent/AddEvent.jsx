import React from 'react'
import { useHistory } from 'react-router-dom'
import { addEvent } from './addEventHelper'
import { motion } from 'framer-motion'

import EventForm from '../../../components/events/EventForm/EventForm'
import { addEventVariants } from '../../animationVariants'

export default function AddEvent () {
  const history = useHistory()

  function submitEvent (event) {
    addEvent(event, history.push)
  }
  const initialState = {
    title: '',
    date: '',
    volunteersNeeded: 0,
    description: ''
  }
  return (
    <motion.div
      variants={addEventVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <EventForm
        formData={initialState}
        action='Create Event'
        submitEvent={submitEvent}
      />
    </motion.div>
  )
}
