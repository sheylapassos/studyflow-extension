// === Temporizador Pomodoro com pausa ===
let timer;
let timeLeft = 25 * 60;
let isPaused = false;

document.getElementById("start").addEventListener("click", () => {
  clearInterval(timer);
  isPaused = false;
  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        chrome.runtime.sendMessage({ type: "notify", message: "Pomodoro finalizado!" });
      }
    }
  }, 1000);
});

document.getElementById("pause").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pause").textContent = isPaused ? "Continuar" : "Pausar";
});

// === Gerenciamento de Tarefas ===
function addTaskToUI(text) {
  const li = document.createElement("li");
  li.textContent = text;

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "Excluir";
  btnDelete.onclick = () => {
    li.remove();
    removeTask(text);
  };

  li.appendChild(btnDelete);
  document.getElementById("task-list").appendChild(li);
}

function saveTask(text) {
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.push(text);
    chrome.storage.local.set({ tasks });
  });
}

function removeTask(text) {
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    const updated = tasks.filter((t) => t !== text);
    chrome.storage.local.set({ tasks: updated });
  });
}

document.getElementById("add-task").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (taskText) {
    addTaskToUI(taskText);
    saveTask(taskText);
    input.value = "";
  }
});

chrome.storage.local.get(["tasks"], (result) => {
  const tasks = result.tasks || [];
  tasks.forEach(addTaskToUI);
});

// === Lembretes ===
document.getElementById("set-reminder").addEventListener("click", () => {
  const time = document.getElementById("reminder-time").value;
  const text = document.getElementById("reminder-text").value.trim();
  if (time && text) {
    chrome.storage.local.set({ reminder: { time, text } });
    alert("Lembrete criado!");
  }
});