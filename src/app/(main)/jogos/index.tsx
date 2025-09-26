import { FlatList, View } from "react-native";
import ItemJogo from "../../../ItemJogo";
import { jogosEmDestaque } from "../../../jogos";

export default function ListaDeJogos() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1b2838", paddingVertical: 16 }}>
      <FlatList
        data={jogosEmDestaque}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemJogo jogo={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}