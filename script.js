// 問題データ（answer は正解の choices のインデックス、0 始まり）
const questions = [
  {
    question: "1年のうち、日数が最も少ない月はどれ？",
    choices: ["2月", "4月", "6月", "11月"],
    answer: 0,
  },
  {
    question: "標高が日本で最も高い山はどれ？",
    choices: ["北岳", "富士山", "槍ヶ岳", "阿蘇山"],
    answer: 1,
  },
  {
    question: "1時間は何秒？",
    choices: ["360秒", "600秒", "3600秒", "6000秒"],
    answer: 2,
  },
  {
    question: "1気圧のもとで、水が沸騰する温度はおよそ何℃？",
    choices: ["50℃", "80℃", "120℃", "100℃"],
    answer: 3,
  },
  {
    question: "信号機の「止まれ」を表す色はどれ？",
    choices: ["青", "黄", "赤", "白"],
    answer: 2,
  },
];

// 画面要素
const startScreen = document.querySelector("#start-screen");
const questionScreen = document.querySelector("#question-screen");
const resultScreen = document.querySelector("#result-screen");
const progressText = document.querySelector("#progress");
const questionText = document.querySelector("#question-text");
const choicesContainer = document.querySelector("#choices");
const feedbackText = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const scoreText = document.querySelector("#score");
const startButton = document.querySelector("#start-button");
const retryButton = document.querySelector("#retry-button");

// クイズの状態
let currentQuestionIndex = 0;
let correctCount = 0;

// 効果音（Web Audio API で音を作るので音声ファイルは不要）
let audioContext = null;

// 1つの音を鳴らす（startTime は今から何秒後に鳴らすか）
function playTone(frequency, startTime, duration, waveType) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + startTime;

  oscillator.type = waveType;
  oscillator.frequency.value = frequency;
  // 音の終わりを少しずつ小さくして「プツッ」という音を防ぐ
  gain.gain.setValueAtTime(0.2, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

// 種類に応じた効果音を鳴らす
function playSound(type) {
  // ブラウザの制限でクリック後にしか音を鳴らせないため、初回クリック時に作る
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (type === "correct") {
    // ピンポン
    playTone(988, 0, 0.15, "sine");
    playTone(784, 0.15, 0.4, "sine");
  } else if (type === "incorrect") {
    // ブブー
    playTone(150, 0, 0.25, "square");
    playTone(150, 0.3, 0.45, "square");
  } else if (type === "result") {
    // ファンファーレ
    playTone(523, 0, 0.15, "triangle");
    playTone(659, 0.15, 0.15, "triangle");
    playTone(784, 0.3, 0.15, "triangle");
    playTone(1047, 0.45, 0.6, "triangle");
  }
}

// 指定した画面だけを表示する
function showScreen(screen) {
  [startScreen, questionScreen, resultScreen].forEach((element) => {
    element.classList.toggle("hidden", element !== screen);
  });
}

// クイズを最初から始める
function startQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  showScreen(questionScreen);
  showQuestion();
}

// 現在の問題を表示する
function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  progressText.textContent = `第${currentQuestionIndex + 1}問 / 全${questions.length}問`;
  questionText.textContent = currentQuestion.question;
  feedbackText.classList.add("hidden");
  feedbackText.classList.remove("correct", "incorrect");
  nextButton.classList.add("hidden");

  choicesContainer.innerHTML = "";
  currentQuestion.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;
    button.addEventListener("click", () => selectAnswer(index));
    choicesContainer.appendChild(button);
  });
}

// 選択肢が選ばれたときに正誤を判定する
function selectAnswer(selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = choicesContainer.querySelectorAll(".choice-button");
  const isCorrect = selectedIndex === currentQuestion.answer;

  // 回答後は選択できないようにし、正解の選択肢を強調する
  buttons.forEach((button) => {
    button.disabled = true;
  });
  buttons[currentQuestion.answer].classList.add("correct");

  if (isCorrect) {
    correctCount++;
    playSound("correct");
    feedbackText.textContent = "⭕ 正解！";
    feedbackText.classList.add("correct");
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    playSound("incorrect");
    feedbackText.textContent = `❌ 不正解… 正解は「${currentQuestion.choices[currentQuestion.answer]}」です。`;
    feedbackText.classList.add("incorrect");
  }
  feedbackText.classList.remove("hidden");

  // 最後の問題なら結果へ進むボタンにする
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  nextButton.textContent = isLastQuestion ? "結果を見る" : "次の問題へ";
  nextButton.classList.remove("hidden");
}

// 次の問題、または結果画面へ進む
function goToNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 結果を表示する
function showResult() {
  scoreText.textContent = `${questions.length}問中${correctCount}問正解`;
  showScreen(resultScreen);
  playSound("result");
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", goToNext);
retryButton.addEventListener("click", startQuiz);
