// ══════════════════════════════════════════════════════════════════
// ROOST AND REST — 18 PROPERTY COVER PHOTOS (AIRBNB LIVE SYNC)
// Lucknow, Uttar Pradesh
// ══════════════════════════════════════════════════════════════════

window.ROOST_PROPERTY_IMAGES = {
  "RST-101": "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-102": "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-103": "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-104": "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-105": "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-106": "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-107": "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-108": "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-109": "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-110": "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-111": "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-112": "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-113": "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-114": "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-115": "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-116": "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-117": "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&width=720&quality=70&auto=webp",
  "RST-118": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
};

// Helper function to resolve property cover photo
window.getRoostPropertyCover = function(roomId, fallback = 'assets/logo.svg') {
  if (!roomId) return fallback;
  return window.ROOST_PROPERTY_IMAGES[roomId] || fallback;
};
