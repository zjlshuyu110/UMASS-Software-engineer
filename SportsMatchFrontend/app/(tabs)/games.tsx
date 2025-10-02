import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function GamesView() {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.headerText}>Games</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 12
  },
  headerText: {
    fontSize: 24,
    fontWeight: 600
  }
});