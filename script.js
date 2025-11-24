// --- EXPERIENCE DATA ---
const experienceData = {
    ale: {
        title: "Senior QA Engineer @ ALE CIS (Alcatel-Lucent)",
        description: `19 лет 8 месяцев работы в ALE CIS

Основные направления:
• Тестирование Contact Center & IVR-систем
• Интеллектуальная маршрутизация вызовов
• Работа с высоконагруженными Linux-системами
• Виртуализация (VMware, Hyper-V)
• Нагрузочное тестирование

Достижения:
• Создание стабильных тестовых сред
• Оптимизация нагрузочного тестирования
• Внедрение комплексной документации`,
        components: ["VoIP", "Linux", "Load Testing", "Virtualization", "Oracle SQL"]
    },
    paragon: {
        title: "QA Engineer @ Paragon / Regent",
        description: `Разработка и тестирование решений в области биллинга и ERP.

Зона ответственности:
• Тестирование модулей биллинговых систем
• SQL-отчётность
• API-проверки
• Интеграционные сценарии`,
        components: ["Billing", "SQL", "ERP"]
    },
    arcadia: {
        title: "QA Engineer @ Arcadia",
        description: `Работа на проектах e-commerce и финтех.

Опыт:
• Проверка серверной бизнес-логики
• Автоматизация базовых сценариев
• Модульное тестирование API`,
        components: ["E-Commerce", "API", "Automation Basics"]
    }
};

// --- CODE FILES (как строки) ---
const codeFiles = {
    linux: `const linuxExpertise = {
  level: "Senior",
  years: 19,
  technologies: ["Apache", "Tomcat", "Shell", "Networking", "Monitoring"]
};`,

    voip: `# Telecom Systems Expertise (Python example)
class TelecomExpert:
    def __init__(self):
        self.protocols = ["SIP", "RTP", "H.323"]
        self.tools = ["Wireshark", "SIPP", "Asterisk"]
`,

    testing: `class LoadTestingSuite {
  constructor() {
    this.tools = ["JMeter", "SIPP", "Custom Scripts"];
  }
  
  run() {
    console.log("Running load tests...");
  }
}`
};


// --- UTILS ---
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}

function highlightSyntax(line) {
    return line
        .replace(/\b(const|class|function|return|def)\b/g, '<span class="keyword">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
}

function renderCode(code) {
    const el = document.getElementById("code-display");
    if (!el) return;

    const html = escapeHtml(code)
        .split("\n")
        .map(line => `<div class="code-line">${highlightSyntax(line)}</div>`)
        .join("");

    el.innerHTML = html;
}


// --- TIME ---
function startClock() {
    const timeEl = document.getElementById("current-time");
    if (!timeEl) return;

    const update = () => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    update();
    setInterval(update, 60000);
}


// --- ISSUE HANDLING ---
function initIssues() {
    document.querySelectorAll(".issue").forEach(issue => {
        issue.addEventListener("click", function () {
            document.querySelectorAll(".issue").forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const key = this.dataset.issue;
            const data = experienceData[key];

            if (!data) return;

            document.getElementById("issue-title").textContent = data.title;
            document.getElementById("issue-description").textContent = data.description;

            const comp = document.querySelector(".detail-item:nth-child(3) span");
            if (comp) comp.textContent = data.components.join(", ");
        });
    });

    const active = document.querySelector(".issue.active");
    if (active) active.click();
}


// --- FILE VIEWER ---
function initFiles() {
    document.querySelectorAll(".file-item").forEach(file => {
        file.addEventListener("click", function () {
            document.querySelectorAll(".file-item").forEach(f => f.classList.remove("active"));
            this.classList.add("active");

            const key = this.dataset.file;
            const code = codeFiles[key];
            if (code) renderCode(code);
        });
    });

    const active = document.querySelector(".file-item.active");
    if (active) active.click();
}


// --- PROCESS BARS ---
function initProcessBars() {
    const bars = document.querySelectorAll(".cpu-bar, .memory-bar");
    if (!bars.length) return;

    setInterval(() => {
        bars.forEach(bar => {
            const percent = Math.floor(Math.random() * 60) + 30; // 30–90%
            bar.style.width = `${percent}%`;

            const label = bar.querySelector("span");
            if (label) label.textContent = `${percent}%`;
        });
    }, 2000);
}


// --- MAIN ---
document.addEventListener("DOMContentLoaded", () => {
    startClock();
    initIssues();
    initFiles();
    initProcessBars();
});
