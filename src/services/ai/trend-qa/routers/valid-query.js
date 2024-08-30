import { END } from '@langchain/langgraph'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import * as feedbackApi from '~/src/services/ai/trend-qa/nodes/feedback-api.js'

const logger = createLogger()

function router(state) {
  if (state.query.includes('Unable to construct a query')) {
    logger.warn(
      '[ValidQueryRouter] LLM was unable to generate a valid GraphQL query.'
    )

    return END
  }

  return feedbackApi.NAME
}

export default router
