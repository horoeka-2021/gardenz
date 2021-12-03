import React from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { registerUser } from './registerHelper'
import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import { formButtonVariants } from '../../pages/animationVariants'

import * as Yup from 'yup'

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'This must be at least 2 characters long')
    .max(15, 'Sorry, this must be under 15 characters long')
    .required('Required'),
  lastName: Yup.string()
    .required('Required')
    .min(2, 'This must be at least 2 characters long')
    .max(20, 'Sorry, this must be under 20 characters long'),
  gardenId: Yup.number()
    .required('Required')
})

export default function Register () {
  const authUser = useAuth0().user
  const navigate = useNavigate()
  const isAdmin = useSelector(globalState => globalState.user?.isAdmin)

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      gardenId: null
    },
    onSubmit: values => {
      registerUser(values, isAdmin, authUser, navigate)
    },
    validationSchema: registerSchema
  })

  function showAnyErrors (inputName) {
    return formik.errors[inputName] && formik.touched[inputName]
      ? <p className='inputError'>{formik.errors[inputName]}</p>
      : null
  }
  return (
    <>
      <h2>Register to view garden events</h2>
      <section className='flex-container centre-flex' >
        <form className='flex-container__register-form' onSubmit={formik.handleSubmit}>
          <div className="field">
            <label htmlFor='firstName' className='label profile-label'>First Name</label>
            {showAnyErrors('firstName')}
            <input
              className='form-box'
              id='firstName'
              name='firstName'
              onChange={formik.handleChange}
              value={formik.values.firstName}
            />
            <label htmlFor='lastName' className='label profile-label'>Last Name</label>
            {showAnyErrors('lastName')}
            <input
              className='form-box'
              id='lastName'
              name='lastName'
              onChange={formik.handleChange}
              value={formik.values.lastName}
            />
            <label htmlFor='garden' className='label profile-label'>My Garden</label>
            {showAnyErrors('garden')}
            <select
              className='form-box'
              name='gardenId'
              id='garden'
              onChange={formik.handleChange}
            >
              <option hidden>Select from this list</option>
              <option value={1}>Kelmarna Gardens</option>
              <option value={2}>Kingsland Community Orchard</option>
              <option value={3}>Devonport Community Garden</option>
            </select>
          </div>
          <motion.button
            className='submit profile-submit'
            type='submit'
            data-testid='submitButton'
            variants={formButtonVariants}
            whileHover="hover">Register</motion.button>
        </form>
      </section>
    </>
  )
}
