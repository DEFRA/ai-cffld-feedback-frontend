import { executeGraph } from '~/src/services/ai/trend-qa/index.js'
import { QaModel } from '~/src/models/qa.js'

const qaController = {
  getHandler: async (request, h) => {
    const messages = request.yar.get('qa-history') ?? []

    const qa = new QaModel(messages)

    return h.view('qa/index', {
      pageTitle: 'Q&A',
      heading: 'CFFLD Feedback Q&A',
      qa
    })
  },
  postHandler: async (request, h) => {
    if (request.payload.reset) {
      request.yar.clear('qa-history')

      return h.redirect('/qa')
    }

    const userPrompt = request.payload.userPrompt

    const history = request.yar.get('qa-history') ?? []

    const { messages } = await executeGraph(userPrompt, history)

    request.yar.set('qa-history', [...history, ...messages])

    return h.redirect('/qa')
  }
}

export { qaController }
