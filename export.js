import R from 'ramda'

import { TABLE_NAME, ATTRIBUTES_FOR_REDUCE } from './constants'

const ATTRIBUTES_KEYS = R.map(x => x.key, ATTRIBUTES_FOR_REDUCE)

const sumFn = (x, y) => x + y

function reduceWaste(items) {
  return R.reduce((sum, item) => {
    return R.mergeWith(sumFn, R.pick(ATTRIBUTES_KEYS, item), sum)
  }, {}, items)
}

export default async function exportAction(knex, result) {
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
