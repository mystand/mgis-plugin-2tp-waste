import R from 'ramda'

import AdminWasteMenu from '../components/admin-waste-menu/AdminWasteMenu'
import TableModal from '../components/table-modal/TableModal'
import CardButton from '../components/card-button/CardButton'
import ReportsMenu from '../components/reports-menu/ReportsMenu'
import CardExportButton from '../components/card-export-button/CardExportButton'
import WastePage from '../pages/waste/WastePage'
import saga from '../saga'
import reducer from '../reducer'

function buildMunicipalitiesPopulationOptions(formOptions) {
  const { directories: { layers }, values } = formOptions
  const layerKey = values.municipalitiesLayerKey
  if (R.isNil(layerKey)) return []

  const attributes = R.find(x => x.key === layerKey, layers).attributes
  return R.keys(attributes).map(key => ({ value: key, label: attributes[key].label }))
}

export default {
  form: {
    fields: [
      { key: 'layerKey', label: 'Слой', input: 'select', inputOptions: { options: 'layers' } },
      {
        key: 'municipalitiesLayerKey',
        label: 'Слой муниципалитетов',
        input: 'select',
        inputOptions: { options: 'layers' }
      },
      {
        key: 'municipalitiesPopulationPropertyKey',
        label: 'Поле муниципалитета с отходами от населения для отчета',
        input: 'select',
        inputOptions: { options: buildMunicipalitiesPopulationOptions }
      },
      {
        key: 'additionalLayersWithButton',
        label: 'Отображать кнопку "2ТП отходы" в слоях:',
        input: 'select',
        inputOptions: { options: 'layers', multiple: true }
      }
    ]
  },
  components: [
    { component: AdminWasteMenu, position: 'adminMenu' },
    { component: TableModal, position: 'modals', options: { key: '2tp-table' } },
    { component: CardButton, position: 'cardBottom' },
    { component: ReportsMenu, position: 'clientMenu' },
    { component: CardExportButton, position: 'cardBottom' }
  ],
  routes: {
    '/admin/waste': WastePage
  },
  saga,
  reducer
}
