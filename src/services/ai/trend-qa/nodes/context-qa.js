import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

import { sonnet } from '~/src/services/ai/llm/bedrock.js'

const NAME = 'context_qa'

const systemPrompt = `
<instruction>
Given a chat history (<chat_history>) and the latest user question, formulate a standalone question that can be understood without the context of the chat history.

If the user asks a different question unrelated to the chat history, return the user's question as is without any changes.

Do not:
- Ask for clarification
- Ask for more information
- Ask for a confirmation
- Answer the user's question
- Provide a solution
- Add additional filters to the question if the user has not provided any

Do:
- Formulate a standalone question that can be understood without the context of the chat history
- Return only the question as your response
- If you are unable to formulate a question, return the user's question as is without any changes
- Ensure filters are maintained if the user has provided them in <chat_history>
</instruction>

<example>
If the user has asked in the last two messages from chat history:
- What was the feedback in June 2024?
- What would you recommend changing?

Your response should be:
What changes would you recommend for the feedback in June 2024?
</example>

<chat_history>
{chat_history}
</chat_history>
`

async function node(state) {
  const { content: input } = state.messages[state.messages.length - 1]

  if (state.chat_history.length === 0) {
    return {
      input
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ['human', '{input}']
  ])

  const chain = prompt.pipe(sonnet).pipe(new StringOutputParser())

  const res = await chain.invoke({
    chat_history: JSON.stringify(state.chat_history),
    input
  })

  return {
    input: res
  }
}

export { NAME, node }
