import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { logout } from '@/src/redux/slices/userSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';

export default function ProfileView() {
  const dispatch = useAppDispatch();
  const sample_profile = {
    display_picture: "https://res.cloudinary.com/dp0ayty6p/image/upload/v1763485298/samples/istockphoto-1682296067-612x612.jpg",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    // sports with skill levels
    sport_interests: { "Soccer": 2, "Basketball": 3, "Tennis": 1 },
  }

  const [profile, setProfile] = useState(sample_profile);
  const handleEditProfile = () => {
    router.push({
      pathname: "/profile/editProfile" as any,
      params: {
        edit: 'true',
        profileData: JSON.stringify(profile),
      },
    });
  }

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/");
  }

  const getSkillLevelText = (level: number) => {
    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    return levels[level - 1] || "Unknown";
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Your Profile</Text>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePictureWrapper}>
            {profile.display_picture ? (
              <Image
                source={{ uri: profile.display_picture }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Ionicons name="person" size={60} color={Colors.gray600} />
              </View>
            )}
          </View>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>{profile.name}</Text>
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{profile.email}</Text>
        </View>

        {/* Age Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Age</Text>
          <Text style={styles.fieldValue}>{profile.age} years old</Text>
        </View>

        {/* Sport Interests Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Sport Interests</Text>
          <View style={styles.sportsContainer}>
            {Object.entries(profile.sport_interests).map(([sport, level]) => (
              <View key={sport} style={styles.sportTag}>
                <Text style={styles.sportName}>{sport}</Text>
                <Text style={styles.sportLevel}>{getSkillLevelText(level)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.LogoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.LogoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

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
    padding: 12,
    paddingBottom: 24,
    flexGrow: 1
  },
  headerText: {
    ...Typescale.headlineS,
    marginBottom: 24
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  profilePictureWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: Colors.gray200,
    borderWidth: 3,
    borderColor: Colors.primaryLight
  },
  profilePicture: {
    width: '100%',
    height: '100%'
  },
  profilePicturePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray200
  },
  fieldContainer: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300
  },
  fieldLabel: {
    ...Typescale.labelL,
    color: Colors.gray700,
    marginBottom: 8
  },
  fieldValue: {
    ...Typescale.bodyL,
    color: Colors.gray900
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  sportTag: {
    backgroundColor: Colors.primaryWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryVeryLight
  },
  sportName: {
    ...Typescale.bodyM,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginBottom: 4
  },
  sportLevel: {
    ...Typescale.bodyS,
    color: Colors.gray700
  },
  LogoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  LogoutButtonText: {
    ...Typescale.titleM,
    color: 'white',
    fontWeight: '600'
  },
  editProfileButton: {
    backgroundColor: Colors.primaryWhite,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12
  },
  editProfileButtonText: {
    ...Typescale.titleM,
    color: Colors.primaryDark,
    fontWeight: '600'
  }
});
