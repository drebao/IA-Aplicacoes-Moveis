import { useMemo, useState } from "react";
import { FlatList, View, Text } from "react-native";
import ItemJogo from "../../../ItemJogo";
import SearchBar from "../../../components/serchbar";
import { jogosEmDestaque } from "../../../jogos";

// normaliza texto: remove acentos e coloca em minúsculas
function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function ListaDeJogos() {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    if (!query.trim()) return jogosEmDestaque;
    const q = norm(query);
    return jogosEmDestaque.filter(j => norm(j.titulo).includes(q));
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: "#1b2838" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemJogo jogo={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <SearchBar value={query} onChangeText={setQuery} />
        }
        ListEmptyComponent={
          <Text style={{ color: "#c7d5e0", textAlign: "center", padding: 24 }}>
            Nenhum jogo encontrado para “{query}”.
          </Text>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}