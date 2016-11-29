import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Menu from 'core/frontend/common/menu/Menu'
import styles from 'core/frontend/client/client-menu/client-menu.styl'

function onClick() {
  window.lodation = '/api/waste/xls'
}

const ExportMenu = (props) => {
  const { dispatch } = props

  return (
    <Menu
      onClick={ onClick }
      title={ 'Отчет по отходам' }
      dispatch={ dispatch }
      className={ styles.menu }
      titleClassName={ styles.menuTitle }
      activeClassName={ styles.menuTitleActive }
    />
  )
}

ExportMenu.propTypes = {
  dispatch: PropTypes.func
}

export default connect(() => ({}))(ExportMenu)
