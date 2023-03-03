import { sleep, select } from '@lib/utils'
import { SpeechToText } from '@lib/speech-to-text'

init()

async function init() {
  await sleep(1000)

  const textarea = select<HTMLTextAreaElement>('textarea')
  const button = select<HTMLFormElement>('form button')
  const responses = document.querySelectorAll<HTMLDivElement>('.markdown.prose')

  speak(`Hello, I'm Jarvis!`)

  let userInput = ''

  const speechToText = new SpeechToText({
    onUserSpeaking: ({ sentences }) => {
      userInput = sentences.join('. ')
      textarea.textContent = userInput
    },
    onSendKeyword: () => {
      speak(`Message to send: "${userInput}"`)
      textarea.textContent = ''
    },
    onResetKeyword: () => {
      speak(`Resetting message`)
      userInput = ''
      textarea.textContent = ''
    },
  })

  speechToText.startListening()
}

function speak(text: string) {
  chrome.runtime.sendMessage({ type: 'speak', text })
}
