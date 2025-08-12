const micBtn = document.getElementById('micBtn');
const sendBtn = document.getElementById('sendBtn');
const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

function addMessage(text, cls='assistant'){
  const div = document.createElement('div');
  div.className = 'msg ' + cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage(text){
  addMessage(text, 'user');
  const res = await fetch('/process', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({text})
  });
  const data = await res.json();
  const reply = data.reply || 'No reply';
  addMessage(reply, 'assistant');
  // speak the reply using browser TTS
  try{
    const utter = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utter);
  }catch(e){console.warn('TTS failed', e)}
}

sendBtn.onclick = ()=>{
  const t = textInput.value.trim();
  if(!t) return;
  textInput.value = '';
  sendMessage(t);
}

// Browser Web Speech API — client-side recognition
let recognition;
if(window.webkitSpeechRecognition || window.SpeechRecognition){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e)=>{
    const transcript = e.results[0][0].transcript;
    sendMessage(transcript);
  }
  recognition.onerror = (e)=>{
    console.error('Recognition error', e);
  }
}

micBtn.onclick = ()=>{
  if(!recognition){
    alert('Speech recognition not supported in this browser. Use Chrome or Edge.');
    return;
  }
  try{
    recognition.start();
  }catch(e){
    console.error(e);
  }
}

// allow pressing Enter to send
textInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') sendBtn.click();
});