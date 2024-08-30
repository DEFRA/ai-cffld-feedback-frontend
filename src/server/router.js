import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { feedbackUpload } from '~/src/server/upload-feedback/index.js'
import { feedback } from '~/src/server/feedback/index.js'
import { query } from '~/src/server/query/index.js'
import { feedbackStatus } from '~/src/server/feedback-upload-status/index.js'
import { qa } from '~/src/server/qa/index.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([
        home,
        qa,
        feedbackUpload,
        feedback,
        query,
        feedbackStatus
      ])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}
