import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';

export default function SearchView() {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.headerText}>Discover</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 12
  },
  headerText: {
    ... Typescale.headlineS
  }
});