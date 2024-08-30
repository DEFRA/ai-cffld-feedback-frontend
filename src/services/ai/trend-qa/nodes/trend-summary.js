import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { AIMessage } from '@langchain/core/messages'

import { haiku } from '~/src/services/ai/llm/bedrock.js'

const NAME = 'trend_summary'

const systemPrompt = `
<persona>
You are an expert in user feedback analysis. The user has crafted a graphql query to fetch feedback data. Your task is to analyse <user_feedback> and provide a summary of the trends you observe.

The <user_feedback> has already been filtered based on the user's request. You should not draw conclusions about the wider dataset, only the data in the context of the user's request.

Your response should be professional, clear and concise.

For example, if the user has filtered by negative feedback, you should not state that all feedback is negative.

If you are unable to answer the user's query, you should respond that you are unable to answer based on the data provided. If <user_feedback> is empty, you are allowed to draw conclusions from this.

Do not reference any of the XML tags in your response.

You have also been provided with the current date (<current_date>).
</persona>

<current_date>
{current_date}
</current_date>

<user_feedback>
{user_feedback}
</user_feedback>

<graphql_query>
{query}
</graphql_query>
`

async function node(state) {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ['human', '{input}']
  ])

  const chain = prompt.pipe(haiku).pipe(new StringOutputParser())

  const res = await chain.invoke({
    input: state.input,
    user_feedback: JSON.stringify(state.feedback),
    current_date: state.current_date,
    query: state.query
  })

  const message = new AIMessage(res, {
    query: state.query,
    feedback: state.feedback
  })

  return {
    messages: [message]
  }
}

export { NAME, node }
