import * as WasteController from '../controllers/waste'
import { exportFeatures, exportLayers } from '../export'


export default {
  routes: [
    { method: 'get', path: '/api/waste', action: WasteController.index },
    { method: 'post', path: '/api/waste', action: WasteController.create },
    { method: 'put', path: '/api/waste/:id', action: WasteController.update },
    { method: 'delete', path: '/api/waste/:id', action: WasteController.destroy }
  ],
  exports: [
    { type: 'json', middleware: exportFeatures },
    { type: 'json', middleware: exportLayers }
  ]
}
