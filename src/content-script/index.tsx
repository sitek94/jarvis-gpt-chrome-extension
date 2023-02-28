import { debounce } from 'lodash-es'
import '../base.css'
import { sleep } from './utils'

init()

/**
 * Speech Recognition keywords. Have to match exactly and should be single words,
 * so they are not confused with the user's input.
 */
const KEYWORD = {
  SEND: 'send',
  RESET: 'reset',
}

async function init() {
  console.log('[AI Assistant] Starting')

  await sleep(1000)

  const textarea = select<HTMLTextAreaElement>('textarea')
  const button = select<HTMLFormElement>('form button')
  const responses = document.querySelectorAll<HTMLDivElement>('.markdown.prose')

  console.log(responses)

  listenForUserInput({
    onUserInput: (text) => {
      textarea.textContent = text
    },

    // 🚨 TODO: somehow still sending multiple times 🚨
    onSend: debounce(() => {
      button.click()
    }, 1000),
    onReset: () => {
      textarea.textContent = ''
    },
  })
}

function listenForUserInput({
  onUserInput,
  onSend,
  onReset,
}: {
  onUserInput: (text: string) => void
  onSend: () => void
  onReset: () => void
}) {
  if (!window.webkitSpeechRecognition) {
    console.error('[Speech Recognition] not supported')
  }

  console.log('[SpeechRecognition] Starting')

  const recognition = new webkitSpeechRecognition()
  recognition.interimResults = true
  recognition.lang = 'en-US'

  let sentences: string[] = []
  let current = ''

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('')

    if (transcript === KEYWORD.SEND) {
      onSend()
    }
    if (transcript === KEYWORD.RESET) {
      sentences = []
      onReset()
      return
    }

    current = transcript

    if (e.results[0].isFinal) {
      sentences.push(current)
      current = ''
    }

    onUserInput(sentences.join('. '))

    console.log(`[SpeechRecognition] ${transcript}`)
    console.log(`[SpeechRecognition] Sentences: ${sentences.join('. ')}`)
  })

  // Keep listening
  recognition.addEventListener('end', recognition.start)

  recognition.start()

  // @ts-expect-error
  window.stopRecognition = () => {
    recognition.stop()
  }
}

function select<TElement extends Element>(selector: string): TElement {
  const element = document.querySelector<TElement>(selector)
  if (!element) {
    throw new Error(`Could not find element with selector: ${selector}`)
  }

  return element
}
