const questions = [
    {
        q: "Как давно вы испытываете симптомы панических атак?",
        a: ["Недавно (до 1 месяца)", "От 1 до 6 месяцев", "Более полугода", "Уже несколько лет"]
    },
    {
        q: "Вы пробовали лечить это состояние ранее?",
        a: ["Да, проходил(а) психотерапию", "Принимал(а) антидепрессанты/транквилизаторы",
        "Самостоятельно — медитации, дыхательные практики и т.д.",
        "Нет, ничего пока не делал(а)"]
    },
    {
        q: "Принимаете ли вы сейчас какие-либо препараты?",
        a: ["Да, принимаю антидепрессанты", "Нет, не принимаю", "Только по необходимости (эпизодически)"]
    },
    {
        q: "Принимаете ли вы сейчас какие-либо препараты?",
        a: [
        "В самолёте",
        "В торговом центре или людных местах",
        "Дома, без видимой причины",
        "При общении с людьми / на встречах",
        "В общественном транспорте",
        "За рулём",
        "На работе",
        "Не могу предсказать — случаются спонтанно",]
    }
];

let current = 0;
let answers = {};

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function animateChange(callback) {
    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");

    // запускаємо fade-out
    questionEl.classList.add("fade-out");
    optionsEl.classList.add("fade-out");

    setTimeout(() => {
        callback();

        // СКИДАЄМО стан (важливо!)
        questionEl.classList.remove("fade-out");
        optionsEl.classList.remove("fade-out");

        // 🔥 форсимо перезапуск анімації
        void questionEl.offsetWidth;
        void optionsEl.offsetWidth;

    }, 200);
}

function loadQuestion() {
    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");

    nextBtn.disabled = true;
    optionsEl.innerHTML = "";

    const q = questions[current];

    questionEl.textContent = q.q;

    q.a.forEach(answer => {
        const label = document.createElement("label");
        label.classList.add("option");

        label.innerHTML = `
            <input type="radio" name="answer" value="${answer}">
            ${answer}
        `;

        label.onclick = () => {
            document.querySelectorAll(".option")
                .forEach(o => o.classList.remove("selected"));

            label.classList.add("selected");
            nextBtn.disabled = false;
        };

        optionsEl.appendChild(label);
    });
}

nextBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return;

    answers[`q${current + 1}`] = selected.value;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");

    // 🔴 1. FADE OUT
    questionEl.classList.add("hide");
    optionsEl.classList.add("hide");

    setTimeout(() => {

        // 🔵 2. міняємо дані
        current++;

        if (current < questions.length) {
        loadQuestion();
        }
        else {
            showFinalForm();
            return;
        }

        // 🟢 3. даємо браузеру “зловити” новий DOM
        requestAnimationFrame(() => {
            questionEl.classList.remove("hide");
            optionsEl.classList.remove("hide");
        });

    }, 350);
});

function showFinalForm() {
    document.querySelector(".form-container").innerHTML = `
        <h2>Залиште ваші дані</h2>

        <input id="name" type="text" placeholder="Ваше ім'я" style="width:100%; padding:12px; margin:10px 0; border-radius:10px; border:1px solid #ccc;">

        <input id="phone" type="tel" placeholder="Ваш телефон" style="width:100%; padding:12px; margin:10px 0; border-radius:10px; border:1px solid #ccc;">

        <label style="display:block; text-align:left; margin:15px 0;">
            <input type="checkbox" id="confirm">
            Я уважаю Ваше время, поэтому, пожалуйста, подтвердите, что Вы обязательно придете на сессию.
        </label>

        <button id="submitBtn">Відправити</button>
    `;

    document.getElementById("submitBtn").onclick = sendToServer;
}

function sendToServer() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const confirm = document.getElementById("confirm").checked;

    if (!name || !phone || !confirm) {
        alert("Заполните все поля и подтвердите согласие");
        return;
    }

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answers,
            name,
            phone,
            confirm
        })
    });

    document.querySelector(".form-container").innerHTML =
        `<h2>Спасибо! Мы с вами свяжемся 🙌</h2>`;
}

loadQuestion();

