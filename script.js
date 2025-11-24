class IntellectualGame {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.score = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.selectedAnswer = null;

        this.init();
    }

    init() {
        console.log("Игра инициализирована");
        this.bindEvents();
        this.startTimer();
        this.updateProgress();
    }

    bindEvents() {
        const answerOptions = document.querySelectorAll(".answer-option");

        answerOptions.forEach(option => {
            option.addEventListener("click", (e) => {
                this.handleAnswerSelect(e.currentTarget);
            });

            option.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.handleAnswerSelect(e.currentTarget);
                }
            });
        });

        const submitBtn = document.getElementById("submitAnswer");
        if (submitBtn) {
            submitBtn.addEventListener("click", () => {
                this.submitAnswer();
            });
        }

        const nextBtn = document.getElementById("nextQuestion");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                this.nextQuestion();
            });
        }

        document.querySelectorAll(".social-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const action = e.currentTarget.getAttribute("aria-label");
                this.handleSocialAction(action);
            });
        });
    }

    handleAnswerSelect(selectedOption) {
        document.querySelectorAll(".answer-option").forEach(option => {
            option.classList.remove("selected");
            option.setAttribute("aria-selected", "false");
        });

        selectedOption.classList.add("selected");
        selectedOption.setAttribute("aria-selected", "true");
        this.selectedAnswer = selectedOption;

        const submitBtn = document.getElementById("submitAnswer");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.focus();
        }
    }

    submitAnswer() {
        if (!this.selectedAnswer) return;

        this.stopTimer();
        this.showResult();

        if (this.selectedAnswer.dataset.correct === "true") {
            this.score += 10;
            const scoreElement = document.getElementById("score");
            if (scoreElement) scoreElement.textContent = this.score;
        }
    }

    showResult() {
        const resultSection = document.querySelector(".result-section");
        const resultIcon = document.getElementById("resultIcon");
        const resultTitle = document.getElementById("resultTitle");

        const isCorrect = this.selectedAnswer.dataset.correct === "true";

        if (isCorrect) {
            resultIcon.textContent = "🎉";
            resultTitle.textContent = "Правильно!";
            resultTitle.style.color = "var(--success-color)";
            this.selectedAnswer.classList.add("correct");
        } else {
            resultIcon.textContent = "💡";
            resultTitle.textContent = "Почти угадали!";
            resultTitle.style.color = "var(--warning-color)";
            this.selectedAnswer.classList.add("incorrect");

            document.querySelectorAll(".answer-option").forEach(opt => {
                if (opt.dataset.correct === "true") {
                    opt.classList.add("correct");
                }
            });
        }

        resultSection.classList.remove("hidden");
        resultSection.style.animation = "fadeIn 0.5s ease";

        document.querySelectorAll(".answer-option").forEach(opt => {
            opt.style.pointerEvents = "none";
        });
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion > this.totalQuestions) {
            this.endGame();
            return;
        }

        this.resetQuestionState();
        this.updateProgress();
        this.startTimer();
    }

    resetQuestionState() {
        this.selectedAnswer = null;

        document.querySelectorAll(".answer-option").forEach(option => {
            option.classList.remove("selected", "correct", "incorrect");
            option.setAttribute("aria-selected", "false");
            option.style.pointerEvents = "auto";
            option.style.animation = "";
        });

        const submitBtn = document.getElementById("submitAnswer");
        if (submitBtn) submitBtn.disabled = true;

        const resultSection = document.querySelector(".result-section");
        if (resultSection) resultSection.classList.add("hidden");

        const questionNumber = document.querySelector(".question-number");
        if (questionNumber) {
            questionNumber.textContent = `Вопрос #${this.currentQuestion}`;
        }
    }

    startTimer() {
        this.timeLeft = 60;

        const timerElement = document.getElementById("timer");
        if (timerElement) {
            timerElement.textContent = this.timeLeft;
            timerElement.style.animation = "";
            timerElement.style.color = "";
        }

        this.timer = setInterval(() => {
            this.timeLeft--;

            if (timerElement) timerElement.textContent = this.timeLeft;

            if (this.timeLeft <= 10 && timerElement) {
                timerElement.style.color = "var(--error-color)";
                timerElement.style.animation = "pulse 1s infinite";
            }

            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
    }

    handleTimeUp() {
        this.stopTimer();
        if (!this.selectedAnswer) {
            const options = document.querySelectorAll(".answer-option");
            if (options.length > 0) {
                const randomOption = options[Math.floor(Math.random() * options.length)];
                this.handleAnswerSelect(randomOption);
                setTimeout(() => this.submitAnswer(), 500);
            }
        }
    }

    updateProgress() {
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        const progressFill = document.querySelector(".progress-fill");
        const progressText = document.querySelector(".progress-text");

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText)
            progressText.textContent = `Вопрос ${this.currentQuestion} из ${this.totalQuestions}`;
    }

    handleSocialAction(action) {
        const button = document.querySelector(`[aria-label="${action}"]`);
        if (button) {
            button.style.animation = "pulse 0.3s ease";
            setTimeout(() => (button.style.animation = ""), 300);
        }

        if (action === "Поделиться") this.shareGame();
        if (action === "Сохранить") this.saveProgress();
    }

    shareGame() {
        if (navigator.share) {
            navigator.share({
                title: "Интеллектуальная игра",
                text: "Проверь свои знания!",
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Ссылка скопирована!");
        }
    }

    saveProgress() {
        const progress = {
            currentQuestion: this.currentQuestion,
            score: this.score,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem("gameProgress", JSON.stringify(progress));
    }

    endGame() {
        alert(`Игра завершена! Ваш счет: ${this.score}/${this.totalQuestions * 10}`);

        this.currentQuestion = 1;
        this.score = 0;
        this.resetQuestionState();
        const scoreElement = document.getElementById("score");
        if (scoreElement) scoreElement.textContent = "0";
        this.updateProgress();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new IntellectualGame();
});
