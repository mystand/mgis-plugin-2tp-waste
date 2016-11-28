import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as modalActions from 'core/frontend/actions/modal-actions'
import Button from 'core/frontend/components/shared/button/Button'

import styles from './card-button.styl'

const CardButton = (props) => {
  const { onClick, layer, layersWithButton } = props
  if (!layersWithButton.includes(layer.key)) return null

  return (
    <div className={ styles.container }>
      <Button onClick={ onClick }>2ТП отходы</Button>
    </div>
  )
}

CardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  layersWithButton: PropTypes.arrayOf(PropTypes.string).isRequired,
  layer: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired
}

export default connect(
  (state) => {
    const config = state.pluginConfigs['2tp-waste']
    return {
      layersWithButton: [...(config.additionalLayersWithButton || []).map(x => x.value), config.layerKey]
    }
  },
  (dispatch, props) => ({
    onClick: () => dispatch(modalActions.toggle('2tp-table', true, { feature: props.feature }))
  })
)(CardButton)
