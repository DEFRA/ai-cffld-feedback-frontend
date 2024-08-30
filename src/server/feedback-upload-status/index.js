import { feedbackStatusController } from '~/src/server/feedback-upload-status/controller.js'

const feedbackStatus = {
  plugin: {
    name: 'feedback-upload-status',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/feedback/upload/status',
          handler: feedbackStatusController.getStatusHandler
        }
      ])
    }
  }
}

export { feedbackStatus }
