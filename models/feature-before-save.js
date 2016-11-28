import R from 'ramda'

import Feature from 'core/backend/models/feature'

import { buildWasteCreationCachePropertyKey } from '../utils'

export async function updateWasteCache(knex, feature) {
  const pluginConfig = (await knex('plugin_configs').where('key', '2tp-waste'))[0]
  if (pluginConfig == null) return feature

  const { layerKey, municipalitiesLayerKey } = pluginConfig.properties
  if (municipalitiesLayerKey == null || layerKey == null) return feature

  if (feature.properties.layer_key === municipalitiesLayerKey) {
    return (await processMunicipality(knex, feature, layerKey))
  }
  // if (feature.properties.layer_key === layerKey) {
  //   const municipality =
  // }

  return feature
}

export async function processMunicipality(knex, feature, companyLayerKey) {
  // todo пооптимизировать на получение только id
  const companies = await Feature.fetch(knex, rel => rel.whereRaw(
    `"properties"->>'layer_key' = ? AND ST_Contains(${Feature.packGeometry(feature.geometry)}, "geometry")`, [
      companyLayerKey
    ]))
  const companyIds = companies.map(x => x.id)

  // todo пооптимизировать. группировать запросом
  const wasteGroups = await knex('2tp_wastes')
    .whereIn('target_feature_id', companyIds)
  // .sum('waste_creation')
  // .groupBy('hazard_class')

  const groups = R.pipe(
    R.groupBy(x => buildWasteCreationCachePropertyKey(x.hazardClass)),
    R.map(R.reduce((sum, item) => sum + item.waste_creation, 0))
  )(wasteGroups)

  return { ...feature, properties: { ...feature.properties, ...groups } }
}
