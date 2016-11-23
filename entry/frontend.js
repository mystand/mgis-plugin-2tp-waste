import MenuComponent from '../components/menu/Menu'
import TableModal from '../components/table-modal/TableModal'
import CardButton from '../components/card-button/CardButton'
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
      { component: MenuComponent, position: 'adminMenu' },
      { component: TableModal, position: 'modals', options: { key: '2tp-table' } },
      { component: CardButton, position: 'cardBottom' }
    ],
    routes: {
      '/admin/waste': WastePage
    },
    saga,
    reducer
  }
}
