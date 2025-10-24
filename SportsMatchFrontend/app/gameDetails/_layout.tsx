import { Redirect, Stack } from "expo-router";

export default function GameDetailsLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false, // hide default header for all login screens
          animation: "slide_from_right", // optional animation between login screens
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
