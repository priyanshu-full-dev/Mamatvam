import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Wallet,
  Landmark,
  Lock,
  Info,
  CheckCircle2,
  Heart,
  Receipt,
  Sparkles,
} from 'lucide-react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plan?: string; price?: string }>();

  const isMonthly = params.plan === 'monthly';
  const planTitle = isMonthly ? 'Monthly Plan' : 'Annual Plan';
  const planBillingCycle = isMonthly ? '/month' : '/year';
  const planPrice = params.price || '99';

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('card');

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [upiId, setUpiId] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Processing & Success Modal states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiryDate(`${cleaned.slice(0, 2)} / ${cleaned.slice(2, 4)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessModalVisible(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Order Summary Card */}
        <View style={styles.summaryCard}>
          {/* Logo Row */}
          <View style={styles.logoRow}>
            <View style={styles.logoIconBadge}>
              <Heart size={16} color="#EE4D38" fill="#EE4D38" />
            </View>
            <View>
              <Text style={styles.logoTitle}>MAMATVAM</Text>
              <Text style={styles.logoSubtitle}>Healthy Mother | Happy Family</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          {/* Plan Details & Price */}
          <View style={styles.summaryPlanRow}>
            <View style={styles.summaryPlanInfo}>
              <Text style={styles.summaryPlanName}>
                {planTitle}{' '}
                <Text style={styles.summaryPlanBadge}>(All 4 Courses)</Text>
              </Text>
              <Text style={styles.summaryPlanDesc}>
                Try To Conceive + Pregnancy + Post Pregnancy + IUI/IVF
              </Text>
            </View>

            <View style={styles.summaryPriceCol}>
              <Text style={styles.summaryPriceNumber}>
                ₹ {planPrice}
                <Text style={styles.summaryPriceUnit}>{planBillingCycle}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Select Payment Method Section */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <View style={styles.methodsContainer}>
          {/* Option 1: Credit / Debit Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPaymentMethod('card')}
            style={[
              styles.methodItem,
              paymentMethod === 'card' && styles.methodItemSelected,
            ]}
          >
            <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioCircleActive]}>
              {paymentMethod === 'card' && <View style={styles.radioInnerDot} />}
            </View>

            <View style={[styles.methodIconBadge, { backgroundColor: '#EFF6FF' }]}>
              <CreditCard size={18} color="#2563EB" strokeWidth={2.2} />
            </View>

            <View style={styles.methodTextCol}>
              <Text style={styles.methodTitle}>Credit / Debit Card</Text>
              <Text style={styles.methodSub}>Visa, Mastercard, Rupay</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Option 2: UPI */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPaymentMethod('upi')}
            style={[
              styles.methodItem,
              paymentMethod === 'upi' && styles.methodItemSelected,
            ]}
          >
            <View style={[styles.radioCircle, paymentMethod === 'upi' && styles.radioCircleActive]}>
              {paymentMethod === 'upi' && <View style={styles.radioInnerDot} />}
            </View>

            <View style={[styles.methodIconBadge, { backgroundColor: '#FEF3C7' }]}>
              <Sparkles size={18} color="#D97706" strokeWidth={2.2} />
            </View>

            <View style={styles.methodTextCol}>
              <Text style={styles.methodTitle}>UPI</Text>
              <Text style={styles.methodSub}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Option 3: Wallet */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPaymentMethod('wallet')}
            style={[
              styles.methodItem,
              paymentMethod === 'wallet' && styles.methodItemSelected,
            ]}
          >
            <View style={[styles.radioCircle, paymentMethod === 'wallet' && styles.radioCircleActive]}>
              {paymentMethod === 'wallet' && <View style={styles.radioInnerDot} />}
            </View>

            <View style={[styles.methodIconBadge, { backgroundColor: '#F0FDFA' }]}>
              <Wallet size={18} color="#0D9488" strokeWidth={2.2} />
            </View>

            <View style={styles.methodTextCol}>
              <Text style={styles.methodTitle}>Wallet</Text>
              <Text style={styles.methodSub}>Paytm, Mobikwik, Amazon Pay</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Option 4: Net Banking */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPaymentMethod('netbanking')}
            style={[
              styles.methodItem,
              paymentMethod === 'netbanking' && styles.methodItemSelected,
            ]}
          >
            <View style={[styles.radioCircle, paymentMethod === 'netbanking' && styles.radioCircleActive]}>
              {paymentMethod === 'netbanking' && <View style={styles.radioInnerDot} />}
            </View>

            <View style={[styles.methodIconBadge, { backgroundColor: '#F1F5F9' }]}>
              <Landmark size={18} color="#475569" strokeWidth={2.2} />
            </View>

            <View style={styles.methodTextCol}>
              <Text style={styles.methodTitle}>Net Banking</Text>
              <Text style={styles.methodSub}>All Major Banks</Text>
            </View>

            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* 3. Card Details Form (When Card is selected) */}
        {paymentMethod === 'card' && (
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Card Details</Text>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.textInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                />
                <CreditCard size={18} color="#94A3B8" style={styles.inputRightIcon} />
              </View>
            </View>

            {/* Expiry Date & CVV Row */}
            <View style={styles.inputRow}>
              {/* Expiry Date */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM / YY"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={7}
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                />
              </View>

              {/* CVV */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                  <Info size={16} color="#94A3B8" style={styles.inputRightIcon} />
                </View>
              </View>
            </View>

            {/* Name on Card */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name on Card</Text>
              <TextInput
                style={styles.textInput}
                placeholder="As on your card"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                value={nameOnCard}
                onChangeText={setNameOnCard}
              />
            </View>
          </View>
        )}

        {/* UPI Details Form (When UPI is selected) */}
        {paymentMethod === 'upi' && (
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>UPI ID</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter UPI ID / VPA</Text>
              <TextInput
                style={styles.textInput}
                placeholder="mobileNumber@upi / username@okaxis"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={upiId}
                onChangeText={setUpiId}
              />
            </View>
          </View>
        )}

        {/* 4. Billing Details Form */}
        <View style={styles.formSection}>
          <View style={styles.billingHeaderRow}>
            <Receipt size={17} color="#EE4D38" strokeWidth={2.4} style={{ marginRight: 6 }} />
            <Text style={styles.formSectionTitle}>Billing Details</Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>
        </View>

        {/* 5. Total Amount Row */}
        <View style={styles.totalAmountRow}>
          <Text style={styles.totalAmountLabel}>Total Amount</Text>
          <Text style={styles.totalAmountValue}>₹ {planPrice}</Text>
        </View>

        {/* 6. Pay Now Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isProcessing}
          onPress={handlePayNow}
          style={styles.payNowButton}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.payNowBtnContent}>
              <Lock size={17} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
              <Text style={styles.payNowButtonText}>Pay Now</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 7. Terms & Conditions Footnote */}
        <View style={styles.termsFooter}>
          <Text style={styles.termsText}>
            By proceeding, you agree to our{' '}
            <Text
              onPress={() => router.push('/privacy')}
              style={styles.termsLink}
            >
              Terms & Conditions
            </Text>
            {'\n'}and{' '}
            <Text
              onPress={() => router.push('/privacy')}
              style={styles.termsLink}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconBadge}>
              <CheckCircle2 size={44} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalDesc}>
              Welcome to Mamatvam Premium! Your {planTitle} is now active. All 4 courses, expert support, and daily utilities are unlocked.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setIsSuccessModalVisible(false);
                router.replace('/(tabs)/home');
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  navHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#EE4D38',
    letterSpacing: 0.6,
  },
  logoSubtitle: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#FEE2E2',
    marginVertical: 10,
  },
  summaryPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryPlanInfo: {
    flex: 1,
    paddingRight: 10,
  },
  summaryPlanName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  summaryPlanBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  summaryPlanDesc: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  summaryPriceCol: {
    alignItems: 'flex-end',
  },
  summaryPriceNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  summaryPriceUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  methodsContainer: {
    marginBottom: 16,
  },
  methodItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  methodItemSelected: {
    borderColor: '#EE4D38',
    backgroundColor: '#FFFBFB',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleActive: {
    borderColor: '#EE4D38',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EE4D38',
  },
  methodIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  methodTextCol: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  methodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  formSection: {
    marginBottom: 16,
  },
  billingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: '#1E293B',
  },
  inputRightIcon: {
    position: 'absolute',
    right: 14,
  },
  totalAmountRow: {
    backgroundColor: '#FFF6F4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFE4DE',
    marginTop: 6,
    marginBottom: 16,
  },
  totalAmountLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  payNowButton: {
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  payNowBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  termsFooter: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 10,
  },
  termsText: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#EE4D38',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  successIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#EE4D38',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
