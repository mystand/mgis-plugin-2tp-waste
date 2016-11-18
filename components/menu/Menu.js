import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Menu from 'core/frontend/common/menu/Menu'
import styles from 'core/frontend/admin/admin-menu/admin-menu.styl'

const MenuComponent = (props) => {
  const { dispatch } = props

  return (
    <Menu
      to='/admin/waste'
      title={ 'Отходы' }
      dispatch={ dispatch }
      className={ styles.menu }
      titleClassName={ styles.menuTitle }
      activeClassName={ styles.menuTitleActive }
    />
  )
}

MenuComponent.propTypes = {
  dispatch: PropTypes.func
}

export default connect(() => ({}))(MenuComponent)
