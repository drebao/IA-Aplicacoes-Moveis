import { View, TextInput } from "react-native";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#2A475E",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#1B2838"
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#C7D5E0"
        style={{ color: "#FFFFFF", fontSize: 16 }}
      />
    </View>
  );
}