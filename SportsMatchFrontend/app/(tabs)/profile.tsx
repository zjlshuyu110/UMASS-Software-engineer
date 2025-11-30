import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { logout } from '@/src/redux/slices/userSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { getProfileAsync, checkProfileAsync, ProfileData } from '@/src/apiCalls/profile';
import { getSkillLevelLabel } from '@/constants/skillLevels';

export default function ProfileView() {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const checkResult = await checkProfileAsync();
      if (checkResult.hasProfile) {
        const profileData = await getProfileAsync();
        setProfile(profileData);
      } else {
        // No profile exists, redirect to create
        Alert.alert(
          "No Profile",
          "You don't have a profile yet. Would you like to create one?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Create Profile",
              onPress: () => {
                router.push({
                  pathname: "/profile/editProfile" as any,
                });
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      router.push({
        pathname: "/profile/editProfile" as any,
        params: {
          edit: 'true',
        },
      });
    }
  }

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/");
  }


  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.gray600} />
          <Text style={styles.errorText}>{error || "No profile found"}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              router.push({
                pathname: "/profile/editProfile" as any,
              });
            }}
          >
            <Text style={styles.createButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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
          {Object.keys(profile.sport_interests).length > 0 ? (
            <View style={styles.sportsContainer}>
              {Object.entries(profile.sport_interests).map(([sport, level]) => (
                <View key={sport} style={styles.sportTag}>
                  <Text style={styles.sportName}>{sport}</Text>
                  <Text style={styles.sportLevel}>{getSkillLevelLabel(level)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noSportsText}>No sport interests added yet</Text>
          )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typescale.bodyM,
    color: Colors.gray700,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    ...Typescale.bodyL,
    color: Colors.gray700,
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  retryButtonText: {
    ...Typescale.titleM,
    color: 'white',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: Colors.primaryWhite,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  createButtonText: {
    ...Typescale.titleM,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  noSportsText: {
    ...Typescale.bodyM,
    color: Colors.gray600,
    fontStyle: 'italic',
    marginTop: 8,
  }
});
