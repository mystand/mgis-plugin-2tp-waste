import React, { PropTypes } from 'react'
import R from 'ramda'
import '!style!css!react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import './2tp-waste-bootstrap.styl'

function isNew(item) {
  return item.id.startsWith('__')
}

function featureSelectValue(feature) {
  return `${feature.properties.name} |${feature.id.substring(0, 5)}`
}

const fields = [
  { key: 'hazard_class', name: 'hazard_class' },
  { key: 'waste', name: 'waste' },
  { key: 'waste_code', name: 'waste_code' },
  { key: 'waste_presence', name: 'waste_presence' },
  { key: 'waste_creation', name: 'waste_creation' },
  { key: 'waste_receipt_sum', name: 'waste_receipt_sum' },
  { key: 'waste_receipt_import', name: 'waste_receipt_import' },
  { key: 'waste_usage', name: 'waste_usage' },
  { key: 'waste_neutralization', name: 'waste_neutralization' },
  { key: 'waste_transfer_sum', name: 'waste_transfer_sum' },
  { key: 'waste_transfer_for_usage', name: 'waste_transfer_for_usage' },
  { key: 'waste_transfer_for_neutralization', name: 'waste_transfer_for_neutralization' },
  { key: 'waste_transfer_for_burial', name: 'waste_transfer_for_burial' },
  { key: 'waste_placement_sum', name: 'waste_placement_sum' },
  { key: 'waste_placement_storage', name: 'waste_placement_storage' },
  { key: 'waste_placement_burial', name: 'waste_placement_burial' },
  { key: 'waste_remain', name: 'waste_remain' }
]

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
      itemChanges: {}
    }

    this.add = ::this.add
    this.afterSaveCell = ::this.afterSaveCell
    this.pack = ::this.pack
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
      const { itemChanges } = this.state
      const items = R.values(itemChanges).map(item => isNew(item) ? this.unpackNew(item) : this.unpack(item))
      onSave(items)
    }
  }

  render() {
    const { items, features, disabled } = this.props
    const { itemChanges } = this.state

    const data = [...items.map(this.pack), ...R.values(itemChanges).filter(isNew)]
    const cellEdit = disabled ? undefined : {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.afterSaveCell
    }

    return (
      <div className='plugin-2tp-waste-table'>
        <BootstrapTable
          data={ data }
          cellEdit={ cellEdit }
        >
          <TableHeaderColumn dataField='id' isKey> ID </TableHeaderColumn>
          <TableHeaderColumn
            dataField='target_feature_id'
            editable={ {
              type: 'select',
              options: { values: R.values(features).map(featureSelectValue) }
            } }
          > Feature </TableHeaderColumn>
          {
            fields.map(field => (
              <TableHeaderColumn key={ field.key } dataField={ field.key }>{field.name}</TableHeaderColumn>
            ))
          }
        </BootstrapTable>
        { (!disabled) && <button onClick={ this.add }>Add</button> }
        { (!disabled) && <button onClick={ this.save }>Save</button> }
      </div>
    )
  }
}
