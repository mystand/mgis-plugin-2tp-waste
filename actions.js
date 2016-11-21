export const WASTE_FETCH_REQUEST = 'WASTE_FETCH_REQUEST'
export const WASTE_FETCH_SUCCESS = 'WASTE_FETCH_SUCCESS'
export const WASTE_FETCH_FAILURE = 'WASTE_FETCH_FAILURE'

export const WASTE_CREATE_REQUEST = 'WASTE_CREATE_REQUEST'
export const WASTE_CREATE_SUCCESS = 'WASTE_CREATE_SUCCESS'
export const WASTE_CREATE_FAILURE = 'WASTE_CREATE_FAILURE'

export const WASTE_UPDATE_REQUEST = 'WASTE_UPDATE_REQUEST'
export const WASTE_UPDATE_SUCCESS = 'WASTE_UPDATE_SUCCESS'
export const WASTE_UPDATE_FAILURE = 'WASTE_UPDATE_FAILURE'

export const WASTE_DELETE_REQUEST = 'WASTE_DELETE_REQUEST'
export const WASTE_DELETE_SUCCESS = 'WASTE_DELETE_SUCCESS'
export const WASTE_DELETE_FAILURE = 'WASTE_DELETE_FAILURE'

export const fetch = () => ({
  type: WASTE_FETCH_REQUEST
})

export const fetchSuccess = items => ({
  type: WASTE_FETCH_SUCCESS,
  items
})

export const fetchFailure = error => ({
  type: WASTE_FETCH_FAILURE,
  error
})

export const create = (item, success) => ({
  type: WASTE_CREATE_REQUEST,
  item,
  success
})

export const createSuccess = (item, callback) => ({
  type: WASTE_CREATE_SUCCESS,
  item,
  callback
})

export const createFailure = (item, error) => ({
  type: WASTE_CREATE_FAILURE,
  item,
  error
})

export const update = (item, success) => ({
  type: WASTE_UPDATE_REQUEST,
  item,
  success
})

export const updateSuccess = (item, callback) => ({
  type: WASTE_UPDATE_SUCCESS,
  item,
  callback
})

export const updateFailure = (item, error) => ({
  type: WASTE_UPDATE_FAILURE,
  item,
  error
})

export const deleteRequest = (item, success) => ({
  type: WASTE_DELETE_REQUEST,
  item,
  success
})

export const deleteSuccess = (item, callback) => ({
  type: WASTE_DELETE_SUCCESS,
  item,
  callback
})

export const deleteFailure = (item, error) => ({
  type: WASTE_DELETE_FAILURE,
  item,
  error
})
