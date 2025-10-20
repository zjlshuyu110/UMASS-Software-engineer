import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Typescale, Colors } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';

const dateTimeTemp = new Date()
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GameCard() {
    return (
        <TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.dateCol}>
                    <Text>{daysOfWeek[dateTimeTemp.getDay()]}</Text>
                    <Text style={{ ...Typescale.titleL }}>{dateTimeTemp.getMonth()}/{dateTimeTemp.getDate()}</Text>
                </View>
                <View style={styles.detailCol}>
                    <Text style={styles.gameTitle} numberOfLines={2} ellipsizeMode='tail'>Pickleball Tournament: Winner Gets $1000</Text>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='flame' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>Pickleball</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='location' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>Recreation Center</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='person.3' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>4 / 12</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol size={12} name='person' color={Colors.gray600}></IconSymbol>
                        <Text style={styles.gameDetail}>Nam Nguyen</Text>
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
        width: 48
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