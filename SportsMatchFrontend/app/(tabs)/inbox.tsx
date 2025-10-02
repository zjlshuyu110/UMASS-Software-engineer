import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';

export default function InboxView() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Inbox</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 12
  },
  headerText: {
    ... Typescale.headlineS
  }
});