export const TABLE_NAME = '2tp_wastes'
export const PRIMARY_KEY = 'id'
export const ATTRIBUTES_FLOAT = [
  'waste_presence', 'waste_creation',
  'waste_receipt_sum', 'waste_receipt_import', 'waste_usage', 'waste_neutralization', 'waste_transfer_sum',
  'waste_transfer_for_usage', 'waste_transfer_for_neutralization', 'waste_transfer_for_burial', 'waste_placement_sum',
  'waste_placement_storage', 'waste_placement_burial', 'waste_remain'
]
export const ATTRIBUTES = [
  'target_layer_key', 'target_feature_id', 'hazard_class', 'waste', 'waste_code', ...ATTRIBUTES_FLOAT
]

export const ATTRIBUTES_FOR_REDUCE = [
  { key: 'waste', label: 'Отходы', type: 'String', readonly: false },
  { key: 'waste_code', label: 'Код отхода', type: 'String', readonly: false },
  { key: 'waste_presence', label: 'Наличие отходов на начало отчетного года' },
  { key: 'waste_creation', label: 'Образование отходов за отчетный год' },
  { key: 'waste_receipt_sum', label: 'Поступление отходов из других организаций (всего)' },
  { key: 'waste_receipt_import', label: 'Поступление отходов из других организаций (в т.ч. по импорту)' },
  { key: 'waste_usage', label: 'Использование отходов' },
  { key: 'waste_neutralization', label: 'Обезвреживание отходов' },
  { key: 'waste_transfer_sum', label: 'Передача отходов другим организациям (всего)' },
  { key: 'waste_transfer_for_usage', label: 'Передача отходов другим организациям (для использования)' },
  { key: 'waste_transfer_for_neutralization', label: 'Передача отходов другим организациям (для обезвреживания)' },
  { key: 'waste_transfer_for_storage', label: 'Передача отходов другим организациям (для хранения)' },
  { key: 'waste_transfer_for_burial', label: 'Передача отходов другим организациям (для захоронения)' },
  { key: 'waste_placement_sum', label: 'Размещение отходов на собственных объектах за отчетный год (всего)' },
  { key: 'waste_placement_storage', label: 'Размещение отходов на собственных объектах за отчетный год (хранение)' },
  { key: 'waste_placement_burial', label: 'Размещение отходов на собственных объектах за отчетный год (захоронение)' },
  { key: 'waste_remain', label: 'Наличие в организации на конец отчетного года' }
].map(x => ({ ...x, type: x.type || 'Number', readonly: x.readonly == null ? false : x.readonly }))

export const HAZARD_CLASSES = ['I класс', 'II класс', 'III класс', 'IV класс', 'V класс']
