class QaModel {
  constructor(messages) {
    this.messages = messages.map((m, index) => {
      const user = m.id[2] === 'HumanMessage' ? 'User' : 'System'

      const { kwargs } = m

      const content = kwargs.content.split(/\n/g)
      const query = user === 'System' ? kwargs.additional_kwargs.query : null

      return {
        user,
        content,
        query,
        index
      }
    })
  }
}

export { QaModel }
