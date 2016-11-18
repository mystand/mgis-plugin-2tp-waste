import MenuComponent from '../components/menu/Menu'
import WastePage from '../pages/waste/WastePage'
import saga from '../saga'
import reducer from '../reducer'

export default {
  name: '2ТП-отходы',
  options: [
    { key: 'layerKey', label: 'Слой', type: 'select', options: 'layers' }
  ],
  connects: {
    components: [
      { component: MenuComponent, position: 'adminMenu' }
    ],
    routes: {
      '/admin/waste': WastePage
    },
    saga,
    reducer
  }
}
