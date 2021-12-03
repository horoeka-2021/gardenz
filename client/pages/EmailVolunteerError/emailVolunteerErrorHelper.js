import requestor from '../../consume'
import { showError } from '../../actions/error'
import { dispatch } from '../../store'
import { setWaiting, clearWaiting } from '../../actions/waiting'

export function getEventDetails (id, navigate, consume = requestor) {
  dispatch(setWaiting())

  return consume(`/events/${id}`)
    .then((res) => {
      dispatch(clearWaiting())

      const event = res.body
      if (event.isVolunteer) {
        navigate(`/events/${id}`)
        return null
      } else {
        return {
          title: event.title,
          gardenName: event.gardenName
        }
      }
    })
    .catch((error) => {
      dispatch(showError(error.message))
    })
}

export function checkUserIdsMatch (emailId, browserId) {
  return (browserId === Number(emailId))
}
