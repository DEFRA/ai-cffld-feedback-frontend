import { feedbackViewController } from '~/src/server/feedback/controller.js'

const feedback = {
  plugin: {
    name: 'feedback',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/feedback',
          handler: feedbackViewController.getFeedbackHandler
        }
      ])
    }
  }
}

export { feedback }
