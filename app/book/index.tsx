import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform,
  ActivityIndicator,
  Linking
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Info, 
  MessageSquare, 
  CalendarPlus, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { analytics } from '../../src/services/analytics';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';
import {
  getKolkataCurrentDate,
  generateTimeSlots,
  formatTime12Hour,
  formatDisplayDate,
  normalizeIndianPhoneNumber,
  generateReservationReference,
  formatWhatsAppReservationMessage,
  generateGoogleCalendarLink,
  TimeSlot
} from '../../src/utils/reservation';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

export default function ReservationPage() {
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 860;
  const isTablet = width >= 600 && width < 860;

  // Initialize date dynamically in Asia/Kolkata timezone
  const todayDate = useMemo(() => getKolkataCurrentDate(), []);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(todayDate);
  const [time, setTime] = useState('19:30'); // Default to 7:30 PM (dinner)
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');

  // UI & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<{
    referenceCode: string;
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  } | null>(null);

  // Generate responsive time slots
  const availableSlots: TimeSlot[] = useMemo(() => {
    return generateTimeSlots(date);
  }, [date]);

  // Ensure selected time is valid for the selected date
  useEffect(() => {
    const selectedSlot = availableSlots.find(s => s.time24 === time);
    if (!selectedSlot || !selectedSlot.isAvailable) {
      const firstAvailable = availableSlots.find(s => s.isAvailable);
      if (firstAvailable) {
        setTime(firstAvailable.time24);
      }
    }
  }, [availableSlots, time]);

  // Validation
  const validateForm = (): { isValid: boolean; normalizedPhone?: string; error?: string } => {
    if (!name.trim() || name.trim().length < 2) {
      return { isValid: false, error: 'Please enter your full name.' };
    }

    const phoneResult = normalizeIndianPhoneNumber(phone);
    if (!phoneResult.isValid) {
      return { isValid: false, error: phoneResult.error || 'Please enter a valid phone number.' };
    }

    if (!date) {
      return { isValid: false, error: 'Please select a reservation date.' };
    }

    if (date < todayDate) {
      return { isValid: false, error: 'Reservation date cannot be in the past.' };
    }

    if (!time) {
      return { isValid: false, error: 'Please select a preferred time slot.' };
    }

    const currentSlot = availableSlots.find(s => s.time24 === time);
    if (currentSlot && !currentSlot.isAvailable) {
      return { isValid: false, error: 'The selected time slot is not available. Please pick another time.' };
    }

    if (!guests || guests < 1) {
      return { isValid: false, error: 'Please select the number of guests.' };
    }

    return { isValid: true, normalizedPhone: phoneResult.normalized };
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    const validation = validateForm();
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please fill in all required fields.');
      return;
    }

    const normalizedPhone = validation.normalizedPhone || phone.trim();
    const referenceCode = generateReservationReference();

    setIsSubmitting(true);
    analytics.track('reservation_submitted', { guests, date, time });

    try {
      if (isSupabaseConfigured && supabase) {
        // Prevent duplicate spam submissions within 5 minutes
        const { data: existing } = await supabase
          .from('reservations')
          .select('id')
          .eq('phone', normalizedPhone)
          .eq('date', date)
          .eq('time', time)
          .maybeSingle();

        if (existing) {
          setErrorMessage('A reservation request with this phone number, date, and time already exists.');
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase.from('reservations').insert([
          {
            name: name.trim(),
            phone: normalizedPhone,
            date: date,
            time: time,
            guests: Number(guests),
            special_request: specialRequest.trim() || null,
            status: 'pending',
            reference_code: referenceCode,
            source: 'website',
          },
        ]);

        if (error) {
          console.error('Supabase reservation error:', error);
          setErrorMessage(`We couldn't save your reservation right now. Please call us at ${settings.phone} or reserve via WhatsApp.`);
          setIsSubmitting(false);
          return;
        }
      }

      // Success
      setConfirmedReservation({
        referenceCode,
        name: name.trim(),
        phone: normalizedPhone,
        date,
        time,
        guests: Number(guests),
        specialRequest: specialRequest.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Reservation submission error:', err);
      setErrorMessage(`We couldn't complete your reservation request. Please contact the restaurant directly at ${settings.phone}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setConfirmedReservation(null);
    setName('');
    setPhone('');
    setSpecialRequest('');
    setErrorMessage('');
  };

  const handleCall = () => {
    Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`);
  };

  const handleWhatsAppInquiry = () => {
    Linking.openURL(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        {/* Header Section */}
        <View style={styles.headerBox}>
          <Text style={styles.eyebrow}>DREAM LOVE CAFE & RESTAURANT</Text>
          <Text style={styles.title}>Reserve a Table</Text>
          <Text style={styles.subtitle}>
            Join us for a relaxed multi-cuisine dining experience in Contai. Choose your preferred date, time and party size below.
          </Text>
        </View>

        {isSubmitted && confirmedReservation ? (
          /* ── Premium Confirmation Success Screen ── */
          <View style={styles.confirmationCard}>
            <View style={styles.successIconBox}>
              <CheckCircle2 size={44} color={COLORS.brandTurquoise} />
            </View>

            <Text style={styles.confirmationTitle}>Reservation Received</Text>
            <Text style={styles.confirmationGreeting}>
              Thank you, <Text style={styles.highlightText}>{confirmedReservation.name}</Text>. We've received your table reservation request.
            </Text>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <Clock size={15} color={COLORS.copper} style={{ marginRight: 6 }} />
              <Text style={styles.statusBadgeText}>Status: Pending Confirmation</Text>
            </View>

            <View style={styles.noticeBox}>
              <Info size={16} color={COLORS.gold} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.noticeText}>
                Our restaurant team will review your request and confirm your table seating via WhatsApp or phone.
              </Text>
            </View>

            {/* Reservation Summary Table */}
            <View style={styles.summaryTable}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Reservation ID</Text>
                <Text style={styles.summaryRefValue}>{confirmedReservation.referenceCode}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>{formatDisplayDate(confirmedReservation.date, true)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{formatTime12Hour(confirmedReservation.time)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Party Size</Text>
                <Text style={styles.summaryValue}>{confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Contact Phone</Text>
                <Text style={styles.summaryValue}>{confirmedReservation.phone}</Text>
              </View>
              {confirmedReservation.specialRequest ? (
                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryLabel}>Special Request</Text>
                  <Text style={[styles.summaryValue, { flex: 1, textAlign: 'right' }]}>{confirmedReservation.specialRequest}</Text>
                </View>
              ) : null}
            </View>

            {/* Confirmation Actions */}
            <View style={styles.confirmationActions}>
              {/* WhatsApp Restaurant */}
              <TouchableOpacity
                style={styles.whatsAppBtn}
                onPress={() => {
                  const { link } = formatWhatsAppReservationMessage({
                    name: confirmedReservation.name,
                    phone: confirmedReservation.phone,
                    date: confirmedReservation.date,
                    time: confirmedReservation.time,
                    guests: confirmedReservation.guests,
                    referenceCode: confirmedReservation.referenceCode,
                    specialRequest: confirmedReservation.specialRequest,
                    targetPhone: settings.whatsapp,
                  });
                  Linking.openURL(link);
                }}
                activeOpacity={0.85}
              >
                <MessageSquare size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.whatsAppBtnText}>WhatsApp Restaurant</Text>
              </TouchableOpacity>

              {/* Add to Calendar */}
              <TouchableOpacity
                style={styles.calendarBtn}
                onPress={() => {
                  const calUrl = generateGoogleCalendarLink({
                    name: confirmedReservation.name,
                    date: confirmedReservation.date,
                    time: confirmedReservation.time,
                    guests: confirmedReservation.guests,
                    referenceCode: confirmedReservation.referenceCode,
                  });
                  Linking.openURL(calUrl);
                }}
                activeOpacity={0.85}
              >
                <CalendarPlus size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.calendarBtnText}>Add to Calendar</Text>
              </TouchableOpacity>

              {/* Reset / Make Another */}
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Text style={styles.resetBtnText}>Make Another Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── Main 2-Column Responsive Layout ── */
          <View style={[styles.layoutGrid, !isDesktop && styles.layoutGridMobile]}>
            
            {/* Left Column: Reservation Form */}
            <View style={styles.formCard}>
              <Text style={styles.formSectionTitle}>Reservation Details</Text>

              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.textSubtle}
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                  editable={!isSubmitting}
                />
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +91 99333 88167"
                  placeholderTextColor={COLORS.textSubtle}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  autoComplete="tel"
                  editable={!isSubmitting}
                />
              </View>

              {/* Date Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reservation Date *</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    min={todayDate}
                    value={date}
                    onChange={(e: any) => setDate(e.target.value)}
                    style={{
                      backgroundColor: COLORS.surface,
                      border: `1px solid ${COLORS.borderLight}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      color: COLORS.cream,
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={COLORS.textSubtle}
                    value={date}
                    onChangeText={setDate}
                    editable={!isSubmitting}
                  />
                )}
                <Text style={styles.fieldHelper}>Operating hours: 12:00 PM – 12:00 AM daily (IST)</Text>
              </View>

              {/* Preferred Time Grid */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Time *</Text>
                <View style={styles.timeGrid}>
                  {availableSlots.map((slot) => {
                    const isSelected = time === slot.time24;
                    const isDisabled = !slot.isAvailable;

                    return (
                      <TouchableOpacity
                        key={slot.time24}
                        style={[
                          styles.timeChip,
                          isTablet && styles.timeChipTablet,
                          !isDesktop && !isTablet && styles.timeChipMobile,
                          isSelected && styles.timeChipSelected,
                          isDisabled && styles.timeChipDisabled,
                        ]}
                        onPress={() => {
                          if (!isDisabled) setTime(slot.time24);
                        }}
                        disabled={isDisabled || isSubmitting}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                      >
                        <Text
                          style={[
                            styles.timeChipText,
                            isSelected && styles.timeChipTextSelected,
                            isDisabled && styles.timeChipTextDisabled,
                          ]}
                        >
                          {slot.time12}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Number of Guests */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Guests ({guests} {guests === 1 ? 'Person' : 'People'}) *</Text>
                <View style={styles.guestRow}>
                  {GUEST_OPTIONS.map((num) => {
                    const isSelected = guests === num;
                    return (
                      <TouchableOpacity
                        key={num}
                        style={[styles.guestChip, isSelected && styles.guestChipSelected]}
                        onPress={() => setGuests(num)}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text style={[styles.guestChipText, isSelected && styles.guestChipTextSelected]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Special Request / Dietary Preferences */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Special Request / Dietary Preference (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Birthday, anniversary, dietary preference, accessibility request, preferred seating..."
                  placeholderTextColor={COLORS.textSubtle}
                  multiline={true}
                  numberOfLines={3}
                  value={specialRequest}
                  onChangeText={setSpecialRequest}
                  editable={!isSubmitting}
                />
                <Text style={styles.fieldHelper}>Requests are subject to table availability on arrival.</Text>
              </View>

              {/* Inline Error Message */}
              {errorMessage ? (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color={COLORS.errorLight} style={{ marginRight: 8, marginTop: 1 }} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Submit CTA */}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Confirming Reservation...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Calendar size={18} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Reserve Table</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Right Column: Reservation Info & Policies */}
            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarTitle}>Reservation Info</Text>

              {/* Policy 1: Hold Time */}
              <View style={styles.policyItem}>
                <View style={styles.policyIconBox}>
                  <Clock size={18} color={COLORS.brandTurquoise} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Hold Time</Text>
                  <Text style={styles.policyText}>
                    Tables are held for up to 15 minutes past your reserved time.
                  </Text>
                </View>
              </View>

              {/* Policy 2: Large Parties */}
              <View style={styles.policyItem}>
                <View style={styles.policyIconBox}>
                  <Users size={18} color={COLORS.brandTurquoise} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Large Parties</Text>
                  <Text style={styles.policyText}>
                    For groups larger than 10 people, please call or WhatsApp the restaurant directly.
                  </Text>
                </View>
              </View>

              {/* Policy 3: Direct Inquiries */}
              <View style={styles.policyItem}>
                <View style={styles.policyIconBox}>
                  <Phone size={18} color={COLORS.brandTurquoise} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyHeading}>Direct Inquiries</Text>
                  <Text style={styles.policyText}>
                    Need instant confirmation or assistance?
                  </Text>
                </View>
              </View>

              {/* Quick Contact Buttons */}
              <View style={styles.quickContactGroup}>
                <TouchableOpacity 
                  style={styles.quickContactBtn}
                  onPress={handleCall}
                  activeOpacity={0.8}
                >
                  <Phone size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                  <Text style={styles.quickContactText}>Call {settings.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickContactBtn}
                  onPress={handleWhatsAppInquiry}
                  activeOpacity={0.8}
                >
                  <MessageSquare size={14} color={COLORS.brandGreen} style={{ marginRight: 6 }} />
                  <Text style={styles.quickContactText}>WhatsApp Us</Text>
                </TouchableOpacity>
              </View>

              {/* Location & Hours Reminder */}
              <View style={styles.sidebarFooterBox}>
                <Text style={styles.sidebarFooterText}>
                  📍 Central Bus Stand, Contai Bypass Road, Contai, West Bengal
                </Text>
                <Text style={styles.sidebarFooterSub}>
                  Open 7 days a week • 12:00 PM to 12:00 AM
                </Text>
              </View>
            </View>

          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  innerContainer: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 22,
  },
  layoutGrid: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'flex-start',
  },
  layoutGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  formCard: {
    flex: 1.5,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 22,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  sidebarCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formSectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
  },
  sidebarTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: 13,
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
    paddingVertical: 12,
    color: COLORS.cream,
    fontSize: 15,
    width: '100%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldHelper: {
    fontSize: 11.5,
    color: COLORS.textSubtle,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Time Slots Responsive Grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  timeChip: {
    width: 'calc(25% - 6px)' as any,
    minWidth: 70,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipTablet: {
    width: 'calc(33.333% - 6px)' as any,
  },
  timeChipMobile: {
    width: 'calc(33.333% - 6px)' as any,
    minWidth: 65,
    paddingVertical: 9,
  },
  timeChipSelected: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
    shadowColor: COLORS.copper,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  timeChipDisabled: {
    opacity: 0.35,
    backgroundColor: COLORS.surfaceHover,
    borderColor: COLORS.border,
  },
  timeChipText: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    fontWeight: '500',
  },
  timeChipTextSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },
  timeChipTextDisabled: {
    color: COLORS.textSubtle,
    textDecorationLine: 'line-through',
  },

  // Guest Count Row
  guestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestChip: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestChipSelected: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
    shadowColor: COLORS.copper,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  guestChipText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '600',
  },
  guestChipTextSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },

  // Error Banner
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.35)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    width: '100%',
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Submit Button
  submitBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Policies Sidebar
  policyItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: 12,
  },
  policyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.2)',
  },
  policyHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  policyText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  quickContactGroup: {
    gap: 8,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  quickContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  quickContactText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  sidebarFooterBox: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sidebarFooterText: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 4,
  },
  sidebarFooterSub: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '500',
  },

  // Confirmation Success Screen
  confirmationCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 24,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
    ...SHADOWS.card,
  },
  successIconBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.35)',
  },
  confirmationTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: 4,
    textAlign: 'center',
  },
  confirmationGreeting: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  highlightText: {
    color: COLORS.cream,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 125, 83, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.copper + '60',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  statusBadgeText: {
    color: COLORS.copperLight,
    fontSize: 12.5,
    fontWeight: '700',
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  noticeText: {
    color: COLORS.gold,
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  summaryTable: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '50',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  summaryValue: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  summaryRefValue: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confirmationActions: {
    width: '100%',
    gap: 10,
  },
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  whatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  calendarBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  resetBtnText: {
    color: COLORS.copper,
    fontSize: 13,
    fontWeight: '600',
  },
});
