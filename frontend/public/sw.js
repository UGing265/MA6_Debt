self.addEventListener("push", (event) => {
  let payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = { body: event.data.text() };
    }
  }

  const title = payload.title || "MA6 Debt";
  const options = {
    body: payload.body || "You have a new notification.",
    icon: "/MA6.png",
    badge: "/MA6.png",
    tag: payload.tag || "ma6-debt",
    data: {
      url: payload.url || "/dashboard",
      type: payload.type || "default",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/dashboard", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
