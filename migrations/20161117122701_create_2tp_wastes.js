const tableName = '2tp_wastes'

exports.up = function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('target_layer_key').notNullable()
    table.string('target_feature_id').notNullable()
    table.string('hazard_class')
    table.string('waste')
    table.string('waste_code')
    table.float('waste_presence')
    table.float('waste_creation')
    table.float('waste_receipt_sum')
    table.float('waste_receipt_import')
    table.float('waste_usage')
    table.float('waste_neutralization')
    table.float('waste_transfer_sum')
    table.float('waste_transfer_for_usage')
    table.float('waste_transfer_for_neutralization')
    table.float('waste_transfer_for_burial')
    table.float('waste_placement_sum')
    table.float('waste_placement_storage')
    table.float('waste_placement_burial')
    table.float('waste_remain')
  })
}

exports.down = function down(knex) {
  return knex.schema.dropTable(tableName)
}
