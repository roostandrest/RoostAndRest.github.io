/**
 * ═════════════════════════════════════════════════════════════════════
 * 🏨 ROOST & REST - AIRBNB TO CRM REAL-TIME GMAIL AUTO-SYNC (V8)
 * ═════════════════════════════════════════════════════════════════════
 * 
 * 🛡️ Solves "Block hua bas guest name aur details nahi aaya":
 * 1. Targeted Code Search: Searches Gmail specifically by confirmation code (HM...)
 *    for each booking in CRM, fetching exact Guest Name, Guest Count & Phone digits.
 * 2. Complete 18-Property Mapping: Includes all listing IDs, unit numbers (101-118),
 *    and exact titles/nicknames so all Airbnb reservations match automatically.
 * 3. Never rejects an existing booking: If the confirmation code is already in CRM,
 *    it enriches it with real guest name without requiring property name match.
 * 4. Safe Schema Compliance: Uses Roost & Rest's exact Supabase schema (no missing column errors).
 * 5. Auto-approved ('verified') with Booked By set to 'Gmail Sync'.
 */

const CONFIG = {
  SUPABASE_URL: "https://lfxeacasgyofsyxthman.supabase.co",
  SUPABASE_KEY: "sb_publishable_abS3wJfBEm4ORFAMXXozBw_MfC-IzJp",
  PROCESSED_LABEL: "Airbnb-Synced"
};

