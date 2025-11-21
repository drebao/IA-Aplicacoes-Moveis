import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useGames } from "../../../hooks/useGames";
import SearchBar from "../../../components/SearchBar";
import { searchGames } from "../../../services/api";
import type { Game } from "../../../types";

export default function JogosScreen() {
  const { games, loading, error, offline, reload, toggleFavorite } = useGames();

  const [query, setQuery] = useState("");
  const [remoteResults, setRemoteResults] = useState<Game[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const localMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [games, query]);

  const combinedResults = useMemo(() => {
    const base: Game[] = [...localMatches];
    const ids = new Set(base.map((g) => g.id));
    for (const r of remoteResults) {
      if (!ids.has(r.id)) {
        base.push(r);
      }
    }
    return base;
  }, [localMatches, remoteResults]);

  const isSearching = query.trim().length > 0;
  const dataToShow = isSearching ? combinedResults : games;
  const isLoadingList = loading || searchLoading;

  useEffect(() => {
    const q = query.trim();

    if (!q || offline) {
      setRemoteResults([]);
      setSearchLoading(false);
      return;
    }

    if (q.length < 2) {
      setRemoteResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    (async () => {
      try {
        const results = await searchGames(q);
        if (cancelled) return;

        const withFav: Game[] = results.map((r) => {
          const local = games.find((g) => g.id === r.id);
          return { ...r, isFavorite: local?.isFavorite ?? false };
        });

        setRemoteResults(withFav);
      } catch {
        if (!cancelled) setRemoteResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query, offline, games]);

  return (
    <View style={{ flex: 1, padding: 12, gap: 12, backgroundColor: "#171A21" }}>
      <SearchBar
        placeholder="Buscar jogos..."
        value={query}
        onChange={setQuery}
      />

      {offline && (
        <Text
          style={{ color: "orange", textAlign: "center", fontWeight: "600" }}
        >
          ⚠️ Modo offline — busca global desativada, mostrando apenas dados
          salvos
        </Text>
      )}
      {!!error && (
        <Text style={{ color: "tomato", textAlign: "center" }}>{error}</Text>
      )}

      {isLoadingList && dataToShow.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, color: "#C7D5E0" }}>
            Carregando jogos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataToShow}
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
                alignItems: "center",
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
                    backgroundColor: "#2A475E",
                  }}
                />
              )}

              <View style={{ flex: 1 }}>
                {/* Título */}
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                {/*  Preço */}
                {!!item.price && (
                  <Text
                    style={{
                      color: "#66c0f4",
                      marginTop: 2,
                      fontWeight: "600",
                    }}
                    numberOfLines={1}
                  >
                    {item.price}
                  </Text>
                )}

                {/* Descrição */}
                {!!item.description && (
                  <Text
                    numberOfLines={3}
                    style={{ color: "#C7D5E0", marginTop: 4 }}
                  >
                    {item.description}
                  </Text>
                )}
              </View>

              {/* Favorito */}
              <TouchableOpacity
                onPress={() => toggleFavorite(item)}
                style={{ paddingHorizontal: 6, paddingVertical: 4 }}
              >
                <Text style={{ fontSize: 24 }}>
                  {item.isFavorite ? "★" : "☆"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", marginTop: 24, color: "#C7D5E0" }}
            >
              {isSearching
                ? offline
                  ? "Offline: a busca global só funciona com internet."
                  : "Nenhum jogo encontrado para a busca."
                : "Nenhum jogo disponível."}
            </Text>
          }
        />
      )}
    </View>
  );
}