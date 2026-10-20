import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Moving login to the top makes it the first screen the app looks for */}
      <Stack.Screen name="login" /> 
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}