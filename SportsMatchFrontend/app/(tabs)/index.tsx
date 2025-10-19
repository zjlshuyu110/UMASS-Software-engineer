import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';

export default function SearchView() {
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Text style={styles.headerText}>Discover</Text>
            <TouchableOpacity style={styles.searchBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol size={12} color={'black'} name='magnifyingglass' style={{ marginRight: 4 }}></IconSymbol>
                <Text>Search for games</Text>
              </View>
            </TouchableOpacity>

            {/* Sports Categories */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
                {sports.map((sport, _) => (
                  <TouchableOpacity style={{ width: '22%', backgroundColor: '#FFF6F5', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderRadius: 12}}>
                    <IconSymbol size={40} name='figure.badminton' color={'#B23434'}></IconSymbol>
                    <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>


            <TouchableOpacity>
              <View style={{ flexDirection: 'row'}}>
                <Text style={{ flex: 1, ... Typescale.titleL}}>Happening Today</Text>
                <IconSymbol size={20} color={"black"} name='chevron.right'></IconSymbol>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        
    )
}

const sports = [
  { name: 'Basketball', icon: 'figure.badminton' },
  { name: 'Volleyball', icon: 'figure.badminton' },
  { name: 'Pickleball', icon: 'figure.badminton' },
  { name: 'Soccer', icon: 'figure.badminton' },
  { name: 'Football', icon: 'figure.badminton' },
  { name: 'Badminton', icon: 'figure.badminton' },
  { name: 'Tennis', icon: 'figure.badminton' },
  { name: 'Pool', icon: 'figure.badminton' },
]

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'white',
    flex: 1
  },
  headerText: {
    ... Typescale.headlineS,
    marginBottom: 12
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 8
  }
});