import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useMemo, useState } from "react";
import { useGames } from "../../../hooks/useGames";
import SearchBar from "../../../components/serchbar";


function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function JogosScreen() {
  const { games, loading, reload } = useGames();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return games;
    const q = norm(query);
    return games.filter(
      g => norm(g.title).includes(q) || norm(g.description ?? "").includes(q)
    );
  }, [games, query]);

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Carregando jogos…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:12, gap:12 }}>
      <SearchBar value={query} onChange={setQuery} placeholder="Buscar por título ou descrição..." />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        ItemSeparatorComponent={() => <View style={{ height:8 }} />}
        renderItem={({ item }) => (
          <View style={{ flexDirection:"row", gap:12, padding:12, borderRadius:12, backgroundColor:"#101418" }}>
            {item.thumbnail ? (
              <Image source={{ uri: String(item.thumbnail) }} style={{ width:72, height:72, borderRadius:8 }} />
            ) : (
              <View style={{ width:72, height:72, borderRadius:8, backgroundColor:"#222" }} />
            )}
            <View style={{ flex:1 }}>
              <Text style={{ fontWeight:"700", fontSize:16, color:"#fff" }}>{item.title}</Text>
              {!!item.description && (
                <Text numberOfLines={2} style={{ color:"#cfcfcf" }}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign:"center", marginTop:24 }}>
            {query ? "Nenhum jogo encontrado para sua busca." : "Nenhum jogo cadastrado."}
          </Text>
        }
      />
    </View>
  );
}