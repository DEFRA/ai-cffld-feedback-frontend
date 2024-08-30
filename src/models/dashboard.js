import { subWeeks } from 'date-fns'

class Dashboard {
  constructor(urgent, feedback, allFeedback) {
    this.weekQuery = {
      fromDate: `${subWeeks(Date.now(), 1).toISOString()}`,
      toDate: `${new Date().toISOString()}`
    }

    this.urgent = {
      weekly: urgent.length
    }

    this.feedback = {
      weekly: feedback.length,
      allTime: allFeedback.length
    }
  }
}

export { Dashboard }
