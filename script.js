let timerInterval = null;
let remainingSeconds = 0;
let isRunning = false;

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function enableInputs() {
  document.getElementById('hoursInput').disabled = false;
  document.getElementById('minutesInput').disabled = false;
  document.getElementById('secondsInput').disabled = false;
}

function updateButtonStates() {
  const startBtn = document.getElementById('startButton');
  const pauseBtn = document.getElementById('pauseButton');
  const resetBtn = document.getElementById('resetButton');
  
  if (isRunning) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  } else if (remainingSeconds > 0) {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
  }
}

function showEndMessage() {
  // 隱藏時鐘
  document.getElementById('clockDisplay').style.display = 'none';
  
  // 清除所有舊的結束訊息
  const container = document.getElementById('timerContainer');
  const oldMessages = container.querySelectorAll('.end-message');
  oldMessages.forEach(msg => msg.remove());
  
  // 創建新訊息
  const messageDiv = document.createElement('div');
  messageDiv.className = 'end-message';
  messageDiv.textContent = '🎉 時間到！🎉';
  container.appendChild(messageDiv);
}

function updateDisplay() {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  document.getElementById('hours').textContent = padZero(hours);
  document.getElementById('minutes').textContent = padZero(minutes);
  document.getElementById('seconds').textContent = padZero(seconds);
}

function startTimer() {
  if (isRunning) return;

  // 清除所有結束訊息
  const endMessages = document.querySelectorAll('.end-message');
  endMessages.forEach(msg => msg.remove());
  
  // 顯示時鐘
  document.getElementById('clockDisplay').style.display = 'flex';

  // 如果時間為0,從輸入框讀取
  if (remainingSeconds === 0) {
    const hours = parseInt(document.getElementById('hoursInput').value) || 0;
    const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
    const seconds = parseInt(document.getElementById('secondsInput').value) || 0;
    remainingSeconds = hours * 3600 + minutes * 60 + seconds;
  }

  if (remainingSeconds === 0) {
    alert('請先設定時間！');
    return;
  }

  isRunning = true;
  
  // 禁用輸入框
  document.getElementById('hoursInput').disabled = true;
  document.getElementById('minutesInput').disabled = true;
  document.getElementById('secondsInput').disabled = true;
  
  updateButtonStates();

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      remainingSeconds = 0;
      showEndMessage();
      enableInputs();
      updateButtonStates();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
  
  enableInputs();
  updateButtonStates();
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingSeconds = 0;
  updateDisplay();
  
  // 顯示時鐘
  document.getElementById('clockDisplay').style.display = 'flex';
  
  // 清除所有結束訊息
  const endMessages = document.querySelectorAll('.end-message');
  endMessages.forEach(msg => msg.remove());
  
  enableInputs();
  updateButtonStates();
}

function updateTimeFromInputs() {
  const hours = parseInt(document.getElementById('hoursInput').value) || 0;
  const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
  const seconds = parseInt(document.getElementById('secondsInput').value) || 0;
  remainingSeconds = hours * 3600 + minutes * 60 + seconds;
  updateDisplay();
  updateButtonStates();
}

// 等待頁面載入完成
window.addEventListener('load', function() {
  // 綁定按鈕事件
  document.getElementById('startButton').addEventListener('click', startTimer);
  document.getElementById('pauseButton').addEventListener('click', pauseTimer);
  document.getElementById('resetButton').addEventListener('click', resetTimer);
  
  // 綁定輸入框事件
  document.getElementById('hoursInput').addEventListener('input', updateTimeFromInputs);
  document.getElementById('minutesInput').addEventListener('input', updateTimeFromInputs);
  document.getElementById('secondsInput').addEventListener('input', updateTimeFromInputs);

  // 背景圖片上傳
  document.getElementById('uploadButton').addEventListener('click', () => {
    document.getElementById('imageInput').click();
  });

  document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('timerContainer').style.background = `url(${event.target.result})`;
        document.getElementById('timerContainer').style.backgroundSize = 'cover';
        document.getElementById('timerContainer').style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(file);
    }
  });

  // 初始化
  updateDisplay();
  updateButtonStates();
});