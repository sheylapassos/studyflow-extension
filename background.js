// Verifica lembretes a cada minuto
setInterval(() => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  chrome.storage.local.get(["reminder"], (result) => {
    const reminder = result.reminder;
    if (reminder && reminder.time === currentTime) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon128.png", // Certifique-se de que esse ícone existe na pasta
        title: "Lembrete StudyFlow",
        message: reminder.text
      });

      // Remove o lembrete após disparar
      chrome.storage.local.remove("reminder");
    }
  });
}, 60000); // verifica a cada 60 segundos