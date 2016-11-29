import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Menu from 'core/frontend/common/menu/Menu'
import styles from 'core/frontend/client/client-menu/client-menu.styl'

function onClick() {
  window.location = '/api/waste/xls'
}

const ReportsMenu = (props) => {
  const { dispatch } = props

  return (
    <Menu
      title={ 'Отчеты' }
      className={ styles.menu }
      titleClassName={ styles.menuTitle }
      childrenContainerClassName={ styles.childContainer }
    >
      <Menu
        onClick={ onClick }
        title={ 'По отходам' }
        dispatch={ dispatch }
        className={ styles.menu }
        titleClassName={ styles.menuTitle }
        activeClassName={ styles.menuTitleActive }
      />
    </Menu>
  )
}

ReportsMenu.propTypes = {
  dispatch: PropTypes.func
}

export default connect(() => ({}))(ReportsMenu)
