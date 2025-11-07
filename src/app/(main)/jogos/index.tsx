import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useMemo, useState } from "react";
import { useGames } from "../../../hooks/useGames";
import SearchBar from "../../../components/SearchBar";

function normalizeText(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function JogosScreen() {
  const { games, loading, reload, error } = useGames();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return games;
    const q = normalizeText(query);
    return games.filter(
      (g) =>
        normalizeText(g.title).includes(q) ||
        normalizeText(g.description ?? "").includes(q)
    );
  }, [games, query]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#171A21" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: "#C7D5E0" }}>Carregando jogos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12, gap: 12, backgroundColor: "#171A21" }}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar por título ou descrição..."
      />

      {error && (
        <Text style={{ color: "#ff6b6b", textAlign: "center" }}>
          {error}
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#1B2838",
              borderWidth: 1,
              borderColor: "#2A475E"
            }}
          >
            {item.thumbnail ? (
              <Image
                source={{ uri: String(item.thumbnail) }}
                style={{ width: 88, height: 88, borderRadius: 8 }}
              />
            ) : (
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 8,
                  backgroundColor: "#2A475E"
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontWeight: "700", fontSize: 16, color: "#FFFFFF" }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!!item.description && (
                <Text numberOfLines={3} style={{ color: "#C7D5E0", marginTop: 4 }}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24, color: "#C7D5E0" }}>
            {query ? "Nenhum jogo encontrado para a sua busca." : "Nenhum jogo disponível."}
          </Text>
        }
      />
    </View>
  );
}