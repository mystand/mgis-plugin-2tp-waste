import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as modalActions from 'core/frontend/actions/modal-actions'
import Button from 'core/frontend/components/shared/button/Button'

import styles from './card-button.styl'

const CardButton = (props) => {
  const { onClick, layer, layerKey } = props
  if (layerKey !== layer.key) return null

  return (
    <div className={ styles.container } >
      <Button onClick={ onClick }>2ТП отходы</Button>
    </div>
  )
}

CardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  layerKey: PropTypes.string.isRequired,
  layer: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired
}

export default connect(
  state => ({
    layerKey: state.pluginConfigs['2tp-waste'].layerKey
  }),
  (dispatch, props) => ({
    onClick: () => dispatch(modalActions.toggle('2tp-table', true, { feature: props.feature }))
  })
)(CardButton)
