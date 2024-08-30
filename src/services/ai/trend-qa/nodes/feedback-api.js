import { config } from '~/src/config/index.js'
import { post } from '~/src/server/common/helpers/fetch.js'

const NAME = 'feedback_api'

const url = config.get('feedbackApi.baseUrl')

async function node(state) {
  const { feedback } = await post(`${url}/feedback/query`, state.query, {})

  return {
    feedback
  }
}

export { NAME, node }
