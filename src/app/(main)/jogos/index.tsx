import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useGames } from "../../../hooks/useGames";
import SearchBar from "../../../components/SearchBar";

export default function JogosScreen() {
  const { games, loading, error, offline, reload } = useGames();

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.title?.toLowerCase().includes(q));
  }, [games, query]);

  return (
    <View style={{ flex: 1, padding: 12, gap: 12, backgroundColor: "#171A21" }}>
      <SearchBar
        placeholder="Buscar jogos..."
        value={query}
        onChange={setQuery}
      />

      {offline && (
        <Text style={{ color: "orange", textAlign: "center", fontWeight: "600" }}>
          ⚠️ Modo offline — exibindo dados salvos
        </Text>
      )}
      {!!error && <Text style={{ color: "tomato", textAlign: "center" }}>{error}</Text>}

      {loading && games.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, color: "#C7D5E0" }}>Carregando jogos...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={reload} />
          }
          initialNumToRender={8}
          windowSize={10}
          removeClippedSubviews
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
                borderColor: "#2A475E",
              }}
            >
              {item.thumbnail ? (
                <Image
                  source={{ uri: String(item.thumbnail) }}
                  style={{ width: 88, height: 88, borderRadius: 8 }}
                />
              ) : (
                <View
                  style={{ width: 88, height: 88, borderRadius: 8, backgroundColor: "#2A475E" }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 16, color: "#FFFFFF" }} numberOfLines={1}>
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
              {query ? "Nenhum jogo encontrado para a busca." : "Nenhum jogo disponível."}
            </Text>
          }
        />
      )}
    </View>
  );
}