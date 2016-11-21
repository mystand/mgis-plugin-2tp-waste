/* eslint no-param-reassign: ["error", { "props": false }] */

import R from 'ramda'

const TABLE_NAME = '2tp_wastes'
const PRIMARY_KEY = 'id'
const ATTRIBUTES_FLOAT = [
  'waste_presence', 'waste_creation',
  'waste_receipt_sum', 'waste_receipt_import', 'waste_usage', 'waste_neutralization', 'waste_transfer_sum',
  'waste_transfer_for_usage', 'waste_transfer_for_neutralization', 'waste_transfer_for_burial', 'waste_placement_sum',
  'waste_placement_storage', 'waste_placement_burial', 'waste_remain'
]
const ATTRIBUTES = ['target_layer_key', 'target_feature_id', 'hazard_class', 'waste', 'waste_code', ...ATTRIBUTES_FLOAT]

const pickAttributes = R.pick(ATTRIBUTES)

function typeCast(values) {
  ATTRIBUTES_FLOAT.forEach((attributeName) => {
    const value = values[attributeName]
    if (R.is(String, value)) {
      values[attributeName] = parseFloat(value) || 0
    }
  })
  return values
}

export async function index(ctx) {
  ctx.body = await ctx.knex(TABLE_NAME)
}

export async function create(ctx) {
  const params = ctx.request.body

  const records = await ctx.knex(TABLE_NAME)
    .insert(typeCast(pickAttributes(params)))
    .returning('*')

  ctx.body = records[0]
}

export async function update(ctx) {
  const params = ctx.request.body

  const records = await ctx.knex(TABLE_NAME)
    .where(PRIMARY_KEY, params[PRIMARY_KEY])
    .update(typeCast(pickAttributes(params)))
    .returning('*')

  ctx.body = records[0]
}

export async function destroy(ctx) {
  const key = ctx.params[PRIMARY_KEY]

  try {
    await ctx.knex(TABLE_NAME).where(PRIMARY_KEY, key).del()
    ctx.body = { success: true, key }
  } catch (e) {
    ctx.status = 400
    ctx.body = { success: false, key }
  }
}
