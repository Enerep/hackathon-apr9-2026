import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  StyleSheet, FlatList,
} from 'react-native';
import { Camera as CameraIcon, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../components/Toast';
import { colors, moderateScale, fontScale, wp } from '../theme';

const FILTERS = [
  { name: 'Natural' },
  { name: 'Warm' },
  { name: 'Fade' },
  { name: 'Grain' },
];

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Natural');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [posted, setPosted] = useState(false);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    setPosted(true);
    showToast('Your moment has been shared ✨');
    setTimeout(() => {
      setImage(null);
      setCaption('');
      setLocation('');
      setIsAI(false);
      setPosted(false);
    }, 2000);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share a moment</Text>
        <Text style={styles.headerSub}>Something real, something yours.</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!image ? (
          <TouchableOpacity onPress={pickImage} style={styles.pickBtn} activeOpacity={0.7}>
            <View style={styles.pickIconWrap}>
              <CameraIcon size={moderateScale(32)} strokeWidth={1.2} color={`${colors.brown}66`} />
            </View>
            <Text style={styles.pickText}>Tap to choose a photo</Text>
            <Text style={styles.pickHint}>JPG, PNG, HEIC</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editContainer}>
            <View style={styles.previewWrap}>
              <Image source={{ uri: image }} style={styles.preview} />
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={FILTERS}
              keyExtractor={(f) => f.name}
              contentContainerStyle={styles.filtersRow}
              renderItem={({ item: f }) => (
                <TouchableOpacity
                  onPress={() => setActiveFilter(f.name)}
                  style={[
                    styles.filterBtn,
                    activeFilter === f.name ? styles.filterBtnActive : styles.filterBtnInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === f.name ? styles.filterTextActive : styles.filterTextInactive,
                    ]}
                  >
                    {f.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              placeholderTextColor={`${colors.brown}66`}
              multiline
              numberOfLines={3}
              style={styles.captionInput}
            />

            <View style={styles.locationInputWrap}>
              <MapPin size={moderateScale(16)} color={`${colors.brown}66`} style={styles.locationIcon} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Add location (optional)"
                placeholderTextColor={`${colors.brown}66`}
                style={styles.locationInput}
              />
            </View>

            <View style={styles.aiCard}>
              <View style={styles.aiCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiLabel}>Is this AI-assisted?</Text>
                  <Text style={styles.aiSub}>Be honest — the community appreciates it.</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsAI(!isAI)}
                  style={[styles.toggle, isAI ? styles.toggleOn : styles.toggleOff]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleThumb, isAI ? styles.thumbOn : styles.thumbOff]} />
                </TouchableOpacity>
              </View>
              {isAI && (
                <View style={styles.aiWarning}>
                  <Text style={styles.aiWarningText}>
                    Your post will be labeled as AI-generated and may be blurred in other feeds.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handlePost}
              disabled={posted}
              style={[styles.shareBtn, posted && styles.shareBtnDisabled]}
              activeOpacity={0.8}
            >
              <Text style={styles.shareBtnText}>
                {posted ? 'Sharing...' : 'Share moment'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
  },
  headerTitle: { fontStyle: 'italic', fontSize: fontScale(20), color: colors.dark, fontWeight: '700' },
  headerSub: { fontSize: fontScale(11), color: `${colors.brown}80`, marginTop: moderateScale(2) },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(12), paddingBottom: moderateScale(32) },
  pickBtn: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `${colors.tan}66`,
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(12),
    backgroundColor: `${colors.paper}80`,
  },
  pickIconWrap: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: 9999,
    backgroundColor: `${colors.tan}26`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickText: { fontSize: fontScale(14), color: `${colors.brown}80`, fontWeight: '500' },
  pickHint: { fontSize: fontScale(11), color: `${colors.brown}4D` },
  editContainer: { gap: moderateScale(12) },
  previewWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  preview: { width: '100%', height: '100%' },
  filtersRow: { gap: moderateScale(8), paddingVertical: moderateScale(4) },
  filterBtn: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    borderRadius: 9999,
  },
  filterBtnActive: { backgroundColor: colors.brown },
  filterBtnInactive: { backgroundColor: colors.paper, borderWidth: 1, borderColor: `${colors.tan}4D` },
  filterText: { fontSize: fontScale(14), fontWeight: '500' },
  filterTextActive: { color: colors.cream },
  filterTextInactive: { color: `${colors.brown}99` },
  captionInput: {
    width: '100%',
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    fontSize: fontScale(14),
    color: colors.dark,
    textAlignVertical: 'top',
    minHeight: moderateScale(80),
  },
  locationInputWrap: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  locationIcon: { position: 'absolute', left: moderateScale(12), zIndex: 1 },
  locationInput: {
    flex: 1,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: 9999,
    paddingLeft: moderateScale(36),
    paddingRight: moderateScale(16),
    paddingVertical: moderateScale(10),
    fontSize: fontScale(14),
    color: colors.dark,
  },
  aiCard: {
    backgroundColor: colors.paper,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
  },
  aiCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: moderateScale(16) },
  aiLabel: { fontSize: fontScale(14), fontWeight: '500', color: colors.dark },
  aiSub: { fontSize: fontScale(11), color: `${colors.brown}80`, marginTop: moderateScale(2) },
  toggle: { width: moderateScale(48), height: moderateScale(28), borderRadius: 9999, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.aiYellow },
  toggleOff: { backgroundColor: `${colors.tan}66` },
  toggleThumb: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: 9999,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: { marginLeft: moderateScale(22) },
  thumbOff: { marginLeft: moderateScale(2) },
  aiWarning: {
    marginTop: moderateScale(10),
    backgroundColor: `${colors.aiYellowBg}99`,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  aiWarningText: { fontSize: fontScale(12), color: `${colors.dark}B3` },
  shareBtn: {
    width: '100%',
    backgroundColor: colors.brown,
    paddingVertical: moderateScale(14),
    borderRadius: 9999,
    alignItems: 'center',
  },
  shareBtnDisabled: { opacity: 0.5 },
  shareBtnText: { color: colors.cream, fontWeight: '600', fontSize: fontScale(16) },
});
