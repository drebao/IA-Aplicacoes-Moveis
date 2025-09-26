import { ScrollView, View } from "react-native";
import ItemJogo from "../../../ItemJogo";
import { jogosEmDestaque } from "../../../jogos";

export default function ListaDeJogos() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1b2838" }}>
      <View style={{ flexDirection: 'column', padding: 16, gap: 16 }}>
        {jogosEmDestaque.map((jogo) => (
          <ItemJogo key={jogo.id} jogo={jogo} />
        ))}
      </View>
    </ScrollView>
  )
}