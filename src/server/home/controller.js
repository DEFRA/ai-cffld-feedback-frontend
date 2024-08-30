import {
  queryFeedback,
  getFeedbackForLastWeek
} from '~/src/services/feedback-api.js'
import { Dashboard } from '~/src/models/dashboard.js'

/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
const homeController = {
  handler: async (request, h) => {
    const urgentFeedback = await getFeedbackForLastWeek({ urgent: true })
    const feedback = await getFeedbackForLastWeek()
    const allFeedback = await queryFeedback()

    const dashboard = new Dashboard(urgentFeedback, feedback, allFeedback)

    return h.view('home/index', {
      pageTitle: 'Dashboard',
      heading: 'CFFLD Feedback Analysis',
      dashboard
    })
  }
}

export { homeController }
