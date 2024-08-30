import Joi from 'joi'
import { subWeeks, format } from 'date-fns'

import { config } from '~/src/config/index.js'
import { get, post } from '../server/common/helpers/fetch.js'

const dateFormat = 'dd MMMM yyyy hh:mm a'

const url = config.get('feedbackApi.baseUrl')

const paramsSchema = Joi.object({
  from_date: Joi.string(),
  to_date: Joi.string(),
  urgent: Joi.boolean(),
  category: Joi.string(),
  sub_category: Joi.string(),
  search: Joi.string()
})

function formatParams(params) {
  const parsed = {}

  const keys = ['from_date', 'to_date', 'category', 'sub_category', 'search']

  for (const key of keys) {
    if (params?.[key]) {
      parsed[key] = `"${params[key]}"`
    }
  }

  if (params?.urgent) {
    parsed.urgent = params.urgent
  }

  return parsed
}

function formatFeedback(feedback) {
  return {
    qualtricsId: feedback.qualtrics_id,
    dateTime: format(new Date(feedback.date_time), dateFormat),
    comments: feedback.comments,
    llmComments: feedback.llm_comments,
    category: feedback.category,
    subCategory: feedback.sub_category,
    keyPoints: feedback.key_points,
    urgent: feedback.urgent
  }
}

function formatMetadata(metadata) {
  return {
    ...metadata,
    createdOn: format(new Date(metadata.createdOn), dateFormat)
  }
}

async function getFeedback(params = {}) {
  const { error } = paramsSchema.validate(params, {
    abortEarly: false
  })

  if (error) {
    throw new Error(`Invalid GraphQL query parameters: ${error.message}`)
  }

  const args = Object.entries(params)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')

  const queryArgs = args ? `(${args})` : ''

  const query = `{
    feedback${queryArgs} {
      qualtrics_id,
      date_time,
      comments,
      llm_comments,
      category,
      sub_category,
      key_points,
      urgent
    }
  }`

  const { feedback } = await post(`${url}/feedback/query`, query, {})

  const sorted = feedback.sort(
    (a, b) => new Date(b.date_time) - new Date(a.date_time)
  )

  const mapped = sorted.map(formatFeedback)

  return mapped
}

async function queryFeedback(params) {
  const parsed = formatParams(params)

  const feedback = await getFeedback(parsed)

  return feedback
}

async function getFeedbackMetadata() {
  const metadata = await get(`${url}/feedback/metadata`, {})

  return metadata.map(formatMetadata)
}

async function getFeedbackForLastWeek(params) {
  const feedback = await queryFeedback({
    from_date: subWeeks(Date.now(), 1).toISOString(),
    to_date: new Date().toISOString(),
    ...params
  })

  return feedback
}

async function uploadFeedbackFile(file) {
  const headers = {
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  await post(`${url}/feedback/upload`, file, { headers })
}

export {
  queryFeedback,
  getFeedbackMetadata,
  getFeedbackForLastWeek,
  uploadFeedbackFile
}
