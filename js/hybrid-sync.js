// ═══════════════════════════════════════════════════════════
// 🔄 HYBRID SYNC — All 17 Properties Real-Time iCal + Calendar Lock
// ═══════════════════════════════════════════════════════════

window.HYBRID_SYNC = {
  properties: {
    'RST-101': { name: 'Awadh Abode', ical_url: '' },
    'RST-102': { name: 'Green Leaf Corner', ical_url: '' },
    'RST-103': { name: 'Moon Light House', ical_url: '' },
    'RST-104': { name: 'Palladium Loft', ical_url: '' },
    'RST-105': { name: 'Peaceful Nest', ical_url: '' },
    'RST-106': { name: 'The Awadh Retreat', ical_url: '' },
    'RST-107': { name: 'The Comfort Corner', ical_url: '' },
    'RST-108': { name: 'The Cozy Corner', ical_url: '' },
    'RST-109': { name: 'The Eighteenth', ical_url: '' },
    'RST-110': { name: 'Family Fun Heaven', ical_url: '' },
    'RST-111': { name: 'The Grand Alcove', ical_url: '' },
    'RST-112': { name: 'The Luxe Haven', ical_url: '' },
    'RST-113': { name: 'The Monarch Suites', ical_url: '' },
    'RST-114': { name: 'The Nestora', ical_url: '' },
    'RST-115': { name: 'The Nivora Nest', ical_url: '' },
    'RST-116': { name: 'The Rustic Anjuman', ical_url: '' },
    'RST-117': { name: 'The Zenvana', ical_url: '' },
    'RST-118': { name: 'Roost Presidential Suite', ical_url: '' }
  },
  mergedBookings: [],
  timerId: null,

  parseICS: function(icsText, roomId) {
    const events = [];
    const blocks = icsText.split('BEGIN:VEVENT');

    for (let i = 1; i < blocks.length; i++) {
      const b = blocks[i];
      const getVal = key => {
        const match = b.match(new RegExp(key + ':(.*)'));
        return match ? match[1].trim() : '';
      };

      const dtStart = getVal('DTSTART;VALUE=DATE') || getVal('DTSTART');
      const dtEnd = getVal('DTEND;VALUE=DATE') || getVal('DTEND');
      const summary = getVal('SUMMARY');
      const description = getVal('DESCRIPTION');
      const uid = getVal('UID');

      if (dtStart && dtEnd) {
        const formatDate = dStr => {
          const s = dStr.replace(/[^0-9]/g, '');
          if (s.length >= 8) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
          return dStr;
        };

        const checkIn = formatDate(dtStart);
        const checkOut = formatDate(dtEnd);

        // Blocked slot syncing disabled per user request: Only real online bookings allowed, NO offline/blocked slots!
        // Do not add blocked events to events array
      }
    }
    return events;
  },

  syncAllProperties: async function() {
    console.log('ℹ️ Hybrid Sync: Blocked slots creation is permanently disabled. Only real online bookings are synced via ical-sync.');
    return;
  },

  startAutoSync: function() {
    console.log('ℹ️ Hybrid Sync auto-sync is disabled.');
  },

  getStatus: function() {
    return {
      total_properties: Object.keys(this.properties).length,
      auto_sync: !!this.timerId
    };
  }
};

if (typeof window !== 'undefined') {
  if (window.HYBRID_SYNC) {
    window.HYBRID_SYNC.startAutoSync = function() {
      console.log('ℹ️ Auto-sync disabled. Use manual refresh button to sync.');
    };
  }
}
