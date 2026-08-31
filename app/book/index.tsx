import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform,
  ActivityIndicator,
  Linking,
  Image
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
  Check,
  MapPin,
  Heart,
  Sparkles
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
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
  saveLocalReservation,
  TimeSlot
} from '../../src/utils/reservation';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

export default function ReservationPage() {
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  
  // Responsive layout flags
  const isDesktop = width >= 880;
  const isTablet = width >= 600 && width < 880;
  const isSmallMobile = width < 360;

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
      return { isValid: false, error: phoneResult.error || 'Please enter a valid 10-digit Indian phone number.' };
    }

    if (!date) {
      return { isValid: false, error: 'Please select a reservation date.' };
    }

    if (date < todayDate) {
      return { isValid: false, error: 'Reservation date cannot be in the past.' };
    }

    if (!time) {
      return { isValid: false, error: 'Please select a preferred dining time slot.' };
    }

    const currentSlot = availableSlots.find(s => s.time24 === time);
    if (currentSlot && !currentSlot.isAvailable) {
      return { isValid: false, error: 'The selected time slot is unavailable. Please choose another time.' };
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
        // Prevent duplicate submissions with same phone/date/time
        const { data: existing } = await supabase
          .from('reservations')
          .select('id')
          .eq('phone', normalizedPhone)
          .eq('date', date)
          .eq('time', time)
          .maybeSingle();

        if (existing) {
          setErrorMessage('A table request for this phone number, date, and time already exists. We will contact you shortly.');
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
        }
      }

      // Always persist locally in AsyncStorage
      await saveLocalReservation({
        reference_code: referenceCode,
        name: name.trim(),
        phone: normalizedPhone,
        date: date,
        time: time,
        guests: Number(guests),
        special_request: specialRequest.trim() || undefined,
        status: 'pending',
        created_at: new Date().toISOString(),
        source: 'website',
      });

      // Show confirmed success view
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
      // Fall back gracefully to local persistence
      await saveLocalReservation({
        reference_code: referenceCode,
        name: name.trim(),
        phone: normalizedPhone,
        date: date,
        time: time,
        guests: Number(guests),
        special_request: specialRequest.trim() || undefined,
        status: 'pending',
        created_at: new Date().toISOString(),
        source: 'website',
      });

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

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header Box */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>TABLE RESERVATION</Text>
          <Text style={[styles.pageTitle, !isDesktop && styles.pageTitleMobile]}>Book Your Table</Text>
          <Text style={styles.pageSubtitle}>
            Reserve your dining space in advance for family meals, special dates, and intimate gatherings at Dream Love Contai.
          </Text>
        </View>

        {isSubmitted && confirmedReservation ? (
          /* ── SUCCESS CONFIRMATION STATE ── */
          <View style={styles.successWrapper}>
            <View style={styles.successCard}>
              <View style={styles.successIconHeader}>
                <CheckCircle2 size={56} color={COLORS.brandTurquoise} />
              </View>

              <Text style={styles.successMainTitle}>Reservation Request Received</Text>
              <Text style={styles.successSubTitle}>
                Thank you, {confirmedReservation.name}! Your table request has been registered under reference:
              </Text>

              <View style={styles.referenceBadge}>
                <Text style={styles.referenceBadgeLabel}>REFERENCE CODE</Text>
                <Text style={styles.referenceBadgeCode}>{confirmedReservation.referenceCode}</Text>
              </View>

              {/* Summary Details Grid */}
              <View style={styles.summaryDetailsBox}>
                <View style={styles.summaryRow}>
                  <Calendar size={16} color={COLORS.copper} style={{ marginRight: 8 }} />
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>{formatDisplayDate(confirmedReservation.date)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Clock size={16} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{formatTime12Hour(confirmedReservation.time)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Users size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
                  <Text style={styles.summaryLabel}>Party Size:</Text>
                  <Text style={styles.summaryValue}>{confirmedReservation.guests} Guests</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Phone size={16} color={COLORS.creamMuted} style={{ marginRight: 8 }} />
                  <Text style={styles.summaryLabel}>Contact Phone:</Text>
                  <Text style={styles.summaryValue}>{confirmedReservation.phone}</Text>
                </View>
              </View>

              {/* Actions: WhatsApp & Google Calendar */}
              <View style={styles.successActionsContainer}>
                <TouchableOpacity
                  style={styles.whatsAppActionBtn}
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
                  <Text style={styles.whatsAppActionBtnText}>Notify on WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.calendarActionBtn}
                  onPress={() => {
                    const calLink = generateGoogleCalendarLink({
                      name: confirmedReservation.name,
                      date: confirmedReservation.date,
                      time: confirmedReservation.time,
                      guests: confirmedReservation.guests,
                      referenceCode: confirmedReservation.referenceCode,
                    });
                    Linking.openURL(calLink);
                  }}
                  activeOpacity={0.85}
                >
                  <CalendarPlus size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                  <Text style={styles.calendarActionBtnText}>Add to Google Calendar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.newBookingBtn} onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.newBookingBtnText}>Make Another Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── MAIN RESERVATION FORM & INFO SPLIT ── */
          <View style={[styles.mainGrid, !isDesktop && styles.mainGridMobile]}>
            
            {/* Left: Interactive Reservation Form */}
            <View style={[styles.formColumn, !isDesktop && styles.columnFullWidth]}>
              <View style={styles.formCard}>
                <Text style={styles.cardHeaderTitle}>Reservation Details</Text>

                {/* Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textSubtle}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Phone */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Contact Phone (10 Digits) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 9876543210"
                    placeholderTextColor={COLORS.textSubtle}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Date Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Dining Date *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={COLORS.textSubtle}
                  />
                </View>

                {/* Guests Selector */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Number of Guests *</Text>
                  <View style={styles.guestPillRow}>
                    {GUEST_OPTIONS.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.guestPill, guests === g && styles.guestPillActive]}
                        onPress={() => setGuests(g)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.guestPillText, guests === g && styles.guestPillTextActive]}>
                          {g} {g === 1 ? 'Guest' : 'Guests'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Time Slots Grid */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Select Time Slot *</Text>
                  <View style={styles.timeSlotGrid}>
                    {availableSlots.map((slot) => {
                      const isSelected = time === slot.time24;
                      return (
                        <TouchableOpacity
                          key={slot.time24}
                          disabled={!slot.isAvailable}
                          style={[
                            styles.timeSlotBtn,
                            isSelected && styles.timeSlotBtnActive,
                            !slot.isAvailable && styles.timeSlotBtnDisabled
                          ]}
                          onPress={() => setTime(slot.time24)}
                          activeOpacity={0.8}
                        >
                          <Text style={[
                            styles.timeSlotText,
                            isSelected && styles.timeSlotTextActive,
                            !slot.isAvailable && styles.timeSlotTextDisabled
                          ]}>
                            {slot.time12}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Special Requests */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Special Request or Occasion (Optional)</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="e.g. Window booth, birthday celebration, baby high chair"
                    placeholderTextColor={COLORS.textSubtle}
                    value={specialRequest}
                    onChangeText={setSpecialRequest}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <AlertCircle size={16} color={COLORS.errorLight} style={{ marginRight: 8 }} />
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
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <React.Fragment>
                      <Calendar size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.submitBtnText}>Confirm Table Reservation</Text>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Right: Info & Ambiance Details */}
            <View style={[styles.infoColumn, !isDesktop && styles.columnFullWidth]}>
              {/* Dining Ambiance Card */}
              <View style={styles.ambianceCard}>
                <Image
                  source={{ uri: '/photos/interior_cafe_lounge.jpg' }}
                  style={styles.ambianceImage}
                  resizeMode="cover"
                />
                <View style={styles.ambianceContent}>
                  <Text style={styles.ambianceTitle}>Family & Group Dining</Text>
                  <Text style={styles.ambianceDesc}>
                    Enjoy comfortable seating with warm lighting and authentic multi-cuisine delicacies prepared fresh to order.
                  </Text>
                </View>
              </View>

              {/* Policy & Notes Card */}
              <View style={styles.policyCard}>
                <Text style={styles.policyCardTitle}>Reservation Guidelines</Text>
                
                <View style={styles.policyItem}>
                  <Clock size={16} color={COLORS.brandTurquoise} style={styles.policyIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.policyLabel}>Holding Time</Text>
                    <Text style={styles.policyValue}>Tables are held for up to 15 minutes past reservation time.</Text>
                  </View>
                </View>

                <View style={styles.policyItem}>
                  <Phone size={16} color={COLORS.copper} style={styles.policyIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.policyLabel}>Large Parties & Events</Text>
                    <Text style={styles.policyValue}>For parties over 10 guests, please call us directly at {settings.phone}.</Text>
                  </View>
                </View>

                <View style={styles.policyItem}>
                  <MapPin size={16} color={COLORS.gold} style={styles.policyIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.policyLabel}>Location</Text>
                    <Text style={styles.policyValue}>Contai Bypass Road, opposite Jawed Habib's, Contai.</Text>
                  </View>
                </View>
              </View>

              {/* Direct Assistance CTA */}
              <View style={styles.directAssistanceCard}>
                <Text style={styles.directAssistanceTitle}>Need Immediate Assistance?</Text>
                <Text style={styles.directAssistanceDesc}>
                  Call our team directly for instant availability or route guidance.
                </Text>
                <TouchableOpacity style={styles.directCallBtn} onPress={handleCall} activeOpacity={0.85}>
                  <Phone size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.directCallBtnText}>Call {settings.phone}</Text>
                </TouchableOpacity>
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
    width: '100%',
    backgroundColor: COLORS.background,
    minHeight: '100%',
    paddingBottom: SPACING.giant,
  },
  innerContainer: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  headerBox: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  preTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
    letterSpacing: 2.5,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  pageTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  pageTitleMobile: {
    fontSize: 30,
  },
  pageSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 620,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // Main Split Grid
  mainGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  mainGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  formColumn: {
    flex: 1.25,
  },
  infoColumn: {
    flex: 1,
    gap: 20,
  },
  columnFullWidth: {
    width: '100%',
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  cardHeaderTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.creamMuted,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  textInput: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.cream,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  guestPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  guestPillActive: {
    backgroundColor: COLORS.brandTurquoise + '25',
    borderColor: COLORS.brandTurquoise,
  },
  guestPillText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  guestPillTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minWidth: '22%',
    alignItems: 'center',
  },
  timeSlotBtnActive: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  timeSlotBtnDisabled: {
    opacity: 0.35,
    backgroundColor: COLORS.surfaceMuted,
  },
  timeSlotText: {
    color: COLORS.creamMuted,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeSlotTextDisabled: {
    color: COLORS.textSubtle,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    padding: 12,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.card,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // Right Info Cards
  ambianceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  ambianceImage: {
    width: '100%',
    height: 180,
  },
  ambianceContent: {
    padding: SPACING.md,
  },
  ambianceTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  ambianceDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  policyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 14,
    ...SHADOWS.card,
  },
  policyCardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  policyIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  policyLabel: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  policyValue: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  directAssistanceCard: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
    textAlign: 'center',
  },
  directAssistanceTitle: {
    color: COLORS.cream,
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  directAssistanceDesc: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  directCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  directCallBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // Success Confirmation State
  successWrapper: {
    maxWidth: 640,
    width: '100%',
    marginHorizontal: 'auto',
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.card,
  },
  successIconHeader: {
    marginBottom: SPACING.md,
  },
  successMainTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 6,
  },
  successSubTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 440,
    lineHeight: 21,
    marginBottom: SPACING.lg,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  referenceBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  referenceBadgeLabel: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  referenceBadgeCode: {
    color: COLORS.cream,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  summaryDetailsBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    width: '100%',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    width: 120,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  summaryValue: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  successActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
  whatsAppActionBtn: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803D',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
  },
  whatsAppActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  calendarActionBtn: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
  },
  calendarActionBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  newBookingBtn: {
    paddingVertical: 8,
  },
  newBookingBtnText: {
    color: COLORS.copperLight,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
