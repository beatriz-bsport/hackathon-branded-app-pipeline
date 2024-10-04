export const CONSUMER_SPACE_MOBILE_BREAKPOINT = 930;
export const CONSUMER_SPACE_MODAL_TO_DRAWER_BREAKPOINT = 950;

export const NEW_MEMBER_PROFILE_ROUTE_LIST = [
  'booking',
  'subscription',
  'invoice',
  'pack',
];

/**
 * The context from where the consumer space is accessed from.
 * This enum is used to compute various things including navigation elements.
 */
export enum ConsumerSpaceContextEnum {
  WEB = 'WEB',
  WIDGET = 'WIDGET',
  FAB = 'FAB',
  LOGIN_BUTTON = 'LOGIN_BUTTON',
}

/**
 * @description A list of company IDs that will be able to see the new member profile in production env
 * for local/dev/staging its always displayed
 */
export const NEW_MEMBER_PROFILE_COMPANY_ID_LIST = [
  // Julie Ferrez Coaching
  86,
  // Air Studio
  92,
  // LE LOFT BOXING
  103,
  // Body Works Pilates
  107,
  // GYROTONIC®: Aix-en-Provence
  130,
  // Satya Yoga
  139,
  // L’Alchimie des Corps
  185,
  // Sporten Voor je Deur
  198,
  // Pole Dance Strasbourg
  246,
  // Julie Lédée
  265,
  // Studio Métamorphose
  366,
  // Petite Forêt
  380,
  // Les Petites Explorations
  388,
  // Studio Béatrice Laurent
  392,
  // VAYOGA Yoga and Pilates Studio
  394,
  // Pilates Zug
  401,
  // Sea Inside Studio
  410,
  // MBE Venerque - Location de Salle
  423,
  // Healthy Fit
  447,
  // Youpole
  451,
  // La Petite Salle
  467,
  // Espace Anahata
  488,
  // Yoga Reims Graines De Yogi
  504,
  // MV Coaching
  543,
  // Better Body Club
  582,
  // Core Clapton
  608,
  // White Crane Kung Fu
  640,
  // Studiofive Reformer Pilates
  650,
  // Mens and Kinders
  689,
  // Pilates Sheen & Richmond
  700,
  // The Studio
  765,
  // Pilates Evolved
  781,
  // CoreLab Pilates
  847,
  // My Mind Studio
  924,
  // SUKUN
  947,
  // Le Hook
  959,
  // La Canopée
  960,
  // Marjorie Jamin Pilates
  1014,
  // Emmanuelle Yoga
  1041,
  // Mérignac Yoga
  1058,
  // Bright Panda
  1061,
  // Athletic Zone Ajaccio
  1128,
  // Siwicki Fitness
  1191,
  // YOLYSHINE
  1193,
  // Ajna Tempel
  1215,
  // Walrus
  1260,
  // Sport To Be
  1317,
  // Polestar Benelux
  1323,
  // Bungee Fit
  1324,
  // Studio Sage
  1326,
  // Kind Human Yoga
  1352,
  // Eagle Pole Studio
  1381,
  // Corepilates
  1390,
  // Yoga Pour Tous EU
  1391,
  // Olympia Performance
  1421,
  // Estérelle Martin
  1489,
  // LJM Fitness
  1544,
  // Le Studio Privé
  1562,
  // Stretch and Fold
  1567,
  // Shego Pilates
  1642,
  // Little Pandas
  1668,
  // JOSEPHINE LE STUDIO
  1698,
  // De Flow Studio
  1717,
  // Reform Nijmegen
  1733,
  // UMAN PROJECT
  1734,
  // Yoga 108
  1738,
  // De Pilatesjuf
  1740,
  // Project You Altrincham
  1749,
  // Aix Power Yoga
  1756,
  // Dayananda Yoga
  1761,
  // Pilates From Within
  1789,
  // Serrah Sport
  1802,
  // Yoga 6 bis
  1809,
  // Mana'Danse
  1879,
  // Atelier Yoga
  1881,
  // Flowcare
  1895,
  // Pole Dance Tours
  1908,
  // GyM 21
  1911,
  // Twerkmama
  1913,
  // Allesheid
  1919,
  // Bachatadansschool El Bachatero
  1997,
  // Omgeven
  2009,
  // Lewis Parker Golf
  2014,
  // Flow Shala - Affinitee
  2018,
  // Sarana Wellness Center
  2022,
  // Cork Lotus Yoga
  2045,
  // FLEXSPORT
  2047,
  // The Rebel Circus
  2053,
  // LINE AIR STUDIO
  2056,
  // Le Studio Rouen Beauvoisine
  2069,
  // Decibel
  2073,
  // Vinyasa Krama Mandiram
  2083,
  // I Hate Jim
  2086,
  // Tudù Studio ASD
  2091,
  // Sukha Yoga Berlin
  2092,
  // Constant Fitness
  2129,
  // Sannes Yoga Journey
  2148,
  // Peregrine Pilates
  2179,
  // Align Studio
  2227,
  // Urban Recharge
  2233,
  // Posture Physio
  2247,
  // Yoga Station
  2252,
  // Yogastable Place2BElinda
  2253,
  // Loving Pilates
  2282,
  // Pilatesyogi
  2290,
  // Mint Body and Mind
  2294,
  // De Yogawereld
  2296,
  // Mindfulife
  2327,
  // Chateau Velo
  2357,
  // youFloria
  2359,
  // Bom Dia Movement Club
  2371,
  // Eternity Health Club
  2400,
  // Fitness4Ladies
  2405,
  // Namahsteef
  2434,
  // SPACE Cycle
  2440,
  // DRIP
  2441,
  // POSES
  2442,
  // Le Cercle
  2443,
  // Aqua by
  2444,
  // Free Flow Studios
  2447,
  // studio.life
  2457,
  // alive Berlin
  2472,
  // Premium Pilates
  2474,
  // Premier Bain
  2478,
  // Pure Flow Studio
  2505,
  // Buurtcentrum De Mussen
  2513,
  // Serenity Studio
  2543,
  // Tatjana Wegweiser
  2595,
  // The Connection Studio
  2619,
  // Yoga by Denise Brenner
  2630,
  // Inspir’yoga
  2634,
  // Re-Gen Studios
  2652,
  // Nodè
  2659,
  // Other Rhythm
  2674,
  // Tanzschule TIME
  2676,
  // Mr & Mrs Pilates
  2680,
  // Centro Olistico Wellness Euritmia
  2685,
  // OGGAplay
  2693,
  // Ayana Pilates Studio
  2694,
  // Mujō
  2697,
  // Project X by Jay
  2699,
  // Tribe Headingley
  2702,
  // The Sanctuary Group
  2712,
  // Rebeca Yague Bachata
  2729,
  // D’Ose
  2733,
  // Yoga with Vibhu
  2742,
  // Alma Physiotherapy
  2765,
  // SALISEO STUDIO
  2767,
  // STUDIO4
  2772,
  // The Studio with Tasha
  2780,
  // CEIBA
  2790,
  // SCENE Unity
  2850,
  // Melissa Montil
  2855,
  // Chloe Bruce HQ
  2882,
  // Imaginal Pilates Studio
  2884,
  // Imke Beck - Yoga & Co.
  2892,
  // Pilates Donegal
  2915,
  // Coach Esther
  2922,
  // WELLNESS EXPERIENCE STUDIO
  2924,
  // Yoganaue
  2927,
  // Kathrin Berg Yoga
  2931,
  // Yoga Ranch
  2952,
  // Alma
  2957,
  // The Driven Club
  2981,
  // Omega Perfect Space
  2983,
  // Chand Taran Yoga
  2988,
  // BachatAcademy
  2998,
  // Shanti Vida
  3007,
  // Heikes Powerhouse
  3013,
  // Triathlon Crew Berlin
  3018,
  // Pilates by Mandy
  3025,
  // yopi Friedrichshafen
  3030,
];
