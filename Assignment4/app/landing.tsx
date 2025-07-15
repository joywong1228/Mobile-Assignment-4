// landing.tsx
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "./lib/supabase";

export default function Landing() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>🎉 Welcome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  welcome: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
  },
});
