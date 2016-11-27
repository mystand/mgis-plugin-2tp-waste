import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import { Link } from 'react-router'
import { goBack } from 'react-router-redux-params'
import { createSelector } from 'reselect'

import * as wasteActions from '../../actions'
import WasteTable from '../../components/waste-table/WasteTable'
import { tablePropsSelector } from '../../selectors'

function isNew(item) {
  return R.isNil(item.id)
}

class WastePage extends React.Component {
  constructor() {
    super()
    this.onSave = ::this.onSave
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(wasteActions.fetch())
  }

  onSave(items, toDelete) {
    const { dispatch } = this.props

    const updatePromise = R.reduce((promise, item) => promise.then(() => {
      return new Promise((resolve) => {
        const action = isNew(item)
          ? wasteActions.create(item, resolve)
          : wasteActions.update(item, resolve)
        dispatch(action)
      })
    }), Promise.resolve(), items)

    R.reduce((promise, id) => promise.then(() => {
      return new Promise((resolve) => {
        dispatch(wasteActions.deleteRequest({ id }, resolve))
      })
    }), updatePromise, toDelete).then(() => dispatch(goBack()))
  }

  render() {
    const { loaded, items, features, layerKey } = this.props
    if (!layerKey) return <Link to='/admin/plugins/2tp-waste'> Укажите слой в настройках плагина </Link>
    if (!loaded) return <div> Loading... </div>

    return (
      <WasteTable
        items={ items }
        layerKey={ layerKey }
        features={ features }
        onSave={ this.onSave }
      />
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

export default connect(createSelector(
  tablePropsSelector,
  state => state.plugins['2tp-waste'].loaded,
  (tableProps, loaded) => ({ ...tableProps, loaded })
))(WastePage)
