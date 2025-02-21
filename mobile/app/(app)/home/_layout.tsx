import { Stack } from "expo-router";

type Group<T extends string> = `(${T})`;
export type SharedSegment = Group<"feed"> | Group<"search"> | Group<"profile">;

export default function AppLayout() {
  return <Stack
    screenOptions={{
      headerShown: false,
      headerLargeTitle: true,
      headerBackVisible: false,
    }}
  />;
}
