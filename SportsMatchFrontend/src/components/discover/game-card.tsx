import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Typescale, Colors } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Game } from '@/src/models/Game';

const dateTimeTemp = new Date()
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const formatter = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
  useGrouping: false
});

type GameCardProps = {
    game: Game
}

export default function GameCard({ game }: GameCardProps) {
    return (
        <TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.dateCol}>
                    <Text style={styles.dateSecondary}>{daysOfWeek[dateTimeTemp.getDay()]}</Text>
                    <Text style={styles.datePrimary}>{formatter.format(dateTimeTemp.getMonth())}/{formatter.format(dateTimeTemp.getDate())}</Text>
                    <Text style={styles.dateSecondary}>{formatter.format(game.startAt.getHours())}:{formatter.format(game.startAt.getMinutes())}</Text>
                </View>
                <View style={styles.detailCol}>
                    <Text style={styles.gameTitle} numberOfLines={1} ellipsizeMode='tail'>{ game.name }</Text>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='flame' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>{game.sportType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='location' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>Recreation Center</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='person' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>{ game.players.length } / { game.maxPlayers}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.gray400,
        borderRadius: 12,
        columnGap: 12,
    },
    dateCol: {
        alignItems: 'center', 
        justifyContent: 'center',
        width: 60
    },
    datePrimary: {
        ...Typescale.titleL
    },
    dateSecondary: {
        ...Typescale.labelL
    },
    detailCol: {
        flex: 1,
        rowGap: 2
    },
    gameTitle: {
        ...Typescale.titleM,
        flexShrink: 1,
        marginBottom: 4
    },
    gameDetail: {
        ...Typescale.labelS,
        color: Colors.gray700
    },
    detailRow: {
        flexDirection: 'row', 
        columnGap: 8
    }

})