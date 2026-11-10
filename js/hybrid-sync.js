// ═══════════════════════════════════════════════════════════
// 🔄 HYBRID SYNC — All 17 Properties Real-Time iCal + Calendar Lock
// ═══════════════════════════════════════════════════════════

window.HYBRID_SYNC = {
  properties: {
    'RST-101': { name: 'Awadh Abode', ical_url: 'https://www.airbnb.co.in/calendar/ical/1513689704038700506.ics?t=b9e8a21c7718477f8b95d213e832e9cd' },
    'RST-102': { name: 'Green Leaf Corner', ical_url: 'https://www.airbnb.co.in/calendar/ical/1432351238708631534.ics?t=8498fb5a52184b7e9c826aba690c4b9d' },
    'RST-103': { name: 'Moon Light House', ical_url: 'https://www.airbnb.co.in/calendar/ical/1403663140808704064.ics?t=7bddd562aa00490da3a1d3b3a0b536dc' },
    'RST-104': { name: 'Palladium Loft', ical_url: 'https://www.airbnb.co.in/calendar/ical/1728065461825716832.ics?t=95e3edfec78146a3b63e991e3303a24b' },
    'RST-105': { name: 'Peaceful Nest', ical_url: 'https://www.airbnb.co.in/calendar/ical/1472836855538423252.ics?t=b8ba888f94d040dba5bfe46435fe74e8' },
    'RST-106': { name: 'The Awadh Retreat', ical_url: 'https://www.airbnb.co.in/calendar/ical/1754920271857081441.ics?t=59e07204bbca41a6b990e81898beea12' },
    'RST-107': { name: 'The Comfort Corner', ical_url: 'https://www.airbnb.co.in/calendar/ical/1546149723330595826.ics?t=a164bc339ef147b6804073a19d70755b' },
    'RST-108': { name: 'The Cozy Corner', ical_url: 'https://www.airbnb.co.in/calendar/ical/1765272258371576617.ics?t=b0d6e306287542a5aab37399312868cf' },
    'RST-109': { name: 'The Eighteenth', ical_url: 'https://www.airbnb.co.in/calendar/ical/1778104021407872339.ics?t=ba283b13da304386a53cae5453999dcf' },
    'RST-110': { name: 'Family Fun Heaven', ical_url: 'https://www.airbnb.co.in/calendar/ical/1381275814432030373.ics?t=3c68438d154a44d4a599e44da077fdce' },
    'RST-111': { name: 'The Grand Alcove', ical_url: 'https://www.airbnb.co.in/calendar/ical/1673624571406248647.ics?t=da4b12b0b4394adea2dd1cc9b1076dd7' },
    'RST-112': { name: 'The Luxe Haven', ical_url: 'https://www.airbnb.co.in/calendar/ical/1756974059274081131.ics?t=b261f31d420043cfb6efb6251faab076' },
    'RST-113': { name: 'The Monarch Suites', ical_url: 'https://www.airbnb.co.in/calendar/ical/1759943752045444261.ics?t=650ed376ab8d46f1b1d5952f67c15715' },
    'RST-114': { name: 'The Nestora', ical_url: 'https://www.airbnb.co.in/calendar/ical/1758780588353629399.ics?t=75869dda3fc84e539526c4ea3ed72762' },
    'RST-115': { name: 'The Nivora Nest', ical_url: 'https://www.airbnb.co.in/calendar/ical/1754941277309610915.ics?t=6e51c92ebde64a44afd3e458567649e8' },
    'RST-116': { name: 'The Rustic Anjuman', ical_url: 'https://www.airbnb.co.in/calendar/ical/1311579015127768002.ics?t=c8643707c3f64209a5df88ec437a971e' },
    'RST-117': { name: 'The Zenvana', ical_url: 'https://www.airbnb.co.in/calendar/ical/1700681506593234895.ics?t=39b3c1418cc348cdab4910f2a7fcbb8a' },
    'RST-118': { name: 'The Nawab House / Presidential Suite', ical_url: 'https://www.airbnb.co.in/calendar/ical/1772311030162498401.ics?t=f1f228935cb249a2916a8a116ed9a521' }
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
