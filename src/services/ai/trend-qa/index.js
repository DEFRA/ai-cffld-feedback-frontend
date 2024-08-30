import { END, START, StateGraph } from '@langchain/langgraph'
import { HumanMessage, AIMessage } from '@langchain/core/messages'

import * as contextQa from '~/src/services/ai/trend-qa/nodes/context-qa.js'
import * as queryComposer from '~/src/services/ai/trend-qa/nodes/query-composer.js'
import * as feedbackApi from '~/src/services/ai/trend-qa/nodes/feedback-api.js'
import * as trendSummary from '~/src/services/ai/trend-qa/nodes/trend-summary.js'
import validQueryRouter from '~/src/services/ai/trend-qa/routers/valid-query.js'

function buildGraph(state) {
  const workflow = new StateGraph({
    channels: state
  })

  workflow
    .addNode(contextQa.NAME, contextQa.node)
    .addNode(queryComposer.NAME, queryComposer.node)
    .addNode(feedbackApi.NAME, feedbackApi.node)
    .addNode(trendSummary.NAME, trendSummary.node)
    .addNode('error', (state) => {
      if (state.query.includes('Unable to construct a query')) {
        return {
          messages: [new AIMessage(state.query)]
        }
      }

      return state
    })

  workflow
    .addEdge(START, contextQa.NAME)
    .addEdge(contextQa.NAME, queryComposer.NAME)
    .addConditionalEdges(queryComposer.NAME, validQueryRouter)
    .addEdge(feedbackApi.NAME, trendSummary.NAME)
    .addEdge('error', END)
    .addEdge(trendSummary.NAME, END)

  return workflow.compile()
}

async function executeGraph(message, history) {
  const state = {
    chat_history: [],
    messages: {
      value: (x, y) => (x || []).concat(y || []),
      default: () => []
    },
    current_date: '',
    query: '',
    feedback: '',
    input: ''
  }

  const graph = buildGraph(state)

  const chatHistory = history
    .filter((m) => m.id[2] === 'HumanMessage')
    .map((m) => new HumanMessage(m.kwargs.content))

  const response = await graph.invoke({
    chat_history: chatHistory,
    messages: [new HumanMessage(message)],
    current_date: new Date().toISOString()
  })

  return response
}

export { executeGraph }
