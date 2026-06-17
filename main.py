from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

BOT_TOKEN = "8810395950:AAGo8mV23hj68zAIgCdPwqcsRWOBSNdVmMc"
CHAT_ID = "5618645663"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    answers = data.get("answers")

    text = f"""📩 НОВА ЗАЯВКА

👤 Ім'я: {name}
📞 Телефон: {phone}

🧠 Відповіді:
"""

    for i, v in answers.items():
        text += f"{i}: {v}\n"

    requests.post(
        f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
        data={
            "chat_id": CHAT_ID,
            "text": text
        }
    )

    return jsonify({"status": "ok"})


if __name__ == '__main__':
    app.run(debug=True)