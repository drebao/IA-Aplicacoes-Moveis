import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { useFavorites } from "../../hooks/useFavorites";

export default function FavoritosScreen() {
  const { favorites } = useFavorites();

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: "#171A21" }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
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
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 8,
                  backgroundColor: "#2A475E",
                }}
              />
            )}

            <View style={{ flex: 1 }}>
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

              {/* 💰 Preço */}
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

              {!!item.description && (
                <Text
                  numberOfLines={3}
                  style={{ color: "#C7D5E0", marginTop: 4 }}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", marginTop: 24, color: "#C7D5E0" }}
          >
            Nenhum jogo favoritado ainda.
          </Text>
        }
      />
    </View>
  );
}