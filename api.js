import { builder } from 'core/frontend/app/api'

export default {
  waste: builder({
    fetch: '/api/waste',
    create: '/api/waste',
    update: item => `/api/waste/${item.id}`
  })
}
