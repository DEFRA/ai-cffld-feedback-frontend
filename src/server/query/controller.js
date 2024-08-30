import { QueryModel } from '~/src/models/query.js'

const queryController = {
  getHandler: async (request, h) => {
    const { messageNo } = request.params

    const message = request.yar.get('qa-history')?.[messageNo]

    if (!message) {
      return h.redirect('/qa')
    }

    const { query, feedback } = message.kwargs.additional_kwargs

    const model = new QueryModel(query, feedback)

    return h.view('query/index', {
      pageTitle: 'GraphQL Response',
      heading: 'CFFLD Feedback Q&A',
      model
    })
  }
}

export { queryController }