// 18 Properties with COMPLETE Listing IDs, Units, Nicknames & Keywords
const ROOM_MAPPING = [
  {
    roomId: 'RST-101',
    name: 'Awadh Abode',
    unit: '101',
    listingId: '1513689704038700506',
    keywords: ['awadh abode', 'modern 2bhk in city centre', 'city centre', 'rst-101', 'unit 101', '1513689704038700506']
  },
  {
    roomId: 'RST-102',
    name: 'Green Leaf Corner',
    unit: '102',
    listingId: '1432351238708631534',
    keywords: ['green leaf corner', 'greenleaf corner', 'green leaf', '2bhk in lucknow', 'rst-102', 'unit 102', '1432351238708631534']
  },
  {
    roomId: 'RST-103',
    name: 'Moon Light House',
    unit: '103',
    listingId: '1403663140808704064',
    keywords: ['moon light house', 'moonlight house', 'moonlight', '3bhk with garden', 'rst-103', 'unit 103', '1403663140808704064']
  },
  {
    roomId: 'RST-104',
    name: 'Palladium Loft',
    unit: '104',
    listingId: '1728065461825716832',
    keywords: ['palladium loft', 'palladium', 'medanta hospital', 'lulu', 'ekana', 'rst-104', 'unit 104', '1728065461825716832']
  },
  {
    roomId: 'RST-105',
    name: 'Peaceful Nest',
    unit: '105',
    listingId: '1472836855538423252',
    keywords: ['peaceful nest', 'peaceful', 'rst-105', 'unit 105', '1472836855538423252']
  },
  {
    roomId: 'RST-106',
    name: 'The Awadh Retreat',
    unit: '106',
    listingId: '1754920271857081441',
    keywords: ['the awadh retreat', 'awadh retreat', 'the nawab house', 'amity university', 'rst-106', 'unit 106', '1754920271857081441']
  },
  {
    roomId: 'RST-107',
    name: 'The Comfort Corner',
    unit: '107',
    listingId: '1546149723330595826',
    keywords: ['the comfort corner', 'comfort corner', '2bhk centrally located', 'rst-107', 'unit 107', '1546149723330595826']
  },
  {
    roomId: 'RST-108',
    name: 'The Cozy Corner',
    unit: '108',
    listingId: '1765272258371576617',
    keywords: ['the cozy corner', 'cozy corner', 'rst-108', 'unit 108', '1765272258371576617']
  },
  {
    roomId: 'RST-109',
    name: 'The Eighteenth',
    unit: '109',
    listingId: '1778104021407872339',
    keywords: ['the eighteenth', 'eighteenth', 'amity campus', 'rst-109', 'unit 109', '1778104021407872339']
  },
  {
    roomId: 'RST-110',
    name: 'Family Fun Heaven',
    unit: '110',
    listingId: '1381275814432030373',
    keywords: ['the family fun heaven', 'family fun heaven', 'family fun', '1bhk in posh locality', 'rst-110', 'unit 110', '1381275814432030373']
  },
  {
    roomId: 'RST-111',
    name: 'The Grand Alcove',
    unit: '111',
    listingId: '1673624571406248647',
    keywords: ['the grand alcove', 'grand alcove', 'krishnam villa', 'rst-111', 'unit 111', '1673624571406248647']
  },
  {
    roomId: 'RST-112',
    name: 'The Luxe Haven',
    unit: '112',
    listingId: '1756974059274081131',
    keywords: ['the luxe haven', 'luxe haven', 'gomti nagar extension', 'rst-112', 'unit 112', '1756974059274081131']
  },
  {
    roomId: 'RST-113',
    name: 'The Monarch Suites',
    unit: '113',
    listingId: '1759943752045444261',
    keywords: ['the monarch suites', 'monarch suites', 'monarch', 'rst-113', 'unit 113', '1759943752045444261']
  },
  {
    roomId: 'RST-114',
    name: 'The Nestora',
    unit: '114',
    listingId: '1758780588353629399',
    keywords: ['the nestora', 'nestora', 'rst-114', 'unit 114', '1758780588353629399']
  },
  {
    roomId: 'RST-115',
    name: 'The Nivora Nest',
    unit: '115',
    listingId: '1754941277309610915',
    keywords: ['the nivora nest', 'nivora nest', 'nivora', 'cozy retreat for memorable stay', 'rst-115', 'unit 115', '1754941277309610915']
  },
  {
    roomId: 'RST-116',
    name: 'The Rustic Anjuman',
    unit: '116',
    listingId: '1311579015127768002',
    keywords: ['the rustic anjuman', 'rustic anjuman', 'gray and white', 'rst-116', 'unit 116', '1311579015127768002']
  },
  {
    roomId: 'RST-117',
    name: 'The Zenvana',
    unit: '117',
    listingId: '1700681506593234895',
    keywords: ['the zenvana', 'zenvana', 'peaceful retreat like blissful scape', 'blissful scape', 'rst-117', 'unit 117', '1700681506593234895']
  },
  {
    roomId: 'RST-118',
    name: 'Presidential Suite',
    unit: '118',
    listingId: '1772311030162498401',
    keywords: ['roost presidential suite', 'presidential suite', 'roost suite', 'rst-118', 'unit 118', '1772311030162498401']
  }
];

const MONTH_MAP = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
};

