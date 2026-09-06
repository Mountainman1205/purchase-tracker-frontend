import WebApp from "@twa-dev/sdk";

// Инициализация Telegram Mini App. Если приложение открыто не в Telegram
// (например, в обычном браузере при разработке), большинство методов
// просто не будут делать ничего — это безопасно.
export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand();
  } catch (e) {
    // работаем вне Telegram (локальная разработка в браузере)
  }
}

export function getInitData() {
  return WebApp.initData || "";
}

export function hapticFeedback(type = "light") {
  try {
    WebApp.HapticFeedback.impactOccurred(type);
  } catch (e) {
    /* noop */
  }
}

export default WebApp;
