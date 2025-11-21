import { Stack } from "expo-router";

export default function FavoritosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Favoritos", // aparece no topo com seta de voltar
        }}
      />
    </Stack>
  );
}