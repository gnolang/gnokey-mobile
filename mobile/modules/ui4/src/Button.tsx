import { View, Text } from "react-native";

export const Button = ({ label } : { label: string }) => (
  <View style={{ padding: 12, backgroundColor: "purple" }}>
    <Text style={{ color: "white" }}>{label}</Text>
  </View>
);