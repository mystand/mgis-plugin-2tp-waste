import { createSelector } from 'reselect'
import R from 'ramda'

const featuresFilteredByLayerKey = createSelector(
  state => state.features,
  state => state.pluginConfigs['2tp-waste'].layerKey,
  (features, layerKey) => R.pickBy(feature => feature.properties.layer_key === layerKey, features)
)

export const tablePropsSelector = createSelector(
  featuresFilteredByLayerKey,
  state => state.pluginConfigs['2tp-waste'].layerKey,
  state => state.plugins['2tp-waste'].data,
  (features, layerKey, items) => ({ features, layerKey, items })
)
