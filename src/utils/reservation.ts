/**
 * Dream Love Cafe & Restaurant — Reservation Utilities
 * Handles timezone-safe date/time generation, slot calculations,
 * phone normalization, reference IDs, and WhatsApp/Calendar links.
 */

export interface TimeSlot {
  time24: string;   // "19:30"
  time12: string;   // "7:30 PM"
  isAvailable: boolean;
  reason?: string;
}

const RESTAURANT_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns today's date in YYYY-MM-DD in Asia/Kolkata timezone.
 */
export function getKolkataCurrentDate(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: RESTAURANT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
}

/**
 * Returns current hours and minutes in Asia/Kolkata timezone.
 */
export function getKolkataCurrentTime(): { hours: number; minutes: number } {
  try {
    const str = new Date().toLocaleTimeString('en-US', {
      timeZone: RESTAURANT_TIMEZONE,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    const [h, m] = str.split(':').map(Number);
    return { hours: h, minutes: m };
  } catch {
    const now = new Date();
    return { hours: now.getHours(), minutes: now.getMinutes() };
  }
}

/**
 * Converts 24-hour time ("13:30" or "00:00") to customer-friendly 12-hour format ("1:30 PM", "12:00 AM").
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);

  if (isNaN(h)) return time24;

  const period = h >= 12 && h < 24 ? 'PM' : 'AM';
  let displayHour = h % 12;
  if (displayHour === 0) displayHour = 12;

  const displayMinute = m < 10 ? `0${m}` : `${m}`;
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Formats YYYY-MM-DD to "29 August 2026" or "Saturday, 29 Aug 2026".
 */
export function formatDisplayDate(dateStr: string, includeDay: boolean = false): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(includeDay ? { weekday: 'short' } : {}),
    };
    return date.toLocaleDateString('en-IN', options);
  } catch {
    return dateStr;
  }
}

/**
 * Generates available standard time slots between restaurant opening and closing hours.
 * Restaurant hours: 12:00 PM (12:00) to 12:00 AM (midnight / 24:00).
 * If selectedDate is today, filters out slots that have already passed (plus 30m buffer).
 */
export function generateTimeSlots(
  selectedDate: string,
  startHour: number = 12,
  endHour: number = 24,
  intervalMinutes: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = getKolkataCurrentDate();
  const isToday = selectedDate === today;
  const currentTime = getKolkataCurrentTime();
  const currentTotalMinutes = currentTime.hours * 60 + currentTime.minutes + 30; // 30m advance lead time

  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60; // 24 * 60 = 1440

  for (let mins = startMinutes; mins < endMinutes; mins += intervalMinutes) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;

    const time24 = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    const time12 = formatTime12Hour(time24);

    let isAvailable = true;
    let reason: string | undefined = undefined;

    if (isToday && mins < currentTotalMinutes) {
      isAvailable = false;
      reason = 'Past time';
    }

    slots.push({
      time24,
      time12,
      isAvailable,
      reason,
    });
  }

  return slots;
}

/**
 * Generates a human-friendly reservation reference code (e.g. DL-8F42K7).
 */
export function generateReservationReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DL-${randomPart}`;
}

/**
 * Normalizes Indian phone numbers into canonical E.164-like format (+91XXXXXXXXXX).
 * Accepts variations: +91 99333 88167, 09933388167, 9933388167, etc.
 */
export function normalizeIndianPhoneNumber(rawPhone: string): { 
  isValid: boolean; 
  normalized: string; 
  display: string; 
  error?: string 
} {
  if (!rawPhone) {
    return { isValid: false, normalized: '', display: '', error: 'Please enter your phone number.' };
  }

  // Remove all non-digits except leading +
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Check 10-digit Indian mobile format (starting with 6, 7, 8, 9)
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { 
      isValid: false, 
      normalized: rawPhone.trim(), 
      display: rawPhone.trim(), 
      error: 'Please enter a valid 10-digit Indian mobile number (e.g. +91 99333 88167).' 
    };
  }

  const normalized = `+91${cleaned}`;
  const display = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;

  return { isValid: true, normalized, display };
}

/**
 * Generates a pre-filled WhatsApp message for table reservations.
 */
export function formatWhatsAppReservationMessage({
  name,
  phone,
  date,
  time,
  guests,
  referenceCode,
  specialRequest,
  targetPhone = '919933388167',
}: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  referenceCode?: string;
  specialRequest?: string;
  targetPhone?: string;
}): { text: string; link: string } {
  const cleanTarget = targetPhone.replace(/[^0-9]/g, '');
  const displayDate = formatDisplayDate(date, true);
  const displayTime = formatTime12Hour(time);

  let message = `Hello Dream Love Cafe & Restaurant,\nI have submitted a table reservation.\n\n`;
  message += `👤 Name: ${name}\n`;
  message += `📞 Phone: ${phone}\n`;
  message += `📅 Date: ${displayDate}\n`;
  message += `⏰ Time: ${displayTime}\n`;
  message += `👥 Guests: ${guests} ${guests === 1 ? 'Guest' : 'Guests'}\n`;
  
  if (referenceCode) {
    message += `🔖 Reservation ID: ${referenceCode}\n`;
  }

  if (specialRequest?.trim()) {
    message += `📝 Special Request: ${specialRequest.trim()}\n`;
  }

  message += `\nPlease confirm my reservation. Thank you!`;

  const encodedText = encodeURIComponent(message);
  const link = `https://wa.me/${cleanTarget}?text=${encodedText}`;

  return { text: message, link };
}

/**
 * Generates a Google Calendar event creation link.
 */
export function generateGoogleCalendarLink({
  name,
  date,
  time,
  guests,
  referenceCode,
}: {
  name: string;
  date: string;
  time: string;
  guests: number;
  referenceCode?: string;
}): string {
  try {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Reservation start
    const startDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30)); // Offset for IST (UTC+5:30)
    // 2-hour duration
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const formatISOCompact = (d: Date) => 
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const title = encodeURIComponent(`Table Reservation at Dream Love Cafe & Restaurant (${guests} Guests)`);
    const details = encodeURIComponent(
      `Table Reservation for ${name} (${guests} Guests).\nReservation ID: ${referenceCode || 'N/A'}\nDream Love Cafe & Restaurant, Central Bus Stand, Contai Bypass Rd, Contai, West Bengal 721404\nPhone: +91 99333 88167`
    );
    const location = encodeURIComponent(`Dream Love Cafe & Restaurant, Contai Bypass Road, Contai, West Bengal 721404`);
    const dates = `${formatISOCompact(startDate)}/${formatISOCompact(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch {
    return 'https://calendar.google.com';
  }
}
