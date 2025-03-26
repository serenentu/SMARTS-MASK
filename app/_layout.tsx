import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ title: 'Home' }} />
    <Stack.Screen name="imagereader" options={{ title: 'Image Reader' }} />
    <Stack.Screen name="results" options={{ title: 'Results' }} />
  </Stack>
  );
}
