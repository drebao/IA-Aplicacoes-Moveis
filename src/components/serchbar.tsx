import { View, TextInput, Pressable, Text } from "react-native";
import { useState, useEffect } from "react";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => onChange(local), 180);
    return () => clearTimeout(id);
  }, [local, onChange]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#111418",
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <TextInput
        value={local}
        onChangeText={setLocal}
        placeholder={placeholder ?? "Buscar jogos..."}
        placeholderTextColor="#8B8D93"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={{
          flex: 1,
          color: "#fff",
          fontSize: 16,
          paddingVertical: 4,
        }}
      />
      {local.length > 0 && (
        <Pressable onPress={() => setLocal("")}>
          <Text style={{ color: "#9fd3ff", fontWeight: "600" }}>Limpar</Text>
        </Pressable>
      )}
    </View>
  );
}