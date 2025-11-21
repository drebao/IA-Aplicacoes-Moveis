import { Link } from 'expo-router';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzbyoT-O8FAZpSp7_QVnsFXdSYxcrS45pJQ&s' }}
        style={styles.logo}
      />

      <Text style={styles.title}>Bem-vindo à Steam</Text>
      <Text style={styles.subtitle}>Explore os jogos em destaque</Text>

      <TouchableOpacity style={styles.button}>
        <Link href="/jogos" style={styles.buttonText}>
          Ir para Jogos
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 16, backgroundColor: "#4caf50" }]}>
        <Link href="/favoritos" style={styles.buttonText}>
          Ver Favoritos
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:"#1b2838", padding: 20 },
  logo: { width: 200, height: 80, resizeMode: 'contain', marginBottom: 30 },
  title: { fontSize: 26, fontWeight: 'bold', color: "white", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#c7d5e0", marginBottom: 40 },
  button: {
    backgroundColor: "#66c0f4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
