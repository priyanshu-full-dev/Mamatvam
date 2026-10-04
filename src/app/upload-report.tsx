import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Stethoscope,
  X,
  CheckCircle2,
  FileCheck,
} from 'lucide-react-native';

interface SelectedFile {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
}

const CATEGORIES = [
  { id: 'blood', label: 'Blood Test', icon: '🩸', activeBg: '#FFF1F2', activeBorder: '#FECDD3', activeColor: '#E11D48' },
  { id: 'ultrasound', label: 'Ultrasound', icon: '📷', activeBg: '#EFF6FF', activeBorder: '#BFDBFE', activeColor: '#2563EB' },
  { id: 'prescription', label: 'Prescription', icon: '💊', activeBg: '#FEF9C3', activeBorder: '#FEF08A', activeColor: '#A16207' },
  { id: 'urine', label: 'Urine Test', icon: '🧪', activeBg: '#F0FDF4', activeBorder: '#BBF7D0', activeColor: '#16A34A' },
  { id: 'vaccination', label: 'Vaccination', icon: '💉', activeBg: '#FAF5FF', activeBorder: '#E9D5FF', activeColor: '#7E22CE' },
  { id: 'other', label: 'Other', icon: '📄', activeBg: '#F1F5F9', activeBorder: '#CBD5E1', activeColor: '#475569' },
];

export default function UploadReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form State
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [reportName, setReportName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('blood');
  const [testDate, setTestDate] = useState('Oct 4, 2026');
  const [pregWeek, setPregWeek] = useState('28');
  const [doctorLab, setDoctorLab] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // File Picker Options Modal / Sheet
  const handleSelectFile = () => {
    Alert.alert(
      'Select Document or Photo',
      'Choose the source for your medical report:',
      [
        {
          text: 'PDF / Document',
          onPress: pickDocument,
        },
        {
          text: 'Gallery Photo',
          onPress: pickImage,
        },
        {
          text: 'Take Photo with Camera',
          onPress: takePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
        });
        if (!reportName) {
          // Pre-fill report name from file if empty
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          setReportName(cleanName);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to pick document. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo access to upload reports.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || 'Lab_Report_Scan.jpg';
        setSelectedFile({
          name: fileName,
          size: asset.fileSize,
          uri: asset.uri,
          mimeType: 'image/jpeg',
        });
        if (!reportName) {
          setReportName('Medical Report Scan');
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow camera access to take photo of reports.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          name: 'Camera_Report_Scan.jpg',
          size: asset.fileSize,
          uri: asset.uri,
          mimeType: 'image/jpeg',
        });
        if (!reportName) {
          setReportName('Medical Report Scan');
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to access camera.');
    }
  };

  const handleUploadSubmit = () => {
    if (!reportName.trim()) {
      Alert.alert('Report Name Required', 'Please enter a name for this medical report.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Report Uploaded Successfully! 🎉',
        `"${reportName}" has been safely encrypted and saved to your pregnancy health records.`,
        [
          {
            text: 'View Records',
            onPress: () => router.back(),
          },
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1200);
  };

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Upload Report</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 80 }]}
      >
        {/* File Upload Dropzone Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSelectFile}
          style={[
            styles.uploadDropzone,
            selectedFile && styles.uploadDropzoneActive,
          ]}
        >
          {selectedFile ? (
            <View style={styles.fileSelectedRow}>
              <View style={styles.fileIconBadge}>
                <FileCheck size={24} color="#0284C7" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSubtext}>
                  {selectedFile.size
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload`
                    : 'File ready to upload'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                style={styles.removeFileBtn}
              >
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dropzonePlaceholder}>
              <View style={styles.uploadIconCircle}>
                <Upload size={22} color="#0284C7" strokeWidth={2.4} />
              </View>
              <Text style={styles.dropzoneTitle}>Tap to select file</Text>
              <Text style={styles.dropzoneSubtitle}>PDF, JPG, PNG, DOC supported</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 1. Report Name * */}
        <Text style={styles.fieldLabel}>Report Name *</Text>
        <View style={styles.inputContainer}>
          <FileText size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="e.g. CBC Blood Test - Week 28"
            placeholderTextColor="#94A3B8"
            value={reportName}
            onChangeText={setReportName}
            style={styles.textInput}
          />
        </View>

        {/* 2. Category * */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected
                    ? {
                        backgroundColor: cat.activeBg,
                        borderColor: cat.activeBorder,
                      }
                    : styles.categoryPillUnselected,
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 6 }}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected
                      ? { color: cat.activeColor, fontWeight: '700' }
                      : { color: '#64748B' },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Test Date * and Preg. Week */}
        <View style={styles.rowTwoFields}>
          {/* Test Date */}
          <View style={{ flex: 1.5, marginRight: 10 }}>
            <Text style={styles.fieldLabel}>Test Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={testDate}
                onChangeText={setTestDate}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Pregnancy Week */}
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Preg. Week</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="e.g. 28"
                placeholderTextColor="#94A3B8"
                value={pregWeek}
                onChangeText={setPregWeek}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>
          </View>
        </View>

        {/* 4. Doctor / Lab Name */}
        <Text style={styles.fieldLabel}>Doctor / Lab Name</Text>
        <View style={styles.inputContainer}>
          <Stethoscope size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="e.g. Dr. Kavitha Sharma / Apollo Labs"
            placeholderTextColor="#94A3B8"
            value={doctorLab}
            onChangeText={setDoctorLab}
            style={styles.textInput}
          />
        </View>

        {/* 5. Notes / Remarks */}
        <Text style={styles.fieldLabel}>Notes / Remarks</Text>
        <View style={styles.multilineContainer}>
          <TextInput
            placeholder="Key findings, doctor's remarks..."
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.multilineInput}
          />
        </View>
      </ScrollView>

      {/* Bottom Floating Upload Button (Matching Image) */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUploadSubmit}
          disabled={isUploading}
          style={styles.uploadButtonWrapper}
        >
          <LinearGradient
            colors={['#93C5FD', '#7DD3FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadGradientButton}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.uploadButtonContent}>
                <Upload size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 8 }} />
                <Text style={styles.uploadButtonText}>Upload Report</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FAF9F6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  uploadDropzone: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadDropzoneActive: {
    borderStyle: 'solid',
    borderColor: '#38BDF8',
    backgroundColor: '#F0F9FF',
    paddingVertical: 18,
  },
  dropzonePlaceholder: {
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
  },
  dropzoneSubtitle: {
    fontSize: 12,
    color: '#60A5FA',
    marginTop: 4,
    fontWeight: '500',
  },
  fileSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  fileIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  fileSubtext: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  removeFileBtn: {
    padding: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    padding: 0,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  categoryPillUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rowTwoFields: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multilineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 96,
    marginBottom: 20,
  },
  multilineInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    padding: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FAF9F6',
  },
  uploadButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  uploadGradientButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
