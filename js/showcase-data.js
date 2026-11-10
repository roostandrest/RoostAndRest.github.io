/**
 * Roost And Rest Showcase Data & CMS Layer
 * ROOST AND REST STAYS • Lucknow, Uttar Pradesh
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'roost_showcase_data_v1';

  // Purge legacy Roost & Rest cache
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('tuhh_showcase_data_v215');
      localStorage.removeItem('uhhs_showcase_data_v1');
      localStorage.removeItem('uhhs_showcase_data_v2');
      localStorage.removeItem('uh_airbnb_audited_cache');
    }
  } catch (e) {}

  const BASELINE_PROPERTIES = {
  "RST-101": {
    "id": "RST-101",
    "unit_no": "101",
    "slug": "awadh-abode",
    "name": "Awadh Abode",
    "property_name": "Awadh Abode : Modern 2BHK in City Centre",
    "type": "2BHK Modern Flat",
    "category": "flat",
    "area": "city-centre",
    "area_name": "City Centre, Lucknow",
    "address": "City Centre, Lucknow, Uttar Pradesh",
    "rating": 4.92,
    "reviews": 18,
    "max_guests": 6,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3443,
    "airbnb_price": 3443,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1513689704038700506",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1513689704038700506/original/9b405a54-f22b-4de7-a965-05d3ff1e0767.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-102": {
    "id": "RST-102",
    "unit_no": "102",
    "slug": "green-leaf-corner",
    "name": "Green Leaf Corner",
    "property_name": "Green leaf Corner: 2Bhk in Lucknow",
    "type": "2BHK Flat",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Gomti Nagar, Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.88,
    "reviews": 24,
    "max_guests": 6,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3000,
    "airbnb_price": 3000,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1432351238708631534",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1432351238708631534/original/275e9ae8-50a2-4895-9bb3-abce94f0d920.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-103": {
    "id": "RST-103",
    "unit_no": "103",
    "slug": "moon-light-house",
    "name": "Moon Light House",
    "property_name": "Moon Light House: 3Bhk with garden",
    "type": "3BHK Villa with Garden",
    "category": "villa",
    "area": "lucknow",
    "area_name": "Lucknow Garden Area",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.95,
    "reviews": 32,
    "max_guests": 8,
    "bedrooms": 3,
    "bathrooms": 3,
    "base_price": 3600,
    "airbnb_price": 3600,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1403663140808704064",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1403663140808704064/original/dd177a7d-833a-40c2-95b9-b5aa3f39ac97.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-104": {
    "id": "RST-104",
    "unit_no": "104",
    "slug": "palladium-loft",
    "name": "Palladium Loft",
    "property_name": "Palladium Loft: Medanta Hospital | LuLu | Ekana",
    "type": "Luxury Loft",
    "category": "flat",
    "area": "shaheed-path",
    "area_name": "Near Medanta & LuLu Mall",
    "address": "Shaheed Path, Near LuLu Mall, Lucknow",
    "rating": 4.98,
    "reviews": 45,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3800,
    "airbnb_price": 3800,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1728065461825716832",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1728065461825716832/original/829b15d0-1a86-4123-8769-ee1b960953cd.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-105": {
    "id": "RST-105",
    "unit_no": "105",
    "slug": "peaceful-nest",
    "name": "Peaceful Nest",
    "property_name": "Peaceful Nest",
    "type": "Cozy Homestay",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow Central",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.9,
    "reviews": 15,
    "max_guests": 4,
    "bedrooms": 1,
    "bathrooms": 1,
    "base_price": 3250,
    "airbnb_price": 3250,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1472836855538423252",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1472836855538423252/original/44cd3e32-8c59-40c6-b389-3bf8da3acc84.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-106": {
    "id": "RST-106",
    "unit_no": "106",
    "slug": "the-awadh-retreat",
    "name": "The Awadh Retreat",
    "property_name": "The Awadh Retreat | Amity University",
    "type": "Executive Stay",
    "category": "flat",
    "area": "amity",
    "area_name": "Near Amity University, Gomti Nagar",
    "address": "Gomti Nagar, Lucknow",
    "rating": 4.91,
    "reviews": 20,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3600,
    "airbnb_price": 3600,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1754920271857081441",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754920271857081441/original/d8b0694b-88ac-487b-9316-7b4f370d2126.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-107": {
    "id": "RST-107",
    "unit_no": "107",
    "slug": "the-comfort-corner",
    "name": "The Comfort Corner",
    "property_name": "The Comfort Corner: 2BHK Centrally located",
    "type": "2BHK Central Flat",
    "category": "flat",
    "area": "central",
    "area_name": "Centrally Located Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.87,
    "reviews": 28,
    "max_guests": 6,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 2639,
    "airbnb_price": 2639,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1546149723330595826",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1546149723330595826/original/198c4447-ad8e-4dca-8f26-af3f552e7874.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-108": {
    "id": "RST-108",
    "unit_no": "108",
    "slug": "the-cozy-corner",
    "name": "The Cozy Corner",
    "property_name": "The Cozy Corner",
    "type": "1BHK Cozy Flat",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Gomti Nagar",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.85,
    "reviews": 19,
    "max_guests": 4,
    "bedrooms": 1,
    "bathrooms": 1,
    "base_price": 2800,
    "airbnb_price": 2800,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1765272258371576617",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1765272258371576617/original/5887cb69-b96f-4816-b4c4-844756337556.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-109": {
    "id": "RST-109",
    "unit_no": "109",
    "slug": "the-eighteenth",
    "name": "The Eighteenth",
    "property_name": "The Eighteenth: Amity Campus",
    "type": "Executive Flat",
    "category": "flat",
    "area": "amity",
    "area_name": "Near Amity Campus",
    "address": "Amity Campus, Lucknow",
    "rating": 4.93,
    "reviews": 12,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3200,
    "airbnb_price": 3200,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1778104021407872339",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1778104021407872339/original/32963758-29bc-4d07-9c3f-112e7940785f.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-110": {
    "id": "RST-110",
    "unit_no": "110",
    "slug": "the-family-fun-heaven",
    "name": "Family Fun Heaven",
    "property_name": "The Family Fun Heaven; 1BHK in posh locality",
    "type": "1BHK Posh Stay",
    "category": "flat",
    "area": "posh",
    "area_name": "Posh Locality, Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.89,
    "reviews": 16,
    "max_guests": 4,
    "bedrooms": 1,
    "bathrooms": 1,
    "base_price": 3000,
    "airbnb_price": 3000,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1381275814432030373",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1381275814432030373/original/69034a2c-d262-4579-b710-c7995e31acfe.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-111": {
    "id": "RST-111",
    "unit_no": "111",
    "slug": "the-grand-alcove",
    "name": "The Grand Alcove",
    "property_name": "The Grand Alcove : Krishnam Villa",
    "type": "Luxury Villa",
    "category": "villa",
    "area": "krishnam",
    "area_name": "Krishnam Villa, Lucknow",
    "address": "Krishnam Villa, Lucknow",
    "rating": 4.97,
    "reviews": 42,
    "max_guests": 8,
    "bedrooms": 4,
    "bathrooms": 4,
    "base_price": 6500,
    "airbnb_price": 6500,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1673624571406248647",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1673624571406248647/original/b0bfbd82-fc94-4229-94a8-118b7d80db77.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-112": {
    "id": "RST-112",
    "unit_no": "112",
    "slug": "the-luxe-haven",
    "name": "The Luxe Haven",
    "property_name": "The Luxe Haven : Gomti Nagar Extension",
    "type": "Luxury Homestay",
    "category": "flat",
    "area": "gomti-ext",
    "area_name": "Gomti Nagar Extension",
    "address": "Gomti Nagar Extension, Lucknow",
    "rating": 4.94,
    "reviews": 31,
    "max_guests": 6,
    "bedrooms": 3,
    "bathrooms": 3,
    "base_price": 4200,
    "airbnb_price": 4200,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1756974059274081131",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1756974059274081131/original/9c4d07d0-50c6-46fb-b70a-b8007d1e0910.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-113": {
    "id": "RST-113",
    "unit_no": "113",
    "slug": "the-monarch-suites",
    "name": "The Monarch Suites",
    "property_name": "The Monarch Suites",
    "type": "Executive Suite",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow Central",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.9,
    "reviews": 14,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3500,
    "airbnb_price": 3500,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1759943752045444261",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1759943752045444261/original/35df2128-4c72-418b-8c0b-e6da033a9921.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-114": {
    "id": "RST-114",
    "unit_no": "114",
    "slug": "the-nestora",
    "name": "The Nestora",
    "property_name": "The Nestora",
    "type": "Boutique Homestay",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.88,
    "reviews": 11,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3200,
    "airbnb_price": 3200,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1758780588353629399",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1758780588353629399/original/822ce740-7146-4bd3-aae4-ef5e9756e2bb.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-115": {
    "id": "RST-115",
    "unit_no": "115",
    "slug": "the-nivora-nest",
    "name": "The Nivora Nest",
    "property_name": "The Nivora Nest- A cozy retreat for memorable stay",
    "type": "Cozy Retreat",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.92,
    "reviews": 22,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3100,
    "airbnb_price": 3100,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1754941277309610915",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1754941277309610915/original/dc389cd9-7fdc-4ca1-aff8-eccc1bb8d9a4.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-116": {
    "id": "RST-116",
    "unit_no": "116",
    "slug": "the-rustic-anjuman",
    "name": "The Rustic Anjuman",
    "property_name": "The Rustic Anjuman : A day in Gray and white",
    "type": "Thematic Designer Flat",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.89,
    "reviews": 17,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3300,
    "airbnb_price": 3300,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1311579015127768002",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1311579015127768002/original/194e0123-70f8-4d6f-a511-cd10ab4ab4b9.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-117": {
    "id": "RST-117",
    "unit_no": "117",
    "slug": "the-zenvana",
    "name": "The Zenvana",
    "property_name": "The Zenvana:A Peaceful Retreat like blissful scape",
    "type": "Peaceful Retreat",
    "category": "flat",
    "area": "lucknow",
    "area_name": "Lucknow",
    "address": "Lucknow, Uttar Pradesh",
    "rating": 4.95,
    "reviews": 25,
    "max_guests": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "base_price": 3400,
    "airbnb_price": 3400,
    "cover_image": "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp",
    "airbnb_id": "1700681506593234895",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "living_hall": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "kitchen": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ],
      "bathrooms": [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-1700681506593234895/original/6500a33c-c7c9-4bd6-8ea8-84f9c09e9014.jpeg?im_w=720&amp;width=720&amp;quality=70&amp;auto=webp"
      ]
    }
  },
  "RST-118": {
    "id": "RST-118",
    "unit_no": "118",
    "slug": "roost-presidential-suite",
    "name": "Presidential Suite",
    "property_name": "Roost Presidential Suite : Luxury Stay",
    "type": "Luxury Penthouse",
    "category": "villa",
    "area": "gomti-nagar",
    "area_name": "Gomti Nagar, Lucknow",
    "address": "Gomti Nagar, Lucknow",
    "rating": 4.99,
    "reviews": 50,
    "max_guests": 6,
    "bedrooms": 3,
    "bathrooms": 3,
    "base_price": 4500,
    "airbnb_price": 4500,
    "cover_image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "airbnb_id": "roost_suite_118",
    "map_link": "https://maps.google.com/?q=Lucknow+Uttar+Pradesh",
    "map_embed": "",
    "photos": {
      "bedrooms": [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ],
      "living_hall": [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ],
      "kitchen": [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ],
      "bathrooms": [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  }
};

  function loadShowcaseData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch(e) {}
    return BASELINE_PROPERTIES;
  }

  function getProperty(roomId) {
    if (!roomId) return null;
    const all = loadShowcaseData();
    return all[roomId] || BASELINE_PROPERTIES[roomId] || null;
  }

  function getAll() {
    return loadShowcaseData();
  }

  window.ShowcaseData = {
    BASELINE: BASELINE_PROPERTIES,
    getAll,
    getProperty,
    saveProperty(roomId, data) {
      const all = loadShowcaseData();
      all[roomId] = { ...(all[roomId] || BASELINE_PROPERTIES[roomId] || {}), ...data };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch(e){}
    }
  };
})(window);
