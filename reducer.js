import { WASTE_FETCH_REQUEST, WASTE_CREATE_REQUEST, WASTE_FETCH_SUCCESS } from './actions'

const defaultState = {
  data: [],
  loaded: false
}

export default function (state = defaultState, action) {
  switch (action.type) {

  case WASTE_FETCH_REQUEST: {
    return { ...state, loaded: false }
  }

  case WASTE_CREATE_REQUEST: {
    return { ...state, data: [...state.data, action.item] }
  }

  case WASTE_FETCH_SUCCESS: {
    return { ...state, data: action.items, loaded: true }
  }

  default:
    return state
  }
}
