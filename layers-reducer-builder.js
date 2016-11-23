import R from 'ramda'

import { DATA_FETCH_SUCCESS } from 'core/frontend/actions/data-actions'

import { ATTRIBUTES_FOR_REDUCE } from './constants'

const ATTRIBUTES_INDEX = R.indexBy(
  x => x.key,
  ATTRIBUTES_FOR_REDUCE.map(x => ({ ...x, type: 'Number', readonly: true }))
)

export function buildLayersReducer(previousReducer) {
  return (state_, action) => {
    const state = previousReducer(state_, action)

    switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      const config = R.find(x => x.key === '2tp-waste', action.data.pluginConfigs)
      if (!config) return state

      const layer = state[config.properties.layerKey]
      if (R.isNil(layer)) return state
      return {
        ...state,
        [layer.key]: {
          ...layer,
          attributes: {
            ...layer.attributes,
            ...ATTRIBUTES_INDEX
          }
        }
      }
    }
    default:
      return state
    }
  }
}