function formatYMD(year, month, day) {
  const y = parseInt(year, 10);
  const m = typeof month === 'number' ? month : MONTH_MAP[String(month).toLowerCase().slice(0, 3)];
  const d = parseInt(day, 10);
  if (!y || !m || !d || isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getHeaders() {
  return {
    'apikey': CONFIG.SUPABASE_KEY,
    'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

/**
 * ⚡ MAIN AUTO-SYNC FUNCTION (Set Trigger to run every 5-10 minutes)
 */
function syncAirbnbReservations() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    Logger.log("Another sync is running. Skipping execution.");
    return;
  }

  try {
    const label = getOrCreateLabel(CONFIG.PROCESSED_LABEL);

    // 1. Fetch current bookings from Supabase
    const existingMap = getExistingAirbnbBookingsMap();
    const existingList = Object.values(existingMap);
    Logger.log(`Loaded ${existingList.length} existing Airbnb bookings from CRM.`);

    let enrichedCount = 0;
    let createdCount = 0;

    // ─────────────────────────────────────────────────────────────
    // STEP 1: TARGETED ENRICHMENT FOR ANY BOOKING MISSING DETAILS
    // Searches Gmail specifically by confirmation code (HM...)
    // ─────────────────────────────────────────────────────────────
    const needsEnrichment = existingList.filter(b => {
      const isGeneric = !b.guest_name || b.guest_name.includes('Airbnb') || b.guest_name.includes('Guest') || b.guest_name.startsWith('🏨') || b.guest_name.length <= 2 || /^Send\s+/i.test(b.guest_name) || /cancels?/i.test(b.guest_name);
      const isMissingGuests = !b.guests;
      return (isGeneric || isMissingGuests) && b.airbnb_confirmation_code;
    });

    Logger.log(`Found ${needsEnrichment.length} bookings needing detail enrichment in CRM.`);

    for (const b of needsEnrichment) {
      const code = b.airbnb_confirmation_code;
      try {
        const threads = GmailApp.search(`from:airbnb.com ${code}`, 0, 1);
        if (threads && threads.length > 0) {
          const t = threads[0];
          const messages = t.getMessages();
          let combinedText = t.getFirstMessageSubject() + '\n';
          let latestDate = new Date();
          for (const m of messages) {
            combinedText += m.getSubject() + '\n' + m.getPlainBody() + '\n';
            latestDate = m.getDate();
          }

          const parsed = parseAirbnbEmail(t.getFirstMessageSubject(), combinedText, latestDate, b);
          if (parsed && parsed.guestName && parsed.guestName !== 'Airbnb Guest') {
            const ok = enrichBookingInCRM(b.booking_id, parsed);
            if (ok) {
              enrichedCount++;
              b.guest_name = parsed.guestName;
              b.guests = parsed.guests;
              t.addLabel(label);
            }
          }
        }
      } catch (e) {
        Logger.log(`Error enriching code ${code}: ${e.message}`);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 2: GENERAL DISCOVERY OF NEW AIRBNB RESERVATIONS
    // ─────────────────────────────────────────────────────────────
    const generalThreads = GmailApp.search('from:airbnb.com ("Reservation confirmed" OR "Booking confirmed" OR "confirmation code") -label:Airbnb-Synced', 0, 50);
    Logger.log(`Scanning ${generalThreads.length} unlabelled confirmation threads for new reservations.`);

    for (const thread of generalThreads) {
      const messages = thread.getMessages();
      const threadSubject = thread.getFirstMessageSubject();

      let combinedThreadText = threadSubject + '\n';
      let latestDate = new Date();
      for (const m of messages) {
        combinedThreadText += m.getSubject() + '\n' + m.getPlainBody() + '\n';
        latestDate = m.getDate();
      }

      const textLower = combinedThreadText.toLowerCase();

      // Check Cancellation
      if (textLower.includes('reservation cancelled') || textLower.includes('reservation canceled') || textLower.includes('booking cancelled')) {
        const codeMatch = combinedThreadText.match(/\b(HM[A-Z0-9]{8,12})\b/);
        if (codeMatch) {
          handleCancellation(codeMatch[1], existingMap);
          thread.addLabel(label);
        }
        continue;
      }

      // Check Confirmation
      if (textLower.includes('reservation confirmed') || textLower.includes('booking confirmed') || textLower.includes('confirmation code') || textLower.includes('arrives')) {
        const bookingData = parseAirbnbEmail(threadSubject, combinedThreadText, latestDate, null);
        if (bookingData && bookingData.confirmationCode) {
          const code = bookingData.confirmationCode;
          const existing = existingMap[code];

          if (!existing) {
            if (bookingData.roomId && bookingData.checkIn && bookingData.checkOut) {
              const ok = insertBookingToCRM(bookingData);
              if (ok) {
                createdCount++;
                existingMap[code] = bookingData;
                thread.addLabel(label);
              }
            }
          } else {
            // Already exists -> Enrich if generic
            const isGenericName = !existing.guest_name || existing.guest_name.includes('Airbnb') || existing.guest_name.startsWith('🏨');
            if (isGenericName || (!existing.guests && bookingData.guests)) {
              enrichBookingInCRM(existing.booking_id, bookingData);
              enrichedCount++;
            }
            thread.addLabel(label);
          }
        }
      }
    }

    Logger.log(`✅ SYNC COMPLETE: Enriched: ${enrichedCount} | Newly Created: ${createdCount}`);
  } catch (err) {
    Logger.log(`Fatal Error in syncAirbnbReservations: ${err.message}`);
  } finally {
    lock.releaseLock();
  }
}

/**
 * 📥 Fetch existing Airbnb bookings from Supabase
 */
function getExistingAirbnbBookingsMap() {
  const map = {};
  try {
    const url = `${CONFIG.SUPABASE_URL}/rest/v1/guest_register?check_in=gte.2024-01-01&select=booking_id,airbnb_confirmation_code,guest_name,guests,total_amount,payment_status,booked_by,is_cancelled,room_id,check_in,check_out`;
    const resp = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: getHeaders(),
      muteHttpExceptions: true
    });
    const data = JSON.parse(resp.getContentText() || '[]');
    if (Array.isArray(data)) {
      for (const b of data) {
        if (b.airbnb_confirmation_code) {
          map[b.airbnb_confirmation_code] = b;
        }
      }
    }
  } catch (e) {
    Logger.log("Error loading existing bookings: " + e.message);
  }
  return map;
}

/**
 * 📧 PARSE AIRBNB EMAIL (BULLETPROOF)
 */
function parseAirbnbEmail(subject, textContent, emailDate, existingBooking) {
  try {
    const cleanSearchText = textContent
      .replace(/[\u200B-\u200D\uFEFF\u00A0\u2009]/g, ' ')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D–—]/g, '-');

    // 1. Confirmation Code
    let confirmationCode = null;
    const codeMatch = cleanSearchText.match(/\b(HM[A-Z0-9]{8,12})\b/);
    if (codeMatch) confirmationCode = codeMatch[1];
    if (!confirmationCode && existingBooking) confirmationCode = existingBooking.airbnb_confirmation_code;
    if (!confirmationCode) return null;

    // 2. Room ID Resolution
    let matchedRoomId = existingBooking ? existingBooking.room_id : null;
    let matchedPropName = null;
    if (!matchedRoomId) {
      const searchLower = cleanSearchText.toLowerCase();
      for (const prop of ROOM_MAPPING) {
        if (prop.keywords.some(k => searchLower.includes(k))) {
          matchedRoomId = prop.roomId;
          matchedPropName = prop.name;
          break;
        }
      }
    }

    // 3. Dates Parsing
    let checkIn = existingBooking ? existingBooking.check_in : null;
    let checkOut = existingBooking ? existingBooking.check_out : null;
    const currentYear = emailDate ? emailDate.getFullYear() : new Date().getFullYear();

    if (!checkIn || !checkOut) {
      const mCin = cleanSearchText.match(/Check-?in[:\s]+(?:[A-Za-z]{3},?\s*)?(?:(\d{1,2})\s+)?([A-Za-z]{3})[a-z]*(?:\s+(\d{1,2}))?(?:,?\s*(\d{4}))?/i);
      const mCout = cleanSearchText.match(/Check-?out[:\s]+(?:[A-Za-z]{3},?\s*)?(?:(\d{1,2})\s+)?([A-Za-z]{3})[a-z]*(?:\s+(\d{1,2}))?(?:,?\s*(\d{4}))?/i);
      if (mCin && mCout) {
        const d1 = mCin[1] || mCin[3];
        const d2 = mCout[1] || mCout[3];
        if (d1 && d2) {
          const y1 = mCin[4] || currentYear;
          const y2 = mCout[4] || currentYear;
          checkIn = formatYMD(y1, mCin[2], d1);
          checkOut = formatYMD(y2, mCout[2], d2);
        }
      }
    }

    if (!checkIn || !checkOut) {
      const mFull = cleanSearchText.match(/(?:[A-Za-z]{3},?\s*)?([A-Za-z]{3})[a-z]*\s*(\d{1,2})(?:,?\s*(\d{4}))?\s*[-/to]+\s*(?:[A-Za-z]{3},?\s*)?([A-Za-z]{3})[a-z]*\s*(\d{1,2})(?:,?\s*(\d{4}))?/i);
      if (mFull) {
        const y1 = mFull[3] || currentYear;
        const y2 = mFull[6] || mFull[3] || currentYear;
        checkIn = formatYMD(y1, mFull[1], mFull[2]);
        checkOut = formatYMD(y2, mFull[4], mFull[5]);
      }
    }

    if (!checkIn || !checkOut) {
      const mSameMonth = cleanSearchText.match(/\b([A-Za-z]{3})[a-z]*\s*(\d{1,2})\s*[-/to]+\s*(\d{1,2})(?:,?\s*(\d{4}))?\b/i);
      if (mSameMonth) {
        const y = mSameMonth[4] || currentYear;
        checkIn = formatYMD(y, mSameMonth[1], mSameMonth[2]);
        checkOut = formatYMD(y, mSameMonth[1], mSameMonth[3]);
      }
    }

    // 4. Guest Name Extraction
    let guestName = null;
    const nameMatchPatterns = [
      /Reservation confirmed\s*[-–—:]\s*([A-Za-z\s.'’]+?)(?:\s+arrives|\s+is arriving|\s+booked|\s*[,|\n])/i,
      /Booking confirmed\s*[-–—:]\s*([A-Za-z\s.'’]+?)(?:\s+arrives|\s+is arriving|\s+booked|\s*[,|\n])/i,
      /([A-Za-z\s.'’]+?)\s+arrives\s+(?:on\s+)?[A-Za-z]{3}/i,
      /Guest name[:\s]+([A-Za-z\s.'’]+)/i,
      /Hosted by.*?for\s+([A-Za-z\s.'’]+)/i
    ];

    for (const pat of nameMatchPatterns) {
      const m = cleanSearchText.match(pat) || subject.match(pat);
      if (m && m[1]) {
        let cleanName = m[1].trim().replace(/\s+/g, ' ');
        cleanName = cleanName.replace(/^(?:reservation|booking|confirmed|canceled|cancelled|inquiry|re:|fwd:|dear|hello|hi|guest|host|hosted by|accepted|eaed)\s+/i, '').trim();
        if (cleanName.length > 2 && !cleanName.toLowerCase().includes('airbnb') && !cleanName.toLowerCase().includes('reservation') && !cleanName.toLowerCase().includes('booking')) {
          guestName = cleanName;
          break;
        }
      }
    }

    if (!guestName && existingBooking && existingBooking.guest_name && !existingBooking.guest_name.includes('Airbnb')) {
      guestName = existingBooking.guest_name;
    }

    if (!guestName) guestName = `Airbnb Guest (${confirmationCode})`;

    // 5. Payout Extraction
    let payoutAmount = 0;
    const payoutPatterns = [
      /(?:You earn|Host payout|Expected payout|Total payout|Payout)[:\s]*(?:₹|INR|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:₹|INR|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:payout|earned|total payout)/i
    ];

    for (const pat of payoutPatterns) {
      const pm = cleanSearchText.match(pat);
      if (pm && pm[1]) {
        payoutAmount = parseFloat(pm[1].replace(/,/g, '')) || 0;
        break;
      }
    }

    // 6. Guest Count Extraction
    let guests = 1;
    const guestsSectionMatch = cleanSearchText.match(/Guests?[\s:]+(\d+)\s*(?:adults?|guests?)?/i);
    if (guestsSectionMatch) {
      guests = parseInt(guestsSectionMatch[1], 10);
      const childMatch = cleanSearchText.match(/Guests?[\s:]+\d+\s*adults?,?\s*(\d+)\s*child/i);
      if (childMatch) guests += parseInt(childMatch[1], 10);
    }
    if (!guests || guests === 1) {
      const adultsMatch = cleanSearchText.match(/(\d+)\s+adults?/i);
      if (adultsMatch) guests = parseInt(adultsMatch[1], 10);
    }

    // 7. Door Code / Phone digits
    let doorCode = '';
    const codeDigits = cleanSearchText.match(/(?:door code|suggested door code|phone number \(last 4 digits\))[:\s]*(\d{4})/i);
    if (codeDigits) doorCode = codeDigits[1];

    return {
      confirmationCode: confirmationCode,
      guestName: guestName,
      roomId: matchedRoomId,
      propertyName: matchedPropName,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests || 1,
      totalAmount: payoutAmount,
      payoutAmount: payoutAmount,
      doorCode: doorCode
    };
  } catch (err) {
    Logger.log('Error parsing email: ' + err);
    return null;
  }
}

/**
 * ➕ Insert verified booking into Supabase
 */
function insertBookingToCRM(bk) {
  const bookingId = `BK_ABNB_${bk.confirmationCode}`;
  
  const payload = [{
    booking_id: bookingId,
    guest_name: bk.guestName,
    room_id: bk.roomId,
    property_name: bk.propertyName || null,
    booking_mode: 'Online-Airbnb',
    source: 'Airbnb',
    check_in: bk.checkIn,
    check_out: bk.checkOut,
    guests: bk.guests || 1,
    num_guests: bk.guests || 1,
    total_amount: bk.payoutAmount || 0,
    paid_amount: bk.payoutAmount || 0,
    balance_amount: 0,
    payout_amount: bk.payoutAmount || 0,
    per_day_rate: 0,
    payment_status: bk.payoutAmount > 0 ? 'Paid' : 'Pending CSV Payout',
    payment_method: 'Airbnb-Payout',
    payment_mode: 'Online-Airbnb',
    airbnb_confirmation_code: bk.confirmationCode,
    airbnb_reservation_code: bk.confirmationCode,
    phone: bk.doorCode ? `+91 XXXXX ${bk.doorCode}` : null,
    guest_phone: bk.doorCode ? `+91 XXXXX ${bk.doorCode}` : null,
    booked_by: 'Gmail Sync',
    verification_status: 'verified',
    status: 'confirmed',
    notes: `Synced from Gmail Airbnb Confirmation | Code: ${bk.confirmationCode}${bk.guests ? ' | Guests: ' + bk.guests : ''}`
  }];

  const insertUrl = `${CONFIG.SUPABASE_URL}/rest/v1/guest_register`;
  const resp = UrlFetchApp.fetch(insertUrl, {
    method: 'post',
    headers: getHeaders(),
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (resp.getResponseCode() >= 200 && resp.getResponseCode() < 300) {
    Logger.log(`SUCCESS: Created booking ${bookingId} for ${bk.guestName} (${bk.roomId}, ${bk.checkIn} to ${bk.checkOut}, Guests: ${bk.guests})`);
    
    // Also record net payout in payment_history if present
    if (bk.payoutAmount > 0) {
      try {
        const payUrl = `${CONFIG.SUPABASE_URL}/rest/v1/payment_history`;
        UrlFetchApp.fetch(payUrl, {
          method: 'post',
          headers: getHeaders(),
          payload: JSON.stringify([{
            booking_id: bookingId,
            amount: bk.payoutAmount,
            payment_mode: 'Online-Airbnb',
            payment_method: 'Airbnb-Payout',
            payment_type: 'Full Settlement',
            payment_date: bk.check_out || bk.checkIn,
            notes: `Net payout auto-synced from Gmail (${bk.confirmationCode})`,
            verification_status: 'verified'
          }]),
          muteHttpExceptions: true
        });
      } catch (ePay) {
        Logger.log('Payment record note: ' + ePay.message);
      }
    }
    return true;
  } else {
    Logger.log(`ERROR inserting booking: ${resp.getContentText()}`);
    return false;
  }
}

/**
 * 🔄 Enrich existing booking with authentic Gmail details
 */
function enrichBookingInCRM(existingBookingId, bk) {
  const patchPayload = {
    guest_name: bk.guestName,
    booked_by: 'Gmail Sync',
    verification_status: 'verified',
    notes: `Synced from Gmail Airbnb Confirmation | Code: ${bk.confirmationCode}${bk.guests ? ' | Guests: ' + bk.guests : ''}`
  };
  if (bk.guests) {
    patchPayload.guests = bk.guests;
    patchPayload.num_guests = bk.guests;
  }
  if (bk.doorCode) {
    patchPayload.phone = `+91 XXXXX ${bk.doorCode}`;
    patchPayload.guest_phone = `+91 XXXXX ${bk.doorCode}`;
  }
  if (bk.payoutAmount > 0) {
    patchPayload.total_amount = bk.payoutAmount;
    patchPayload.payout_amount = bk.payoutAmount;
    patchPayload.paid_amount = bk.payoutAmount;
    patchPayload.balance_amount = 0;
    patchPayload.payment_status = 'Paid';
  }

  const patchUrl = `${CONFIG.SUPABASE_URL}/rest/v1/guest_register?booking_id=eq.${existingBookingId}`;
  const resp = UrlFetchApp.fetch(patchUrl, {
    method: 'patch',
    headers: getHeaders(),
    payload: JSON.stringify(patchPayload),
    muteHttpExceptions: true
  });

  if (resp.getResponseCode() >= 200 && resp.getResponseCode() < 300) {
    Logger.log(`ENRICHED booking ${existingBookingId} -> Guest: ${bk.guestName}, Guests: ${bk.guests}`);
    
    // Also sync payment_history if payout amount is present
    if (bk.payoutAmount > 0) {
      try {
        const checkPayUrl = `${CONFIG.SUPABASE_URL}/rest/v1/payment_history?booking_id=eq.${existingBookingId}&select=id,amount`;
        const cResp = UrlFetchApp.fetch(checkPayUrl, { method: 'get', headers: getHeaders(), muteHttpExceptions: true });
        const existingPays = JSON.parse(cResp.getContentText() || '[]');
        if (existingPays && existingPays.length > 0) {
          UrlFetchApp.fetch(`${CONFIG.SUPABASE_URL}/rest/v1/payment_history?id=eq.${existingPays[0].id}`, {
            method: 'patch',
            headers: getHeaders(),
            payload: JSON.stringify({ amount: bk.payoutAmount, notes: 'Net payout synced from Gmail' }),
            muteHttpExceptions: true
          });
        } else {
          UrlFetchApp.fetch(`${CONFIG.SUPABASE_URL}/rest/v1/payment_history`, {
            method: 'post',
            headers: getHeaders(),
            payload: JSON.stringify([{
              booking_id: existingBookingId,
              amount: bk.payoutAmount,
              payment_mode: 'Online-Airbnb',
              payment_method: 'Airbnb-Payout',
              payment_type: 'Full Settlement',
              payment_date: bk.checkOut || bk.checkIn,
              notes: `Net payout auto-synced from Gmail (${bk.confirmationCode})`,
              verification_status: 'verified'
            }]),
            muteHttpExceptions: true
          });
        }
      } catch (ePay) {
        Logger.log('Payment update note: ' + ePay.message);
      }
    }
    return true;
  }
  return false;
}

/**
 * ❌ Handle Cancellation
 */
function handleCancellation(code, existingMap) {
  if (!code) return false;
  const existing = existingMap[code];
  if (existing && !existing.is_cancelled) {
    const updateUrl = `${CONFIG.SUPABASE_URL}/rest/v1/guest_register?airbnb_confirmation_code=eq.${code}`;
    UrlFetchApp.fetch(updateUrl, {
      method: 'patch',
      headers: getHeaders(),
      payload: JSON.stringify({
        is_cancelled: true,
        status: 'cancelled',
        notes: 'Cancelled on Airbnb (Gmail notification)'
      }),
      muteHttpExceptions: true
    });
    Logger.log(`Marked booking ${code} as CANCELLED.`);
    return true;
  }
  return false;
}

function getOrCreateLabel(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) {
    label = GmailApp.createLabel(name);
  }
  return label;
}

