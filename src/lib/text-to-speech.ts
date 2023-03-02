export async function getTextToSpeechVoice() {
  const voices = await chrome.tts.getVoices()

  const selectedVoice = voices.find((voice) => voice.voiceName === 'Google UK English Male')

  if (!selectedVoice) {
    throw new Error('Voice not found')
  }

  return selectedVoice
}

export class TextToSpeech {
  constructor(private voice: chrome.tts.TtsVoice) {}

  speak(text: string) {
    chrome.tts.speak(text, {
      lang: 'en-US',
      pitch: 1,
      rate: 1,
      voiceName: this.voice.voiceName,
    })
  }
}
