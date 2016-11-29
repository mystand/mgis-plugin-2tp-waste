import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'core/frontend/components/shared/button/Button'

import styles from './card-button.styl'

const CardExportButton = (props) => {
  const { layer, feature, municipalitiesLayerKey } = props
  if (municipalitiesLayerKey !== layer.key) return null

  function onClick() {
    window.location = `/api/waste/xls/${feature.id}`
  }

  return (
    <div className={ styles.container }>
      <Button onClick={ onClick }>Отчет по отходам</Button>
    </div>
  )
}

CardExportButton.propTypes = {
  municipalitiesLayerKey: PropTypes.string,
  layer: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired,
  feature: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default connect(state => ({
  municipalitiesLayerKey: state.pluginConfigs['2tp-waste'].municipalitiesLayerKey
}))(CardExportButton)
