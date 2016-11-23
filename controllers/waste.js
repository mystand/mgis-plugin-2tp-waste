/* eslint no-param-reassign: ["error", { "props": false }] */

import R from 'ramda'

import { TABLE_NAME, PRIMARY_KEY, ATTRIBUTES_FLOAT, ATTRIBUTES } from '../constants'

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
