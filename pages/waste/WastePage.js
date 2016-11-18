import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import '!style!css!../../assets/bootstrap.css'
import '!style!css!react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import R from 'ramda'
import { Link } from 'react-router'
import { goBack } from 'react-router-redux-params'

import * as wasteActions from '../../actions'

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

function isNew(item) {
  return item.id.startsWith('__')
}

function featureSelectValue(feature) {
  return `${feature.properties.name} |${feature.id.substring(0, 5)}`
}

class WastePage extends React.Component {
  constructor() {
    super()
    this.state = {
      itemChanges: {}
    }
    this.counter = 0

    this.add = ::this.add
    this.afterSaveCell = ::this.afterSaveCell
    this.save = ::this.save
    this.pack = ::this.pack
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(wasteActions.fetch())
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
    const { dispatch } = this.props
    const { itemChanges } = this.state

    R.reduce((promise, item) => promise.then(() => {
      return new Promise((resolve) => {
        const action = isNew(item)
          ? wasteActions.create(this.unpackNew(item), resolve)
          : wasteActions.update(this.unpack(item), resolve)
        dispatch(action)
      })
    }), Promise.resolve(), R.values(itemChanges))
      .then(() => dispatch(goBack()))
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

  render() {
    const { loaded, items, features, layerKey } = this.props
    const { itemChanges } = this.state
    if (!layerKey) return <Link to='/admin/plugins/2tp-waste'> Укажите слой в настройках плагина </Link>
    if (!loaded) return <div> Loading... </div>

    const data = [...items.map(this.pack), ...R.values(itemChanges).filter(isNew)]

    return (
      <div style={ { boxSizing: 'border-box' } }>
        <BootstrapTable
          data={ data }
          cellEdit={ {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: this.afterSaveCell
          } }
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
        <button onClick={ this.add }>Add</button>
        <button onClick={ this.save }>Save</button>
      </div>
    )
  }
}

WastePage.propTypes = {
  items: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  layerKey: PropTypes.string,
  features: PropTypes.object
}

export default connect((state) => {
  const { layerKey } = state.pluginConfigs['2tp-waste']

  return {
    layerKey,
    features: R.pickBy(feature => feature.properties.layer_key === layerKey, state.features),
    items: state.plugins['2tp-waste'].data,
    loaded: state.plugins['2tp-waste'].loaded
  }
})(WastePage)
