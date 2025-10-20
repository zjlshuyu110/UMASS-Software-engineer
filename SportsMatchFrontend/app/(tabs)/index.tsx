import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import GameCard from '@/src/components/discover/game-card';
import { SFSymbol } from 'expo-symbols';


export default function SearchView() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView style={{ paddingHorizontal: 12, flex: 1 }} contentContainerStyle={{flexGrow: 1, paddingBottom: 12 }}>
            <Text style={styles.headerText}>Discover</Text>
            <TouchableOpacity style={styles.searchBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol size={12} color={'black'} name='magnifyingglass' style={{ marginRight: 4 }}></IconSymbol>
                <Text>Search for games</Text>
              </View>
            </TouchableOpacity>

            {/* Sports Categories */}
            <View style={styles.sportCategoriesContainer}>
                {sports.map((sport, index) => (
                  <TouchableOpacity key={index} style={styles.categoryCard}>
                    <IconSymbol size={40} name={sport.icon} color={'#B23434'}></IconSymbol>
                    <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>


            <TouchableOpacity style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row'}}>
                <Text style={{ flex: 1, ... Typescale.titleL}}>Happening Today</Text>
                <IconSymbol size={20} color={"black"} name='chevron.right'></IconSymbol>
              </View>
            </TouchableOpacity>
            <View style={{ rowGap: 8}}>
              {gamesToday.map((id) => <GameCard key={id}></GameCard>)}
            </View>
          </ScrollView>
        </SafeAreaView>
    )
}

const sports: { name: string; icon: SFSymbol }[] = [
  { name: 'Basketball', icon: 'figure.basketball' },
  { name: 'Volleyball', icon: 'figure.volleyball' },
  { name: 'Pickleball', icon: 'figure.pickleball' },
  { name: 'Soccer', icon: 'figure.indoor.soccer' },
  { name: 'Football', icon: 'figure.american.football' },
  { name: 'Badminton', icon: 'figure.badminton' },
  { name: 'Tennis', icon: 'figure.tennis' },
  { name: 'Hockey', icon: 'figure.hockey' },
]

const gamesToday = [1, 2, 3, 4, 5]

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerText: {
    ... Typescale.headlineL,
    marginBottom: 12
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 8
  },
  sportCategoriesContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginBottom: 24
  },
  categoryCard: {
    width: '22%', 
    backgroundColor: '#FFF6F5', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 12, 
    borderRadius: 12
  }
});