import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

type Props = {
  value?: string; // opcional — evita erro se não passar nada
  placeholder?: string;
  onChange?: (text: string) => void;
};

export default function SearchBar({ value = "", placeholder = "", onChange = () => {} }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#2A475E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});