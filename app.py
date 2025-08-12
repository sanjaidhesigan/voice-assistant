from flask import Flask, render_template, request, jsonify
import datetime
import pywhatkit
import pyjokes
import webbrowser
import wikipedia
import pywhatkit as kit
    
app = Flask(__name__)

# Simple assistant logic adapted from your script

def get_weather():
    return "It's sunny and 30 degrees Celsius."


def process_command(command: str) -> str:
    command = command.lower()
    
    
    if 'play' in command:
        song = command.replace('play', '').strip()
        if song:
            # run YouTube in the server environment (may open on server machine)
            pywhatkit.playonyt(song)
            return f"Playing {song} on YouTube"
        return "What do you want me to play?"

    if 'search' in command:
        query = command.replace('search', '').strip()
        if query:
            pywhatkit.search(query)
            return f"Searched for {query}"
        return "What do you want to search for?"

    elif 'time' in command:
        current_time = datetime.datetime.now().strftime('%I:%M %p')
        return f"The current time is {current_time}"

    elif 'open youtube' in command:
        webbrowser.open('https://youtube.com')
        return 'Opened YouTube'
    
    elif 'open chatgpt' in command:
        webbrowser.open('https://chatgpt.com')
        return 'opened chatgpt'
    
    elif 'weather' in command:
        return get_weather()

    elif 'joke' in command:
        return pyjokes.get_joke()
    
    elif 'message' in command:
        
         kit.sendwhatmsg_instantly("+916381042680","hello!world")
         return 'message sended'

    elif any(word in command for word in ['exit', 'stop', 'bye']):
        return 'Goodbye! See you next time.'
    
    elif command.strip():
        summary = wikipedia.summary(command, sentences=10   )
        return summary

    return "Sorry, I didn't understand that."
    
    


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process', methods=['POST'])
def process():
    data = request.get_json() or {}
    text = data.get('text', '')
    if not text:
        return jsonify({'reply': "I didn't receive any text."})
    reply = process_command(text)
    return jsonify({'reply': reply})


if __name__ == '__main__':
    app.run(debug=True)