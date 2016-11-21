import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import Modal from 'core/frontend/components/shared/modal/Modal'
import * as modalActions from 'core/frontend/actions/modal-actions'
import * as wasteActions from '../../actions'

import WasteTable from '../waste-table/WasteTable'
import { tablePropsSelector } from '../../selectors'

class TableModal extends React.Component {
  componentDidMount() {
    this.props.fetch()
  }

  render() {
    const { onClose, tableProps, loaded } = this.props
    if (!loaded) return <div> Loading... </div>

    return (
      <Modal width='90%' height='90%' onClose={ onClose }>
        <WasteTable
          disabled
          { ...tableProps }
        />
      </Modal>
    )
  }
}

TableModal.propTypes = {
  onClose: PropTypes.func,
  tableProps: PropTypes.shape(WasteTable.propTypes),
  loaded: PropTypes.bool.isRequired,
  fetch: PropTypes.func.isRequired
}

const tablePropsReselector = createSelector(
  tablePropsSelector,
  state => state.modal['2tp-table'],
  (tableProps, modalOptions) => ({
    ...tableProps,
    items: tableProps.items.filter(x => x.target_feature_id === modalOptions.feature.id)
  })
)

export default connect(
  createSelector(
    tablePropsReselector,
    state => state.plugins['2tp-waste'].loaded,
    (tableProps, loaded) => ({ tableProps, loaded })
  ),
  dispatch => ({
    onClose: () => dispatch(modalActions.toggle('2tp-table', false)),
    fetch: () => dispatch(wasteActions.fetch())
  })
)(TableModal)
