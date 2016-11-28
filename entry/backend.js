import * as WasteController from '../controllers/waste'
import { exportFeatures, exportLayers } from '../export'
// import { updateWasteCache } from '../models/feature-before-save'

export default {
  routes: [
    { method: 'get', path: '/api/waste/xls', action: WasteController.xls },
    { method: 'get', path: '/api/waste/xls/:id', action: WasteController.xls_municipality },
    { method: 'get', path: '/api/waste', action: WasteController.index },
    { method: 'post', path: '/api/waste', action: WasteController.create },
    { method: 'put', path: '/api/waste/:id', action: WasteController.update },
    { method: 'delete', path: '/api/waste/:id', action: WasteController.destroy }
  ],
  exports: [
    { type: 'json', middleware: exportFeatures },
    { type: 'json', middleware: exportLayers }
  ],
  // feature: [
  //   { action: 'beforeSave', callback: updateWasteCache }
  // ]
}
