class FeedbackListModel {
  constructor(summary, feedback) {
    this.summary = summary.split(/\n/g)

    this.feedback = feedback
  }
}

export { FeedbackListModel }
