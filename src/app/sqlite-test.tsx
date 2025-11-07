import { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { openDatabaseSync } from "expo-sqlite";

type Row = { id: number; title: string };

export default function SqliteTest() {
  const [rows, setRows] = useState<Row[]>([]);
  const db = openDatabaseSync("test.db");

  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      );
    `);
    reload();
  }, []);

  const insert = () => {
    db.execSync(`INSERT INTO items (title) VALUES ('Hello SQLite');`);
    reload();
  };

  const reload = () => {
    const data = db.getAllSync<Row>(`SELECT id, title FROM items ORDER BY id DESC;`);
    setRows(data);
  };

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:"600" }}>SQLite smoke test</Text>
      <Button title="Inserir linha" onPress={insert} />
      <Button title="Recarregar" onPress={reload} />
      <FlatList
        data={rows}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <Text>#{item.id} — {item.title}</Text>}
      />
    </View>
  );
}