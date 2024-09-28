import { v4 as uuidv4 } from 'uuid'

import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from 'react'
import { categories } from '../data/categories'
import { Activity } from '../types'
import { ActivityActions, ActivityState } from '../reducers/activity-reducers'

type FormProps = {
  dispatch: Dispatch<ActivityActions>
  state: ActivityState
}

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0,
}

export const Form = ({ dispatch, state }: FormProps) => {
  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter(
        (stateActivity) => stateActivity.id === state.activeId
      )[0]
      setActivity(selectedActivity)
    }
  }, [state.activeId])

  const handleChange = (
    evt: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const isNumberField = ['category', 'calories'].includes(evt.target.id)

    setActivity({
      ...activity,
      [evt.target.id]: isNumberField ? +evt.target.value : evt.target.value,
    })
  }

  const isValidActivity = () => {
    const { name, calories } = activity
    return name.trim() !== '' && calories > 0
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    dispatch({
      type: 'save-activity',
      payload: { newActivity: activity },
    })

    setActivity({ ...initialState, id: uuidv4() })
  }

  return (
    <form className='space-y-5 bg-white shadow p-10 rounded-lg' onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 gap-3'>
        <label htmlFor='category' className='text-sm font-bold text-gray-700'>
          Categoria
        </label>
        <select
          name=''
          id='category'
          className='border border-slate-300 p-2 rounded-lg w-full bg-white'
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className='grid grid-cols-1 gap-3'>
        <label htmlFor='name' className='text-sm font-bold text-gray-700'>
          Actividad
        </label>
        <input
          type='text'
          id='name'
          className='border border-slate-300 p-2 rounded-lg'
          placeholder='Ej. Comida, Jugo de naranja, Ensalada, Ejercicio, pesas, bicicleta'
          value={activity.name}
          onChange={handleChange}
        />
      </div>
      <div className='grid grid-cols-1 gap-3'>
        <label htmlFor='calories' className='text-sm font-bold text-gray-700'>
          Calorias
        </label>
        <input
          type='number'
          id='calories'
          className='border border-slate-300 p-2 rounded-lg'
          placeholder='Calorias. ej. 300 o 500'
          value={activity.calories === 0 ? '' : activity.calories}
          onChange={handleChange}
        />
      </div>
      <input
        type='submit'
        className='bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10'
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />
    </form>
  )
}
