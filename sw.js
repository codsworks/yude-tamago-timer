self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || self.registration.scope;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const target = new URL(targetUrl, self.registration.scope);
      const existingClient = clients.find((client) => {
        return new URL(client.url).pathname === target.pathname;
      });

      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(target.href);
    })
  );
});
