import { Stack } from "expo-router";

export default function JogosLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: "Jogos" }} 
      />
    </Stack>
  )
}