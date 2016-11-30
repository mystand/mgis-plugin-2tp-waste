import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Menu from 'core/frontend/common/menu/Menu'
import menuStyles from 'core/frontend/client/client-menu/client-menu.styl'
import styles from './reports-menu.styl'

function onClick() {
  window.location = '/api/waste/xls'
}

const ReportsMenu = (props) => {
  const { dispatch } = props

  return (
    <Menu
      title={ 'Отчеты' }
      className={ menuStyles.menu }
      titleClassName={ menuStyles.menuTitle }
      childrenContainerClassName={ menuStyles.childContainer }
    >
      <Menu
        onClick={ onClick }
        title={ 'По отходам' }
        dispatch={ dispatch }
        className={ classnames(styles.menu, menuStyles.menu) }
        titleClassName={ menuStyles.menuTitle }
        activeClassName={ menuStyles.menuTitleActive }
      />
    </Menu>
  )
}

ReportsMenu.propTypes = {
  dispatch: PropTypes.func
}

export default connect(() => ({}))(ReportsMenu)
