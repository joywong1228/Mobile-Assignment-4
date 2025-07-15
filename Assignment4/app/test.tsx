// test.tsx
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "./lib/supabase";

export default function TestPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const checkFetch = async () => {
      const { data, error } = await supabase
        .from("user_details")
        .select("*")
        .limit(1);
      if (error) setStatus("error");
      else setStatus("success");
    };

    checkFetch();
  }, []);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <ActivityIndicator size="large" color="#38bdf8" />
      )}
      {status === "success" && (
        <Text style={styles.success}>✅ Database is fetchable</Text>
      )}
      {status === "error" && (
        <Text style={styles.error}>❌ Cannot fetch database</Text>
      )}
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
  success: {
    color: "#22c55e",
    fontSize: 18,
  },
  error: {
    color: "#ef4444",
    fontSize: 18,
  },
});
