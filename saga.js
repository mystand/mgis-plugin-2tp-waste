import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import * as actions from './actions'
import Api from './api'

function* wasteFetch() {
  const data = yield call(Api.waste.fetch)
  yield put(actions.fetchSuccess(data))
}

function* wasteCreate(action) {
  const item = yield call(Api.waste.create, action.item)
  yield put(actions.createSuccess(item, action.success))
}

function* wasteUpdate(action) {
  const item = yield call(Api.waste.update, action.item)
  yield put(actions.updateSuccess(item, action.success))
}

function* wasteDelete(action) {
  const item = yield call(Api.waste.delete, action.item)
  yield put(actions.deleteSuccess(item, action.success))
}

function* callCallback(action) {
  if (action.callback) action.callback()
}

export default function* saga() {
  yield [
    takeEvery(actions.WASTE_FETCH_REQUEST, wasteFetch),
    takeEvery(actions.WASTE_CREATE_REQUEST, wasteCreate),
    takeEvery(actions.WASTE_UPDATE_REQUEST, wasteUpdate),
    takeEvery(actions.WASTE_DELETE_REQUEST, wasteDelete),

    takeEvery(actions.WASTE_CREATE_SUCCESS, callCallback),
    takeEvery(actions.WASTE_UPDATE_SUCCESS, callCallback),
    takeEvery(actions.WASTE_DELETE_SUCCESS, callCallback)
  ]
}
