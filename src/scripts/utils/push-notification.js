import { convertBase64ToUint8Array } from ".";
import CONFIG from "../config";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";

export function isServiceWorkerAvailable() {
  return "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log("Service Worker API unsupported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/sw.bundle.js"
    );
    console.log("Service worker telah terpasang", registration);
  } catch (error) {
    console.log("Failed to install service worker:", error);
  }
}

export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();
  console.log("status", status);
  if (status === "denied") {
    alert("Izin notifikasi ditolak.");
    return false;
  }

  if (status === "default") {
    alert("Izin notifikasi ditutup atau diabaikan.");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_KEY),
  };
}
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  const failureSubscribeMessage = "Langganan push notification gagal diaktifkan.";
  const successSubscribeMessage = "Langganan push notification berhasil diaktifkan.";

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("No service worker registered");

  
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      const { endpoint } = existingSubscription.toJSON();

      console.log("Already subscribed with endpoint:", endpoint);

      await unsubscribePushNotification(endpoint);
      await existingSubscription.unsubscribe();
      alert("Langganan push notification berhasil dimatikan.");
      return;
    }

    // Now safe to create a new one
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error("subscribe: response:", response);
      await pushSubscription.unsubscribe();
      alert(failureSubscribeMessage);
      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error("subscribe: error:", error);
    if (pushSubscription) {
      await pushSubscription.unsubscribe();
    }
    alert(failureSubscribeMessage);
  }
}
