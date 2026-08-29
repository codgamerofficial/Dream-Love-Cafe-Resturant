import {
  formatTime12Hour,
  formatDisplayDate,
  generateTimeSlots,
  normalizeIndianPhoneNumber,
  generateReservationReference,
  formatWhatsAppReservationMessage,
  generateGoogleCalendarLink,
} from '../utils/reservation';

describe('Reservation Utilities', () => {
  describe('formatTime12Hour', () => {
    it('correctly converts 24-hour afternoon and evening times', () => {
      expect(formatTime12Hour('12:00')).toBe('12:00 PM');
      expect(formatTime12Hour('12:30')).toBe('12:30 PM');
      expect(formatTime12Hour('13:00')).toBe('1:00 PM');
      expect(formatTime12Hour('13:30')).toBe('1:30 PM');
      expect(formatTime12Hour('19:30')).toBe('7:30 PM');
      expect(formatTime12Hour('21:00')).toBe('9:00 PM');
      expect(formatTime12Hour('23:30')).toBe('11:30 PM');
    });

    it('correctly handles midnight and morning times', () => {
      expect(formatTime12Hour('00:00')).toBe('12:00 AM');
      expect(formatTime12Hour('09:00')).toBe('9:00 AM');
      expect(formatTime12Hour('11:30')).toBe('11:30 AM');
    });
  });

  describe('normalizeIndianPhoneNumber', () => {
    it('normalizes valid 10-digit numbers', () => {
      const res = normalizeIndianPhoneNumber('9933388167');
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe('+919933388167');
    });

    it('normalizes numbers with spaces and +91 prefix', () => {
      const res = normalizeIndianPhoneNumber('+91 99333 88167');
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe('+919933388167');
    });

    it('rejects invalid or too short numbers', () => {
      const res = normalizeIndianPhoneNumber('12345');
      expect(res.isValid).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('generateReservationReference', () => {
    it('generates a valid DL- prefix 6-character alphanumeric reference', () => {
      const ref = generateReservationReference();
      expect(ref).toMatch(/^DL-[A-Z0-9]{6}$/);
    });
  });

  describe('generateTimeSlots', () => {
    it('generates slots covering 12:00 PM to 11:30 PM for future dates', () => {
      const slots = generateTimeSlots('2099-12-31');
      expect(slots.length).toBe(24);
      expect(slots[0].time12).toBe('12:00 PM');
      expect(slots[slots.length - 1].time12).toBe('11:30 PM');
      expect(slots.every(s => s.isAvailable)).toBe(true);
    });
  });

  describe('formatWhatsAppReservationMessage', () => {
    it('generates a properly encoded WhatsApp link with reservation info', () => {
      const res = formatWhatsAppReservationMessage({
        name: 'Saswata',
        phone: '+919933388167',
        date: '2026-08-29',
        time: '19:30',
        guests: 4,
        referenceCode: 'DL-8F42K7',
        targetPhone: '919933388167',
      });

      expect(res.link).toContain('https://wa.me/919933388167');
      expect(res.text).toContain('Saswata');
      expect(res.text).toContain('4 Guests');
      expect(res.text).toContain('DL-8F42K7');
      expect(res.text).toContain('7:30 PM');
    });
  });

  describe('generateGoogleCalendarLink', () => {
    it('generates a Google Calendar URL', () => {
      const url = generateGoogleCalendarLink({
        name: 'Saswata',
        date: '2026-08-29',
        time: '19:30',
        guests: 2,
        referenceCode: 'DL-TEST01',
      });

      expect(url).toContain('https://calendar.google.com/calendar/render');
      expect(url).toContain('Dream%20Love%20Cafe');
    });
  });
});
