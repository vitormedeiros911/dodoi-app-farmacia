import { Platform } from "react-native";
import { OneSignal } from "react-native-onesignal";

export function oneSignalInitialize() {
  const oneSignalAppId = process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID;

  if (oneSignalAppId) OneSignal.initialize(oneSignalAppId);

  if (Platform.OS === "ios")
    OneSignal.Notifications.canRequestPermission().then((response) => {
      if (response) OneSignal.Notifications.requestPermission(true);
    });
  else OneSignal.Notifications.requestPermission(true);
}

export function oneSignalRegisterUser(idFarmacia: string) {
  OneSignal.User.addTag("idFarmacia", idFarmacia);
  OneSignal.User.addTag("tipoUsuario", "FARMACIA");
}
