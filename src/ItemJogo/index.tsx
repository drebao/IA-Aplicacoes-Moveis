import { Image, StyleSheet, Text, View } from "react-native";
import { Jogo } from "../jogos";

type Props = {
  jogo: Jogo
}

export default function ItemJogo({ jogo }: Props) {
  const preco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(jogo.preco);

  return (
    <View style={styles.container}>
      <Image 
        style={styles.image} 
        source={{ uri: jogo.imagem }} 
        resizeMode="cover" 
      />
      <Text style={styles.title}>{jogo.titulo}</Text>
      <Text style={styles.price}>{preco}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171a21',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16
  },
  image: {
    minWidth: 350,
    width: '100%',
    height: 400,
    borderRadius: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c7d5e0',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#66c0f4'
  },
});