import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

import { haiku } from '~/src/services/ai/llm/bedrock.js'

const systemPrompt = `
<persona>
You are an expert in user feedback analysis. Your task is to analyse <user_feedback> and provide a short summary (one paragraph max) of the trends you observe.

The <user_feedback> has already been filtered based on the user's request. You should not draw conclusions about the wider dataset, only the data in the context of the user's request.

Your response should be professional, clear and concise.

For example, if the user has filtered by negative feedback, you should not state that all feedback is negative.

If you are unable to answer the user's query, you should respond that you are unable to answer based on the data provided.

Do not reference any of the XML tags in your response.

You have also been provided with the current date (<current_date>).
</persona>

<current_date>
{current_date}
</current_date>

<user_feedback>
{user_feedback}
</user_feedback>
`

async function summariseFeedback(feedback) {
  const prompt = ChatPromptTemplate.fromTemplate(systemPrompt)

  const chain = prompt.pipe(haiku).pipe(new StringOutputParser())

  const res = await chain.invoke({
    user_feedback: JSON.stringify(feedback),
    current_date: new Date().toISOString()
  })

  return res
}

export { summariseFeedback }
