// index.tsx
import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "./lib/supabase";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace("/landing");
      } else {
        router.replace("/signin");
      }
    };

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#38bdf8" />
      <Text style={styles.text}>Checking session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 16,
  },
});
