import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Modal from 'core/frontend/components/shared/modal/Modal'
import * as modalActions from 'core/frontend/actions/modal-actions'

const TableModal = (props) => {

  return (
    <Modal onClose={ onClose }>
      <form onSubmit={ onSubmit }>
        <TextInput label='Zoom' { ...fields.zoom } />
        <TextInput label='Ratio' { ...fields.ratio } />
        <button type='submit'>Print</button>
      </form>
    </Modal>
  )
}

TableModal.propTypes = {
  dispatch: PropTypes.func
}

export default connect(
  () => ({}),
  dispatch => ({
    onClose: () => dispatch(modalActions.toggle('2tp-table', false))
  })
)(TableModal)
