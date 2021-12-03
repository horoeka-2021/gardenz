import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Map from '../../components/Map/Map'
import Events from '../../components/events/Events/Events'
import { getGarden } from './gardenHelper'
import BarGraph from '../../components/dataVis/BarGraph'
import { motion } from 'framer-motion'
import { leftVariant, rightVariant } from '../animationVariants'

export default function Garden () {
  const { id } = useParams()
  const { garden, user, location } = useSelector(globalState => globalState)

  useEffect(() => {
    user.id && getGarden(id, user)
  }, [id, user])

  const { name, description, address, url, events, lat, lon } = garden

  return (
    <section className='flex-container column-9 centre-flex'>
      <motion.div
        variants={leftVariant}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <div className='column-9'>
          <article>
            <h2>{name}</h2>
            <p>{description}</p>
            <a href={url}>{url}</a>
          </article>
          <Events gardenid={id} events={events} />
        </div>
      </motion.div>
      <motion.div
        variants={rightVariant}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <section>
          <Map
            userCoordinates={location}
            coordinates={[{ lat: lat, lon: lon }]}
            addresses={[address]}
            names={[name]}
          />
          {user.isAdmin ? <BarGraph events={events}/> : null}
        </section>
      </motion.div>
    </section>
  )
}
