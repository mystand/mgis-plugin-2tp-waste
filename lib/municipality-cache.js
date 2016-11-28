import R from 'ramda'

import Feature from 'core/backend/models/feature'

import { buildWasteCreationCachePropertyKey } from '../utils'

export async function updateMunicipalityCacheOfWaste(knex, wasteItem) {
  const pluginConfig = (await knex('plugin_configs').where('key', '2tp-waste'))[0]
  if (pluginConfig == null) return

  const { municipalitiesLayerKey, layerKey } = pluginConfig.properties
  if (municipalitiesLayerKey == null && layerKey == null) return

  const company = await Feature.find(knex, wasteItem.target_feature_id)
  const municipality = (await Feature.fetch(knex, rel => rel.whereRaw(
    `"properties"->>'layer_key' = ? AND ST_Contains("geometry", ${Feature.packGeometry(company.geometry)})`,
    [municipalitiesLayerKey]
  )))[0]

  // console.log(municipality)

  if (municipality != null) {
    const updatedMunicipality = await processMunicipality(knex, municipality, layerKey)
    await Feature.update(knex, updatedMunicipality)
  }
}

async function processMunicipality(knex, municipality, companyLayerKey) {
  // todo пооптимизировать на получение только id
  const companies = await Feature.fetch(knex, rel => rel.whereRaw(
    `"properties"->>'layer_key' = ? AND ST_Contains(${Feature.packGeometry(municipality.geometry)}, "geometry")`, [
      companyLayerKey
    ]))
  const companyIds = companies.map(x => x.id)

  // todo пооптимизировать. группировать запросом
  const wasteGroups = await knex('2tp_wastes')
    .whereIn('target_feature_id', companyIds)
  // .sum('waste_creation')
  // .groupBy('hazard_class')

  const groups = R.pipe(
    R.groupBy(x => buildWasteCreationCachePropertyKey(x.hazard_class)),
    R.map(R.reduce((sum, item) => sum + item.waste_creation, 0))
  )(wasteGroups)

  return { ...municipality, properties: { ...municipality.properties, ...groups } }
}
