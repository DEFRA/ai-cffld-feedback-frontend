import { FeedbackUploadStatusModel } from '~/src/models/feedback-upload-status.js'
import { getFeedbackMetadata } from '~/src/services/feedback-api.js'

const feedbackStatusController = {
  getStatusHandler: async (request, h) => {
    const feedback = await getFeedbackMetadata()

    const model = new FeedbackUploadStatusModel(feedback)

    return h.view('feedback-upload-status/index', {
      pageTitle: 'Feedback Upload Status',
      heading: 'View Feedback Upload Status',
      model
    })
  }
}

export { feedbackStatusController }
