import { FeedbackListModel } from '~/src/models/feedback-list.js'
import { summariseFeedback } from '~/src/services/ai/summarise.js'
import { queryFeedback } from '~/src/services/feedback-api.js'

const feedbackViewController = {
  getFeedbackHandler: async (request, h) => {
    const { query } = request

    const feedback = await queryFeedback(query)

    if (!feedback.length) {
      return h.view('feedback/index', {
        pageTitle: 'Feedback',
        heading: 'View CFFLD Feedback'
      })
    }

    const summary = await summariseFeedback(feedback)

    const model = new FeedbackListModel(summary, feedback)

    return h.view('feedback/index', {
      pageTitle: 'Feedback',
      heading: 'View CFFLD Feedback',
      model
    })
  }
}

export { feedbackViewController }
