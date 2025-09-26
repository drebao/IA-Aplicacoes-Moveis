import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Mantém o fluxo principal do app */}
      <Stack.Screen name="(main)" />
    </Stack>
  )
}