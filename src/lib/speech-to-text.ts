/**
 * Speech Recognition keywords. Have to match exactly and should be single words,
 * so they are not confused with the user's input.
 */
const Keyword = {
  Send: 'send',
  Reset: 'reset',
} as const
type Keyword = (typeof Keyword)[keyof typeof Keyword]

type Handlers = {
  onUserSpeaking: (props: {
    transcript: string
    currentSentence: string
    sentences: string[]
  }) => void
  onSendKeyword: () => void
  onResetKeyword: () => void
}

export class SpeechToText {
  recognition: SpeechRecognition
  sentences: string[] = []
  currentSentence = ''
  handlers: Handlers

  constructor(handlers: Handlers) {
    if (!window.webkitSpeechRecognition) {
      throw new Error('Speech Recognition not supported')
    }

    this.recognition = new window.webkitSpeechRecognition()
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
    this.handlers = handlers
  }

  startListening() {
    this.recognition.addEventListener('result', (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('')

      this.currentSentence = transcript

      const hasFinishedSpeaking = event.results[0].isFinal

      if (hasFinishedSpeaking) {
        if (isKeyword(transcript)) {
          return this.handleKeyword(transcript)
        }

        this.sentences.push(this.currentSentence)
        this.currentSentence = ''
      }

      this.handlers.onUserSpeaking({
        transcript,
        currentSentence: this.currentSentence,
        sentences: this.sentences,
      })
    })

    this.recognition.start()

    // Keep listening
    this.recognition.addEventListener('end', this.recognition.start)
  }

  stopListening() {
    this.recognition.stop()
  }

  handleKeyword(keyword: Keyword) {
    switch (keyword) {
      case Keyword.Send:
        this.handlers.onSendKeyword()
        break

      case Keyword.Reset:
        this.sentences = []
        this.handlers.onResetKeyword()
        break
    }
  }
}

function isKeyword(transcript: string): transcript is Keyword {
  return Object.values(Keyword).includes(transcript as Keyword)
}
