import React, { PropTypes } from 'react'
import R from 'ramda'
import '!style!css!react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import Button from 'core/frontend/components/shared/button/Button'

import './2tp-waste-bootstrap.styl'

function isNew(item) {
  return item.id.startsWith('__')
}

function featureSelectValue(feature) {
  return `${feature.properties.name} |${feature.id.substring(0, 5)}`
}

const fields = [
  {
    key: 'hazard_class',
    label: 'Класс опасности',
    width: '100',
    editable: {
      type: 'select',
      options: { values: ['Нет', 'I класс', 'II класс', 'III класс', 'IV класс', 'V класс'] }
    }
  },
  { key: 'waste', label: 'Отходы' },
  { key: 'waste_code', label: 'Код отхода' },
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
].map(x => ({ ...x, width: x.width || '200' }))

export default class WasteTable extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    layerKey: PropTypes.string,
    features: PropTypes.object,
    onSave: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  constructor() {
    super()
    this.counter = 0
    this.state = {
      itemChanges: {},
      toDelete: []
    }

    this.add = ::this.add
    this.afterSaveCell = ::this.afterSaveCell
    this.pack = ::this.pack
    this.save = ::this.save
  }

  pack(item) {
    const { features } = this.props
    return { ...item, target_feature_id: featureSelectValue(features[item.target_feature_id]) }
  }

  unpackNew(item) {
    return R.dissoc('id', this.unpack(item))
  }

  unpack(item) {
    const { features } = this.props

    const featureValue = item.target_feature_id
    const featureName = R.dropLast(7, featureValue)
    const featureIdStart = R.takeLast(5, featureValue)
    const featureId = R.find(
      f => f.id.startsWith(featureIdStart) && f.properties.name === featureName,
      R.values(features)
    )

    return { ...item, target_feature_id: featureId.id }
  }

  add() {
    const { layerKey } = this.props
    this.counter += 1
    const item = { id: `__${this.counter}`, target_layer_key: layerKey }

    this.setState({ itemChanges: { ...this.state.itemChanges, [item.id]: item } })
  }

  afterSaveCell(item) {
    this.setState({ itemChanges: { ...this.state.itemChanges, [item.id]: item } })
  }

  save() {
    const { onSave } = this.props

    if (R.isFunction(onSave)) {
      const { itemChanges, toDelete } = this.state
      const items = R.values(itemChanges).map(item => isNew(item) ? this.unpackNew(item) : this.unpack(item))
      onSave(items, toDelete)
    }
  }

  delete(id) {
    if (isNew({ id })) {
      this.setState({ itemChanges: R.dissoc(id, this.state.itemChanges) })
    } else {
      this.setState({ toDelete: [...this.state.toDelete, id] })
    }
  }

  render() {
    const { items, features, disabled } = this.props
    const { itemChanges, toDelete } = this.state

    const data = [
      ...items.map(this.pack)
        .filter(item => !R.contains(item.id, toDelete))
        .map(item => itemChanges[item.id] || item),
      ...R.values(itemChanges).filter(isNew)
    ]

    const cellEdit = disabled ? undefined : {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.afterSaveCell
    }

    const controlColumns = []
    if (!disabled) {
      controlColumns.push(<TableHeaderColumn
        key='actions'
        width='42'
        dataField='id'
        dataFormat={
          // eslint-disable-next-line react/jsx-no-bind
          id => <button onClick={ this.delete.bind(this, id) }>✕</button>
        }
      />)
    }

    return (
      <div className='plugin-2tp-waste-table'>
        <BootstrapTable
          data={ data }
          cellEdit={ cellEdit }
        >
          <TableHeaderColumn dataField='id' isKey width='1'> ID </TableHeaderColumn>
          <TableHeaderColumn
            width='200'
            dataField='target_feature_id'
            editable={ {
              type: 'select',
              options: { values: R.values(features).map(featureSelectValue) }
            } }
          > Объект </TableHeaderColumn>
          {
            fields.map((field) => {
              const { label, key, ...props } = field
              return <TableHeaderColumn { ...props } key={ key } dataField={ key }>{ label }</TableHeaderColumn>
            })
          }
          { controlColumns }
        </BootstrapTable>
        { (!disabled) && <Button onClick={ this.add }>Add</Button> }
        { (!disabled) && <Button onClick={ this.save }>Save</Button> }
      </div>
    )
  }
}
