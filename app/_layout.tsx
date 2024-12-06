import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="nutrition" options={{ title: "Nutrition" }} />
    </Stack>
  );
}
