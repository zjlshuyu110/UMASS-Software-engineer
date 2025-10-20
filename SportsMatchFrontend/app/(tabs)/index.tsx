import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import GameCard from '@/src/components/discover/game-card';
import { SFSymbol } from 'expo-symbols';
import { Game } from '@/src/models/Game';


export default function DiscoverView() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
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
                  <TouchableOpacity style={styles.categoryCard}>
                    <IconSymbol size={40} name="square.grid.2x2.fill" color={'#B23434'}></IconSymbol>
                    <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>More</Text>
                  </TouchableOpacity>
            </View>

            {/* Games Happening Today */}
            <Text style={styles.sectionText}>Happening Today</Text>
            <View style={{ rowGap: 8 }}>
              {gamesToday.map((game, index) => <GameCard key={index} game={game}></GameCard>)}
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
]

const dateTemps = [8, 9, 10, 11, 12, 13, 14, 15].map((hour) => {
  const date = new Date()
  date.setHours(hour)
  return date
})

const gamesToday: Game[] = [
  { name: "Basketball Tournament: Winner Gets $1000!", sportType: "Basketball", creator: "Nam Nguyen", players: [], maxPlayers: 24, status: "open", startAt: dateTemps[0], createdAt: dateTemps[0] },
  { name: "Chill Pickleball Game For Beginners", sportType: "Pickleball", creator: "Sahil Kamath", players: [], maxPlayers: 8, status: "open", startAt: dateTemps[1], createdAt: dateTemps[1]},
  { name: "Volleyball Practice", sportType: "Volleyball", creator: "Kenneth Rodrigues", players: [], maxPlayers: 18, status: "open", startAt: dateTemps[2], createdAt: dateTemps[2]},
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 12, 
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 12 
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
  sectionText: {
    ...Typescale.titleL, 
    marginBottom: 8
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