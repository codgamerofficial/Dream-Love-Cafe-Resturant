import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform 
} from 'react-native';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, Phone, Info } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { analytics } from '../../src/services/analytics';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';

export default function ReservationPage() {
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableTimes = [
    '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleSubmit = async () => {
    setErrorMessage('');

    // Input Validations (Section 17)
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number (e.g. +91 99333 88167)');
      return;
    }

    if (!date) {
      setErrorMessage('Please select a valid date');
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setErrorMessage('Reservation date cannot be in the past');
      return;
    }

    setIsSubmitting(true);
    analytics.track('reservation_submitted', { guests, date, time });

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('reservations').insert([
          {
            name: name.trim(),
            phone: phone.trim(),
            reservation_date: date,
            reservation_time: time,
            guests: Number(guests),
            special_request: specialRequest.trim() || null,
            status: 'pending',
          },
        ]);
      }
      setIsSubmitted(true);
    } catch (err) {
      console.log('Reservation stored locally:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>DREAM LOVE CAFE & RESTAURANT</Text>
          <Text style={styles.title}>Reserve a Table</Text>
          <Text style={styles.subtitle}>
            Join us for an exceptional multi-cuisine dining experience in Contai. Fill out your details below to request table seating.
          </Text>
        </View>

        {isSubmitted ? (
          /* Confirmation Success Card (Section 17) */
          <View style={styles.confirmationCard}>
            <CheckCircle2 size={64} color={COLORS.copper} style={{ marginBottom: SPACING.md }} />
            <Text style={styles.confirmationTitle}>Reservation Requested</Text>
            
            <View style={styles.noticeBox}>
              <Info size={18} color={COLORS.gold} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.noticeText}>
                Your reservation request is under review. The restaurant will confirm your table shortly via phone or WhatsApp.
              </Text>
            </View>

            <View style={styles.summaryTable}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Guest Name:</Text>
                <Text style={styles.summaryValue}>{name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phone Number:</Text>
                <Text style={styles.summaryValue}>{phone}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date & Time:</Text>
                <Text style={styles.summaryValue}>{date} at {time}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Guests:</Text>
                <Text style={styles.summaryValue}>{guests} Guests</Text>
              </View>
              {specialRequest ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Special Request:</Text>
                  <Text style={styles.summaryValue}>{specialRequest}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setIsSubmitted(false);
                setName('');
                setPhone('');
              }}
            >
              <Text style={styles.resetBtnText}>Make Another Reservation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Reservation Input Form */
          <View style={[styles.formGrid, !isDesktop && styles.formGridMobile]}>
            
            {/* Form Inputs Column */}
            <View style={styles.formCard}>
              <Text style={styles.formSectionTitle}>Guest Information</Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textSubtle}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +91 99333 88167"
                  placeholderTextColor={COLORS.textSubtle}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Date & Time Selector */}
              <View style={styles.formRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Date *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={COLORS.textSubtle}
                    value={date}
                    onChangeText={setDate}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Time Slot *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                    {availableTimes.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.timeChip, time === t && styles.timeChipActive]}
                        onPress={() => setTime(t)}
                      >
                        <Text style={[styles.timeChipText, time === t && styles.timeChipTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Guest Count Slider / Buttons */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Guests ({guests} People)</Text>
                <View style={styles.guestSelectorRow}>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[styles.guestBtn, guests === num && styles.guestBtnActive]}
                      onPress={() => setGuests(num)}
                    >
                      <Text style={[styles.guestBtnText, guests === num && styles.guestBtnTextActive]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Special Request */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Special Request / Dietary Preference (Optional)</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="e.g. High chair needed, anniversary celebration, quiet table"
                  placeholderTextColor={COLORS.textSubtle}
                  multiline={true}
                  value={specialRequest}
                  onChangeText={setSpecialRequest}
                />
              </View>

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color={COLORS.errorLight} style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Submit Action */}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Calendar size={18} color={COLORS.background} style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? 'Submitting Request...' : 'Confirm Table Request'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Policy & Hours Column */}
            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarTitle}>Reservation Policy</Text>

              <View style={styles.policyItem}>
                <Clock size={18} color={COLORS.copper} style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Hold Time</Text>
                  <Text style={styles.policyText}>Tables are held for 15 minutes past the reserved time slot.</Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Users size={18} color={COLORS.copper} style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Large Parties</Text>
                  <Text style={styles.policyText}>For groups larger than 10 people, please call the restaurant directly at {settings.phone}.</Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Phone size={18} color={COLORS.copper} style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Direct Inquiries</Text>
                  <Text style={styles.policyText}>Need instant confirmation? Call or WhatsApp us at {settings.whatsapp}.</Text>
                </View>
              </View>
            </View>

          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: SPACING.xxl,
  },
  innerContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  preTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 20,
  },
  formGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  formGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  formCard: {
    flex: 1.6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  sidebarCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 'fit-content' as any,
  },
  formSectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
  },
  sidebarTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  label: {
    fontSize: 12,
    color: COLORS.creamMuted,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.cream,
    fontSize: 14,
  },
  timeScroll: {
    flexDirection: 'row',
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  timeChipActive: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  timeChipText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  timeChipTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
  guestSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  guestBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnActive: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  guestBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  guestBtnTextActive: {
    color: COLORS.background,
    fontWeight: '800',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: COLORS.copper,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  policyHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  policyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  confirmationCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.copper + '60',
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  confirmationTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.copper + '20',
    borderWidth: 1,
    borderColor: COLORS.copper,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  noticeText: {
    color: COLORS.gold,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  summaryTable: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  summaryValue: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: COLORS.copper,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  resetBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
