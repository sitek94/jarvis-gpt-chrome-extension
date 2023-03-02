import '../base.css'
import { sleep, select } from './utils'
import { SpeechToText } from './speech-to-text'

init()

async function init() {
  await sleep(1000)

  const textarea = select<HTMLTextAreaElement>('textarea')
  const button = select<HTMLFormElement>('form button')
  const responses = document.querySelectorAll<HTMLDivElement>('.markdown.prose')

  chrome.runtime.sendMessage({ type: 'speak', text: 'Hello, I am AI Assistant' })

  const speechToText = new SpeechToText({
    onSendKeyword: () => {
      // TODO
    },
    onUserSpeaking: () => {
      // TODO
    },
    onResetKeyword: () => {
      // TODO
    },
  })

  speechToText.startListening()
}
