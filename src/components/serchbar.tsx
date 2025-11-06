import { memo } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

function SearchBar({ value, onChangeText, placeholder = "Pesquisar jogos..." }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8aa0b2"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#1b2838",
  },
  input: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#0f232e",
    borderWidth: 1,
    borderColor: "#213246",
    color: "#ffffff",
    fontSize: 16,
  },
});

export default memo(SearchBar);