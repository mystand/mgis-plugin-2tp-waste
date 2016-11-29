import R from 'ramda'

import { TABLE_NAME, ATTRIBUTES_FOR_REDUCE, HAZARD_CLASSES } from './constants'
import { buildWasteCreationCachePropertyKey } from './utils'

const sumFn = (x, y) => x + y
const concatFn = (x, y) => `${x}, ${y}`
const NUMBER_ATTRIBUTES_KEYS = ATTRIBUTES_FOR_REDUCE.filter(x => x.type === 'Number').map(x => x.key)
const STRING_ATTRIBUTES_KEYS = ATTRIBUTES_FOR_REDUCE.filter(x => x.type === 'String').map(x => x.key)

function reduceWaste(items) {
  return R.reduce((sum, item) => {
    return R.pipe(
      R.mergeWith(sumFn, R.pick(NUMBER_ATTRIBUTES_KEYS, item)),
      R.mergeWith(concatFn, R.pick(STRING_ATTRIBUTES_KEYS, item))
    )(sum)
  }, {}, items)
}

export async function exportFeatures(knex, result) {
  const features = R.indexBy(x => x.id, result.features)
  const waste = await knex(TABLE_NAME)
  const wasteGroupsByFeatureId = R.groupBy(w => w.target_feature_id, waste)

  R.keys(wasteGroupsByFeatureId).forEach((featureId) => {
    const feature = features[featureId]

    if (!R.isNil(feature)) {
      const items = wasteGroupsByFeatureId[featureId]

      features[featureId] = {
        ...feature,
        properties: {
          ...feature.properties,
          ...reduceWaste(items)
        }
      }
    }
  })

  return { ...result, features: R.values(features) }
}

const ATTRIBUTES_INDEX = R.indexBy(
  x => x.key,
  ATTRIBUTES_FOR_REDUCE.map(x => ({ ...x }))
)

const MUNICIPALITY_CACHE_ATTRIBUTES = R.indexBy(
  x => x.key,
  HAZARD_CLASSES.map(hazardClass => ({
    key: buildWasteCreationCachePropertyKey(hazardClass),
    type: 'Number',
    hidden: true,
    label: `Отходы суммарно (${hazardClass})`
  }))
)

export async function exportLayers(knex, result) {
  const layers = R.indexBy(x => x.key, result.layers)

  const config = R.find(x => x.key === '2tp-waste', result.pluginConfigs)
  if (!config) return result

  const layer = layers[config.properties.layerKey]
  const municipalityLayer = layers[config.properties.municipalitiesLayerKey]

  if (layer != null) {
    layers[layer.key] = {
      ...layer,
      attributes: { ...layer.attributes, ...ATTRIBUTES_INDEX }
    }
  }
  if (municipalityLayer != null) {
    layers[municipalityLayer.key] = {
      ...municipalityLayer,
      attributes: { ...municipalityLayer.attributes, ...MUNICIPALITY_CACHE_ATTRIBUTES }
    }
  }

  if (layer == null && municipalityLayer == null) return result
  return { ...result, layers: R.values(layers) }
}

