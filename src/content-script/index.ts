import { sleep, select } from '@lib/utils'
import { SpeechToText } from '@lib/speech-to-text'

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
