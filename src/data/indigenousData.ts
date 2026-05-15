export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface GroupMetadata {
  summary: string;
  language_family: string;
  legal_status: string;
  population_projection_2026?: string;
}

export interface IndigenousGroup {
  id: string;
  family_id: string; // The parent linguistic or ethnic family (e.g., 'uralic', 'niger_congo', 'caucasus', 'austronesian')
  familyName: string; // User-friendly family name
  name: string;
  region: 'Americas' | 'Asia' | 'Europe' | 'Africa' | 'Oceania';
  location: GeoLocation;
  category: 'Indigenous' | 'Stateless' | 'Isolated';
  population_count: number;
  color_hex: string; // Specified regional base color
  gradient_specs: string; // Unique linear gradient string for the tribe
  metadata: GroupMetadata;
}

export const INDIGENOUS_GROUPS: IndigenousGroup[] = [
  // --- URALIC / ARCTIC KINSHIP ---
  {
    id: "sami",
    family_id: "uralic",
    familyName: "Uralic Arctic Family",
    name: "Sámi",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 69.0, longitude: 20.0 },
    population_count: 85000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #009999, #00E1E1)",
    metadata: {
      summary: "Transnational Arctic people inhabiting Sápmi (Norway, Sweden, Finland, Russia). They are renowned for reindeer herding, deep ecological knowledge, and active struggles for self-determination against corporate land encroachment, specifically wind power developments.",
      language_family: "Uralic (Finno-Ugric branch)",
      legal_status: "Officially recognized as the only Indigenous people in the European Union. Protected under national laws with parliamentary systems, but facing massive land-use disputes.",
      population_projection_2026: "91,500 (Projected growth: +1.5% annually)"
    }
  },
  {
    id: "nenets",
    family_id: "uralic",
    familyName: "Uralic Arctic Family",
    name: "Nenets",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 67.0, longitude: 70.0 },
    population_count: 45000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #058282, #004d4d)",
    metadata: {
      summary: "An indigenous Samoyedic people of the Russian Arctic. Renowned for maintaining large-scale nomadic reindeer pastoralism and migrating over 1000km annually across the Yamal Peninsula amid intense natural gas extraction pressures.",
      language_family: "Uralic (Samoyedic branch)",
      legal_status: "Recognized as 'Indigenous Small-Numbered Peoples of the North'. Subject to severe environment disruption from extraction, with fragile land guarantees.",
      population_projection_2026: "47,200 (Nomadic populations stable)"
    }
  },
  {
    id: "komi",
    family_id: "uralic",
    familyName: "Uralic Arctic Family",
    name: "Komi",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 64.0, longitude: 55.0 },
    population_count: 320000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #1f6b6b, #103333)",
    metadata: {
      summary: "A Uralic-speaking community in northeastern European Russia. Famous for their historical Izhma subgroups who integrated reindeer herding with agriculture, forming a highly resilient Arctic socio-economic system.",
      language_family: "Uralic (Permic branch)",
      legal_status: "State-recognized minority with autonomous republic status, but experiencing significant language shift and cultural assimilation.",
      population_projection_2026: "312,000 (Slight decline due to out-migration)"
    }
  },
  {
    id: "veps",
    family_id: "uralic",
    familyName: "Uralic Arctic Family",
    name: "Veps",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 61.0, longitude: 35.0 },
    population_count: 60000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #4d9696, #003333)",
    metadata: {
      summary: "An ancient Finnic ethnic group inhabiting the lakes and woodlands of northwestern Russia. They maintain traditional woodcarving, forest rituals, and distinctive folklore adjacent to Lake Onega.",
      language_family: "Uralic (Finnic branch)",
      legal_status: "Officially listed on the Russian Federation's Register of Indigenous Small-Numbered Peoples. Highly endangered, active language revival programs are underway.",
      population_projection_2026: "5,800 (Highly endangered dialect core)"
    }
  },
  {
    id: "koryaks",
    family_id: "uralic",
    familyName: "Uralic Arctic Family",
    name: "Koryaks",
    region: "Europe", // Geopolitically annotated as Russia region
    category: "Indigenous",
    location: { latitude: 60.0, longitude: 165.0 },
    population_count: 8000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00b3b3, #022020)",
    metadata: {
      summary: "An indigenous people of the Russian Far East, residing in Kamchatka Krai. Traditionally split into maritime whale-hunters and inland reindeer herders, they hold deep animistic custom preservation.",
      language_family: "Chukotko-Kamchatkan Family",
      legal_status: "Protected under national laws as an indigenous minority with regional representations, but hunting territory is shrinking due to state leasing.",
      population_projection_2026: "8,200 (Stable birth rates)"
    }
  },

  // --- SUB-SAHARAN AFRICA / NIGER-CONGO (WEST AFRICA) ---
  {
    id: "pulaar",
    family_id: "niger_congo",
    familyName: "Niger-Congo Western Family",
    name: "Pulaar",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 15.5, longitude: -14.5 },
    population_count: 3500000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #FFCC00, #CC9900)",
    metadata: {
      summary: "Also known as Toucouleur or Fula, this community in northern Senegal has a rich history centered on Islamic civilization, scholarly dynasties, and agricultural cultivation along the Senegal River basin.",
      language_family: "Niger-Congo (Atlantic branch)",
      legal_status: "Recognized national minority language. Strong civic representation, though suffering from climate-induced water degradation.",
      population_projection_2026: "3,750,000 (Robust regional demographics)"
    }
  },
  {
    id: "serer",
    family_id: "niger_congo",
    familyName: "Niger-Congo Western Family",
    name: "Serer",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 14.3, longitude: -16.6 },
    population_count: 1800000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #E6B800, #B38F00)",
    metadata: {
      summary: "One of Senegal's most culturally distinct groups, historic guardians of traditional cosmology, sacred groves, and a complex system of agricultural and maritime stewardship in the Saloum Delta.",
      language_family: "Niger-Congo (Senegambian)",
      legal_status: "Recognized as a primary ethnic pillar of Senegal. Protected cultural heritage sites exist, but traditional religions are increasingly marginalized.",
      population_projection_2026: "1,920,000 (High retention of ancestral heritage)"
    }
  },
  {
    id: "jola",
    family_id: "niger_congo",
    familyName: "Niger-Congo Western Family",
    name: "Jola",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 12.8, longitude: -16.3 },
    population_count: 900000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #CC6600, #994C00)",
    metadata: {
      summary: "Inhibit the forested Casamance region of Senegal. They represent a fierce culture of decentralized egalitarian villages, legendary wet-rice farming systems, and preservation of animistic forest shrines.",
      language_family: "Niger-Congo (Bak branch)",
      legal_status: "Subject to long-standing peace processes after a historic struggle for political autonomy. Strong local land tenure traditions.",
      population_projection_2026: "945,000 (Resilient forest communities)"
    }
  },
  {
    id: "mandinka",
    family_id: "niger_congo",
    familyName: "Niger-Congo Western Family",
    name: "Mandinka",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 13.5, longitude: -14.5 },
    population_count: 2000000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #B35900, #804000)",
    metadata: {
      summary: "Inheritors of the historic Manden Charter and Mali Empire. Renowned for their complex lineage, traditional kora musicians (Griots), and deep agricultural mastery across West African borderlands.",
      language_family: "Niger-Congo (Mande branch)",
      legal_status: "Recognized majority-minority across Senegal and Gambia. Culturally safeguarded by UNESCO declarations for oral traditions.",
      population_projection_2026: "2,150,000 (Highly integrated but distinct)"
    }
  },
  {
    id: "soninke",
    family_id: "niger_congo",
    familyName: "Niger-Congo Western Family",
    name: "Soninke",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 14.5, longitude: -12.5 },
    population_count: 1500000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #FFA64D, #EA7E15)",
    metadata: {
      summary: "Founders of the ancient Ghana Empire (Wagadou). A highly organized, trading-centric culture with strong migratory networks across the globe, yet retaining language centers in the upper Senegal River.",
      language_family: "Niger-Congo (Mande branch)",
      legal_status: "Constitutionally recognized national language in Senegal and Mali, high communal resource self-reliance.",
      population_projection_2026: "1,610,000 (Supported by robust diaspora ties)"
    }
  },

  // --- SUB-SAHARAN NIGER-CONGO (BENIN / GULF OF GUINEA) ---
  {
    id: "otamari",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Otamari",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 10.3, longitude: 1.3 },
    population_count: 250000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FF9900, #CC6600)",
    metadata: {
      summary: "Inhabiting the Atakora mountain range of northwestern Benin. Famous for their masterfully fortified 'Tata Somba' mud-tower castles, which exemplify defensive, sustainable architecture and rich traditional cosmology and scarification.",
      language_family: "Niger-Congo (Oti-Volta / Gur branch)",
      legal_status: "Under threat of agricultural modernization and tourism commercialization; local initiatives protect cultural architecture and sacred forest rights.",
      population_projection_2026: "268,000 (Tata somba heritage preservation active)"
    }
  },
  {
    id: "bariba",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Bariba",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 10.2, longitude: 2.0 },
    population_count: 1200000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FF9F1C, #CC5A01)",
    metadata: {
      summary: "Historically governed under the Borgu Kingdom. Outstanding equestrian traditions and the annual Gani festival celebrate ancestral warrior lineage and local political configurations.",
      language_family: "Niger-Congo (Gur isolate)",
      legal_status: "Recognized regional group. Traditional kingdoms operate as de-facto cultural courts alongside national legal bodies.",
      population_projection_2026: "1,290,000 (Robust cultural cohesion)"
    }
  },
  {
    id: "boo",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Boo",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 10.4, longitude: 2.5 },
    population_count: 120000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #E28413, #9A5200)",
    metadata: {
      summary: "An agricultural, close-knit group bordering Niger and Benin. They preserve ancestral land-tenure patterns and smallholder cotton/yam farming techniques resilient to climate stress.",
      language_family: "Niger-Congo (Mande branch)",
      legal_status: "Subject to trans-border immigration constraints. Limited state educational support in their native language.",
      population_projection_2026: "124,000 (Yam smallholders resilient)"
    }
  },
  {
    id: "boko",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Boko",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 10.1, longitude: 3.2 },
    population_count: 150000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #F9A03F, #C85A17)",
    metadata: {
      summary: "Linguistically distinctive ethno-linguistic community in Nigeria and Benin borderlands. Practicing ancient soil rotation methods and celebrating harvest rites tied to mountain spirits.",
      language_family: "Niger-Congo (Mande / Busa branch)",
      legal_status: "State recognized but receiving inadequate public budget or infrastructure for their isolated regions.",
      population_projection_2026: "158,000 (Traditional harvests stable)"
    }
  },
  {
    id: "nagot",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Nagot",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 8.0, longitude: 2.5 },
    population_count: 300000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FBB13C, #BB7B00)",
    metadata: {
      summary: "A Yoruboid group in central Benin carrying forward deep Orisha spiritual lineages, intricate masking societies (Gelede), and highly developed palm agro-forestry systems.",
      language_family: "Niger-Congo (Defoid branch)",
      legal_status: "Traditional monarchies recognized; Gelede rituals are labeled UNESCO Intangible Cultural Heritage.",
      population_projection_2026: "318,000 (Gelede traditions active)"
    }
  },
  {
    id: "idaasha",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Idaasha",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 7.8, longitude: 2.3 },
    population_count: 110000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #EA8C06, #7F4D00)",
    metadata: {
      summary: "Nestled in the central hills of Benin. Proud of their impenetrable hill-refuge legacy which historically protected them from transatlantic and tribal slave raids.",
      language_family: "Niger-Congo (Yoruboid branch)",
      legal_status: "Vulnerable to rapid urban drift; advocating for historical landmark protections for ancestral cave shrines.",
      population_projection_2026: "116,000 (Preserving mountain caves)"
    }
  },
  {
    id: "holli",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Holli-Dje",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 7.0, longitude: 2.7 },
    population_count: 80000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FFA07A, #CD5C5C)",
    metadata: {
      summary: "Dwelling in the dense sacred forests of the interior. They successfully repelled French colonial taxes via dynamic forest defenses. Continuing to practice ancient forest-clonage herbal medicine.",
      language_family: "Niger-Congo (Yoruba group)",
      legal_status: "Unrecognized officially. Customary forest kings maintain legal and spiritual dispute resolutions.",
      population_projection_2026: "84,000 (Forest medicine guards)"
    }
  },
  {
    id: "ife_benin",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Ife",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 7.5, longitude: 1.2 },
    population_count: 180000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FFBF00, #E49B0F)",
    metadata: {
      summary: "Transnational community across the Togo-Benin boundary. Known for preserving an archaic variant of the Ife language and carrying pristine lineage patterns of clay pottery.",
      language_family: "Niger-Congo (Defoid branch)",
      legal_status: "Subject to administrative challenges of dual nationality across regional West African borders.",
      population_projection_2026: "191,000 (Dual nationality challenges)"
    }
  },
  {
    id: "mokole",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Mokole",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 9.8, longitude: 1.6 },
    population_count: 95000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #D4AF37, #AA7C11)",
    metadata: {
      summary: "A distinctive Yoruba-descent community residing peacefully amongst Bariba lands in northern Benin. They evolved unique multilingual roles and intermediate conflict arbitration systems.",
      language_family: "Niger-Congo (Edekiri branch)",
      legal_status: "Linguistic minority receiving limited scholastic representations. Autonomy protected via village clan alliances.",
      population_projection_2026: "99,000 (Conflict mediators active)"
    }
  },
  {
    id: "chabe",
    family_id: "niger_congo_benin",
    familyName: "Niger-Congo Oti-Volta Family",
    name: "Chabe",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 8.0, longitude: 2.4 },
    population_count: 140000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #E5A93B, #9B6B0E)",
    metadata: {
      summary: "Possess an ancient monarchical seat in central Benin. Famous for maintaining an unbroken list of kings (Onisabe) and protecting pre-colonial crop reserve architectures.",
      language_family: "Niger-Congo (Defoid branch)",
      legal_status: "Monarchical authority recognized informally. High cultural sovereignty but youth out-migration is rapid.",
      population_projection_2026: "148,000 (Monarch ritual cycle intact)"
    }
  },

  // --- AMERICAS ---
  {
    id: "inuit",
    family_id: "americas_indigenous",
    familyName: "Indigenous Peoples of Arctic Americas",
    name: "Inuit",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 70.0, longitude: -90.0 },
    population_count: 170000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #CC0000, #800000)",
    metadata: {
      summary: "Stretching across the circumpolar Arctic regions of Canada, Greenland, and Alaska. Masters of freeze-landscape adaptation, ocean resource navigation, and leading international indigenous climate change action.",
      language_family: "Inuit-Yupik-Unangan (Eskimo-Aleut)",
      legal_status: "Protected under landmark treaty agreements (e.g. Nunavut Land Claims Agreement), but face extreme global warming threat to native ice ways.",
      population_projection_2026: "182,000 (Active territorial governance)"
    }
  },
  {
    id: "yanomami",
    family_id: "americas_indigenous",
    familyName: "Indigenous Peoples of Arctic Americas",
    name: "Yanomami",
    region: "Americas",
    category: "Isolated",
    location: { latitude: 2.5, longitude: -63.0 },
    population_count: 38000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #CC3333, #660000)",
    metadata: {
      summary: "Inhabiting the deep Amazonian rainforest on the border of Brazil and Venezuela. Live in large communal houses ('shabonos') and face catastrophic humanitarian and genocidal threats from illegal gold miners ('garimpeiros').",
      language_family: "Yanomaman Language Family",
      legal_status: "Officially demarcated Territory in Brazil, but de facto protection is extremely weak, suffering from toxic mercury poisoning and healthcare neglect.",
      population_projection_2026: "39,100 (Disrupted severely by illicit mining)"
    }
  },
  {
    id: "lacandon",
    family_id: "americas_indigenous",
    familyName: "Indigenous Peoples of Arctic Americas",
    name: "Lacandón",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 16.5, longitude: -91.0 },
    population_count: 1000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #E65C00, #993D00)",
    metadata: {
      summary: "One of the most elusive Maya peoples, fleeing to the Chiapas rainforest during Spanish conquest. Deeply devoted to organic rainforest stewardship, but threatened by rapid eco-logging.",
      language_family: "Mayan (Yukatekan branch)",
      legal_status: "Hold constitutional titles to the Lacandon Jungle, but communal lands are highly disputed by incoming agricultural settlers.",
      population_projection_2026: "1,050 (Fragile linguistic hold)"
    }
  },
  {
    id: "xakriaba",
    family_id: "americas_indigenous",
    familyName: "Indigenous Peoples of Arctic Americas",
    name: "Xakriabá",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: -15.0, longitude: -44.0 },
    population_count: 10000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #D43F1D, #7F1F08)",
    metadata: {
      summary: "A courageously resilient indigenous community in Minas Gerais, Brazil. Despite undergoing complete language shift to Portuguese in 2000, they maintain fierce spiritual connections and territorial sovereignty struggles.",
      language_family: "Macro-Jê (Historically; currently Portuguese-speaking)",
      legal_status: "Demarcated reservation under continuous armed legal battles against aggressive cattle-rancher ('fazendeiro') intrusions.",
      population_projection_2026: "10,800 (Fierce cultural reclaiming)"
    }
  },
  {
    id: "arawakan",
    family_id: "americas_indigenous",
    familyName: "Indigenous Peoples of Arctic Americas",
    name: "Wayuu (Arawak)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 11.5, longitude: -72.0 },
    population_count: 400000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #B22222, #5C0000)",
    metadata: {
      summary: "Spanning the desert peninsula of La Guajira (Colombia/Venezuela). Celebrated for their matriarchal clan system, legendary tapestry weaving, and defiant historical resistance to Spanish subjugation.",
      language_family: "Arawakan (Wayuunaiki dialect)",
      legal_status: "Protected under dual-country indigenous reservations, but suffering from severe industrial over-extraction of water and child malnutrition.",
      population_projection_2026: "430,000 (Pristine matriarchal lineage)"
    }
  },

  // --- OCEANIA ---
  {
    id: "maori",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Māori",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -41.0, longitude: 174.0 },
    population_count: 850000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #9933CC, #4B0082)",
    metadata: {
      summary: "The Indigenous Polynesian people of Aotearoa (New Zealand). Cultural life is anchored in whakapapa (genealogy) and marae gatherings. Pioneers of groundbreaking language immersion schools ('Kōhanga Reo').",
      language_family: "Austronesian (Eastern Polynesian)",
      legal_status: "Recognized under the Treaty of Waitangi (Te Tiriti). Highly active in state parliamentary representations, but land and water compensation disputes continue.",
      population_projection_2026: "910,000 (Strong demographic and cultural renaissance)"
    }
  },
  {
    id: "aboriginal",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Aboriginal Australians",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -25.0, longitude: 135.0 },
    population_count: 900000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #8A2BE2, #41006f)",
    metadata: {
      summary: "Descendants of the oldest continuous living culture on Earth, with ancestral ties going back 60,000 years. Strong kinship networks linked dynamically to Songlines ('Dreaming tracks') across the continent.",
      language_family: "Pama-Nyungan and Non-Pama-Nyungan families",
      legal_status: "Native Title Act allows legal recognition of ancestral lands, but systemic over-incarceration and cultural discrimination remain massive hurdles.",
      population_projection_2026: "960,000 (Growing self-identification)"
    }
  },
  {
    id: "west_papuan",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "West Papuans",
    region: "Oceania",
    category: "Stateless",
    location: { latitude: -2.0, longitude: 138.0 },
    population_count: 2800000,
    color_hex: "#660099",
    gradient_specs: "linear-gradient(135deg, #DA70D6, #800080)",
    metadata: {
      summary: "The indigenous Melanesian populations of Western New Guinea. Evolving thousands of distinct agricultural forest societies. They undergo tragic political and cultural blockades under Indonesian military administration.",
      language_family: "Trans-New Guinea and West Papuan families",
      legal_status: "Unrecognized indigenous movement under severe armed resistance and blockade. High rates of forced dislocation into neighboring PNG.",
      population_projection_2026: "2,980,000 (Severe geopolitical displacement)"
    }
  },
  {
    id: "cook_islanders",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Cook Islanders",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -21.2, longitude: -159.7 },
    population_count: 80000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #BA55D3, #4A0E4E)",
    metadata: {
      summary: "Polynesian community residing in the Cook Islands archipelago. Master navigators who preserve complex shell arts, communal drumming, and tribal land-inheritance councils.",
      language_family: "Austronesian (Maori-Cook dialect)",
      legal_status: "Self-governing country in free association with New Zealand. Strong local ownership of land; non-islanders barred from purchase.",
      population_projection_2026: "84,000 (Deep ocean heritage preserved)"
    }
  },
  {
    id: "fijians",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Fijians (iTaukei)",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -17.8, longitude: 178.0 },
    population_count: 500000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #9370DB, #3E2723)",
    metadata: {
      summary: "The native Melanesian population of Fiji. Evolving complex village structures led by high chiefs (Ratus), celebrating volcanic soil agriculture, and the sacred kava ceremony (Yaqona).",
      language_family: "Austronesian (Malayo-Polynesian)",
      legal_status: "Land rights strongly constitutionally protected; 87% of all Fiji soil is locked in inalienable native trust.",
      population_projection_2026: "524,000 (Native land trust protected)"
    }
  },
  {
    id: "kiribati",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Kiribati People",
    region: "Oceania",
    category: "Stateless", // Tagged proactively as climate-stateless refugee risk
    location: { latitude: 1.3, longitude: 173.0 },
    population_count: 120000,
    color_hex: "#660099",
    gradient_specs: "linear-gradient(135deg, #A020F0, #5C2E91)",
    metadata: {
      summary: "An island nation facing complete submersion from sea-level rise. Pioneering 'migration with dignity' training programs, building sea-walls, and preserving distinct multi-voiced vocal choir microtonal songs.",
      language_family: "Austronesian (Micronesian / Gilbertese)",
      legal_status: "Sovereign UN nation but actively purchasing lands in Fiji (Vanua Levu) to plan for total climate-induced displacement.",
      population_projection_2026: "128,000 (Primary epicentre of climate displacement)"
    }
  },

  // --- ASIA / SIBERIA ---
  {
    id: "ainu",
    family_id: "asia_east",
    familyName: "Siberian & East Asian Family",
    name: "Ainu",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 43.0, longitude: 142.0 },
    population_count: 20000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00D2D2, #004D4D)",
    metadata: {
      summary: "The native hunting-and-gathering people of Hokkaido (Japan), Sakhalin, and the Kuril Islands. Famous for physical woodcrafts, bear worshipping festivals (Iomante), and distinctive facial tattoos.",
      language_family: "Ainu Language Isolate",
      legal_status: "Officially recognized as Indigenous by the Japanese Diet in 2008, but systemic restoration of salmon-fishing and hunting rights remains extremely slow.",
      population_projection_2026: "21,500 (Active linguist revival hubs)"
    }
  },
  {
    id: "ryukyuan",
    family_id: "asia_east",
    familyName: "Siberian & East Asian Family",
    name: "Ryukyuan (Okinawans)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 26.5, longitude: 128.0 },
    population_count: 1400000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00F5FF, #2F4F4F)",
    metadata: {
      summary: "The indigenous island populations of the Ryukyu chain. Creators of distinct musical arts (Sanshin) and martial arts (Karate), under heavy pressure from high-density foreign military military bases.",
      language_family: "Japonic (Ryukyuan branch)",
      legal_status: "Recognized as distinct by international bodies (UNESCO), but the Japanese government denies official Indigenous status, treating them as Japanese ethnic nationals.",
      population_projection_2026: "1,450,000 (Fierce peace and base-removal advocacy)"
    }
  },
  {
    id: "soyot",
    family_id: "asia_east",
    familyName: "Siberian & East Asian Family",
    name: "Soyot",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 52.0, longitude: 100.0 },
    population_count: 4000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00E5FF, #006064)",
    metadata: {
      summary: "Siberian minority inhabiting the high Sayan mountains in Buryatia. Surviving Soviet-era forced collectivization of reindeer, and currently reclaiming distinct reindeer culture and hunting traditions.",
      language_family: "Turkic (With heavy Uralic/Samoyedic historical fusion)",
      legal_status: "State recognized as an indigenous small-numbered minority, undergoing intense language revitalization.",
      population_projection_2026: "4,150 (Deep reindeer keepers resilient)"
    }
  },

  // --- MIDDLE EAST & CAUCASUS ---
  {
    id: "kurds",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Kurds",
    region: "Asia",
    category: "Stateless",
    location: { latitude: 37.0, longitude: 43.0 },
    population_count: 35000000,
    color_hex: "#006666",
    gradient_specs: "linear-gradient(135deg, #02C39A, #05668D)",
    metadata: {
      summary: "The largest stateless nation in the world. Straddling Turkey, Iraq, Iran, and Syria (Kurdistan). They maintain distinct tribal structures, agricultural mountain adaptation, and legendary epics.",
      language_family: "Indo-European (Indo-Iranian branch)",
      legal_status: "Subject to continuous state oppression across borders; possess de-facto federal regional autonomy in Northern Iraq (KRG) and self-administration in Northern Syria (Rojava).",
      population_projection_2026: "37,200,000 (Vibrant local demographics)"
    }
  },
  {
    id: "armens",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Armenians",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 40.2, longitude: 44.5 },
    population_count: 3000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00F5D4, #00BBF9)",
    metadata: {
      summary: "One of the oldest continuously inhabiting indigenous peoples of the South Caucasus and Armenian Highlands. Pioneers of early Christian architecture and rich stone-sculpture ('Khachkar') traditions.",
      language_family: "Indo-European (Armenian branch)",
      legal_status: "Protected under armenian sovereign statehood, but borders remain highly dangerous; historical refugee groups face ongoing displacement (Artsakh).",
      population_projection_2026: "2,950,000 (Affected by border geopolitical pressures)"
    }
  },
  {
    id: "chechen",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Chechens",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 43.3, longitude: 45.7 },
    population_count: 1400000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #20B2AA, #003F3A)",
    metadata: {
      summary: "The largest indigenous North Caucasian highland warriors. Evolving deep clan democracies ('teips'), highly specific agricultural terracing, and mystical Sufi circles.",
      language_family: "Northeast Caucasian (Nakh branch)",
      legal_status: "State recognized titular republic under severe geopolitical surveillance and historical conflicts.",
      population_projection_2026: "1,480,000 (High regional demographic growth)"
    }
  },
  {
    id: "lezgins",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Lezgins",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 41.6, longitude: 47.8 },
    population_count: 650000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #0A9396, #005F73)",
    metadata: {
      summary: "Inhabiting the high Caucasus borders of Dagestan and Azerbaijan. Famed for intricate wool rugs, the Lezginka fast dance, and maintaining ancient mountain village code architectures.",
      language_family: "Northeast Caucasian (Lezgic branch)",
      legal_status: "Linguistic minority divided by Russia-Azerbaijan national borders, causing obstacles for family reunions and localized schooling.",
      population_projection_2026: "675,000 (Divided frontier constraints)"
    }
  },

  // --- CHINA & CENTRAL ASIA (ASIAN HIGHLANDS) ---
  {
    id: "uighur",
    family_id: "himalayan_highlands",
    familyName: "East Asian Highlands Family",
    name: "Uyghur",
    region: "Asia",
    category: "Stateless", // Metaphorically/Proactively annotated for stateless containment risk
    location: { latitude: 41.0, longitude: 84.0 },
    population_count: 12000000,
    color_hex: "#006666",
    gradient_specs: "linear-gradient(135deg, #4AF2A1, #0E5C35)",
    metadata: {
      summary: "A Turkic, oasis-dwelling agricultural people of the Tarim Basin. Outstanding oasis-irrigation engineering ('Karez') and muqam musical traditions. Facing unprecedented digital panopticon and political surveillance.",
      language_family: "Turkic (Karluk branch)",
      legal_status: "Designated titular autonomous region, but de-facto human rights and cultural survival are highly compromised under severe geopolitical constraints.",
      population_projection_2026: "12,200,000 (Highly constrained data collection)"
    }
  },
  {
    id: "hunan_tujia",
    family_id: "himalayan_highlands",
    familyName: "East Asian Highlands Family",
    name: "Tujia",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 29.5, longitude: 109.5 },
    population_count: 8000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #0DF0D1, #134B42)",
    metadata: {
      summary: "Inhabiting the breathtaking Wuling Mountains of Central China. Renowned for their ancient hand-waving dances, vibrant brocade textiles, and distinctive wooden stilt houses ('diaojiaolou').",
      language_family: "Sino-Tibetan (Tibeto-Burman isolate)",
      legal_status: "Officially recognized national minority in China with autonomous prefectures; high integration but actively safeguarding epic hand-waving rituals.",
      population_projection_2026: "8,250,000 (Stable community structures)"
    }
  },
  {
    id: "tibetan",
    family_id: "himalayan_highlands",
    familyName: "East Asian Highlands Family",
    name: "Tibetan",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 31.0, longitude: 91.0 },
    population_count: 6500000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #3BB1DB, #003049)",
    metadata: {
      summary: "Dwelling on the 'Roof of the World'. Masters of high-altitude life, Buddhist philosophy, and nomadic yak pastoralism. Suffering intense geopolitical shifts and systematic resettlement.",
      language_family: "Sino-Tibetan (Tibetic branch)",
      legal_status: "Autonomous Region with severe ongoing political restrictions. Huge diaspora networks maintain independent cultural institutes.",
      population_projection_2026: "6,700,000 (Struggling against assimilation)"
    }
  },
  {
    id: "jino",
    family_id: "himalayan_highlands",
    familyName: "East Asian Highlands Family",
    name: "Jino",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 22.0, longitude: 101.0 },
    population_count: 26000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #4AE8A1, #16563B)",
    metadata: {
      summary: "Formally recognized in June 1979 as China's 56th and final ethnic group. Traditional tea-forest worshipers in the mountains of Yunnan, holding deep reverence for massive sun-drums.",
      language_family: "Sino-Tibetan (Lolo-Burmese branch)",
      legal_status: "Officially recognized state minority. Highly localized, community tea-forest lands are protected under eco-forestry laws.",
      population_projection_2026: "27,200 (Tea-forest protections active)"
    }
  },
  {
    id: "gaoshan_taiwan",
    family_id: "himalayan_highlands",
    familyName: "East Asian Highlands Family",
    name: "Gaoshan (Taiwan Aborigines)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 23.5, longitude: 121.0 },
    population_count: 580000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #66CDAA, #2E8B57)",
    metadata: {
      summary: "The Austronesian-speaking aborigines of Taiwan. They possess deep architectural stone carvings, polyphonic choral singing, and organic millet agricultural cycles.",
      language_family: "Austronesian (Formosan languages)",
      legal_status: "Constitutional recognition in Taiwan; active tribal self-governance councils and continuous campaigns for ancestral hunting lands restoration.",
      population_projection_2026: "612,000 (Vigorous political and language revival)"
    }
  },

  // --- ADDITIONAL EXTRACTED GROUPS (NIGERIA DEEP DATA) ---
  {
    id: "hausa_fulani",
    family_id: "niger_congo_nigeria",
    familyName: "Niger-Congo Deep-Africa Family",
    name: "Hausa-Fulani",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 12.0, longitude: 8.5 },
    population_count: 45000000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #FFD700, #B8860B)",
    metadata: {
      summary: "The massive cultural synthesis of northern Nigeria. Traditionally pastoral Fulani merge with agricultural and trading Hausa, creating a powerhouse of Islamic literature, architectural mud palaces, and trade.",
      language_family: "Afroasiatic / Niger-Congo synthesis",
      legal_status: "Dominant ethnic coalition in northern Nigeria, legally governed by constitutional laws and Sharia civil codes in rural emirates.",
      population_projection_2026: "48,500,000 (Very rapid demographic expansion)"
    }
  },
  {
    id: "yoruba",
    family_id: "niger_congo_nigeria",
    familyName: "Niger-Congo Deep-Africa Family",
    name: "Yoruba",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 7.5, longitude: 4.5 },
    population_count: 40000000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #FFA500, #FF4500)",
    metadata: {
      summary: "One of Africa's most urbanized indigenous groups, with pre-colonial city-states (Ife, Oyo). Outstanding brass-sculpturing casting, complex polyrhythmic dundun drumming, and highly active global diaspora keeping Orisha rituals pristine.",
      language_family: "Niger-Congo (Yoruboid branch)",
      legal_status: "Primary ethnic pillars of southern Nigeria. Customary monarchies recognized; strong legal and financial self-governance.",
      population_projection_2026: "43,000,000 (Strong economic urban presence)"
    }
  },
  {
    id: "igbo",
    family_id: "niger_congo_nigeria",
    familyName: "Niger-Congo Deep-Africa Family",
    name: "Igbo",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 5.5, longitude: 7.5 },
    population_count: 35000000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #F0E68C, #8B814C)",
    metadata: {
      summary: "Highland egalitarian forest societies of southeastern Nigeria. Famed for decentralized democratic setups, high commercial entrepreneurship, complex masquerades (Mmanwu), and historic self-reliance.",
      language_family: "Niger-Congo (Igboid branch)",
      legal_status: "Primary ethnic pillars of eastern Nigeria. Customary land tenure and dispute councils highly active alongside courts.",
      population_projection_2026: "37,600,000 (Expanding mercantile hubs)"
    }
  },

  // --- REPUBLICS & STEPPES (TURKIC KINSHIP) ---
  {
    id: "kazakhs",
    family_id: "turkic_steppe",
    familyName: "Turkic Steppe Family",
    name: "Kazakhs (Highlands)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 48.0, longitude: 68.0 },
    population_count: 14000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00FFFF, #008080)",
    metadata: {
      summary: "The legendary horse-archers and golden eagle hunters of the vast Eurasian steppes. Maintaining deep nomadic lineage tracking ('Shejire'), dombra musicianship, and yurts adaptation.",
      language_family: "Turkic (Kipchak branch)",
      legal_status: "Sovereign statehood in Kazakhstan, but regional minorities across Russian Altai and western China face ongoing language erosion.",
      population_projection_2026: "14,800,000 (Nomadic grazing support active)"
    }
  },
  {
    id: "kyrgyz",
    family_id: "turkic_steppe",
    familyName: "Turkic Steppe Family",
    name: "Kyrgyz (Tian Shan)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 41.5, longitude: 74.0 },
    population_count: 5000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #4AF2F2, #114B4B)",
    metadata: {
      summary: "Inhabiting the mountain heavens of Tian Shan. Guardians of the Epic of Manas - the longest oral poetry epic in history. Practicing high-altitude transhumance herding.",
      language_family: "Turkic (Kipchak-Kyrgyz)",
      legal_status: "Sovereign statehood, but border communities in Pamir (Tajikistan) and China suffer from isolated access to schools and legal rights.",
      population_projection_2026: "5,300,000 (High-mountain transhumance strong)"
    }
  },

  // --- SOUTH ASIA & INDIAN OCEAN ---
  {
    id: "adivasi",
    family_id: "south_asia_indigenous",
    familyName: "South Asian Indigenous Family",
    name: "Adivasi (Gond/Santhal)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 22.0, longitude: 80.0 },
    population_count: 110000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #20B2AA, #004D40)",
    metadata: {
      summary: "The collective name for the indigenous First Nations of India. Holding precious knowledge of sacred forests, painting arts (Gond art), and eco-sustainable forest extraction.",
      language_family: "Austroasiatic / Dravidian / Indo-Aryan dialects",
      legal_status: "Designated under 'Scheduled Tribes' in the constitution, but face violent displacement due to massive open-cast iron and coal mining operations.",
      population_projection_2026: "116,000,000 (Facing severe mining displacement pressures)"
    }
  },
  {
    id: "jarwa",
    family_id: "south_asia_indigenous",
    familyName: "South Asian Indigenous Family",
    name: "Jarwa",
    region: "Asia",
    category: "Isolated",
    location: { latitude: 12.0, longitude: 92.7 },
    population_count: 450,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00A6A6, #0D2D2D)",
    metadata: {
      summary: "Inhabiting the dense forests of South Andaman Island. Hunter-gatherers surviving in pristine isolation for 50,000 years, currently threatened by the Andaman Trunk Road which cuts through their territory.",
      language_family: "Ongan Language Family",
      legal_status: "Protected under strict tribal reserve laws with buffer exclusion zones, but suffer from tourism 'human safaris' and illegal poaching.",
      population_projection_2026: "470 (Highly vulnerable micro-population)"
    }
  },
  {
    id: "rohingya",
    family_id: "south_asia_indigenous",
    familyName: "South Asian Indigenous Family",
    name: "Rohingya",
    region: "Asia",
    category: "Stateless",
    location: { latitude: 20.5, longitude: 92.5 },
    population_count: 1500000,
    color_hex: "#006666",
    gradient_specs: "linear-gradient(135deg, #135252, #021f1f)",
    metadata: {
      summary: "Historically residing in Rakhine State, Myanmar. Underwent brutal military ethnic cleansing in 2017, resulting in the world's largest dense refugee camp in Cox's Bazar, Bangladesh.",
      language_family: "Indo-Aryan (Rohingya dialect)",
      legal_status: "Denied basic citizenship under Myanmar's 1982 Citizenship Law, rendering them completely stateless refugees with highly precarious settlement rights.",
      population_projection_2026: "1,550,000 (Held in protracted refugee camps)"
    }
  },
  {
    id: "navajo",
    family_id: "athabaskan",
    familyName: "Na-Dené Athabaskan Family",
    name: "Navajo (Diné)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 36.1628, longitude: -109.5886 },
    population_count: 400000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #B22222, #4A0000)",
    metadata: {
      summary: "The Diné (Navajo) are the largest federally recognized Native American tribe in the southwestern United States. Inhabiting the massive Navajo Nation spanning Arizona, New Mexico, and Utah, they have a rich heritage of weaving, sand painting, and silversmithing. Diné Code Talkers played a vital role in World War II. They are historically adaptive pastoralists who have fought long legal battles to protect land tenure, water rights, and sacred mountain peaks from tourism and extractive mining.",
      language_family: "Na-Dené (Southern Athabaskan)",
      legal_status: "Sovereign semi-autonomous Navajo Nation under U.S. federal treaty status; maintains its own judicial system and executive government, but faces conflicts over environmental pollution from old uranium mines.",
      population_projection_2026: "411,000 (Strong community density)"
    }
  },
  {
    id: "quechua",
    family_id: "quechuan",
    familyName: "Quechuan Andean Family",
    name: "Quechua",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: -13.5226, longitude: -71.9673 },
    population_count: 10000000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #DC143C, #5C061B)",
    metadata: {
      summary: "The Quechua peoples are direct descendants of the ancient Inca Empire. Spread across the steep highlands of the Andes, including Peru, Bolivia, and Ecuador, they are pioneers of terraced terrace farming, llama/alpaca pastoralism, and intricate colorful textile weaving. They maintain 'Ayni' (communal reciprocity) as their central social element. Despite their massive population, they continue to experience political and linguistic discrimination, pushing for indigenous bilingual schooling.",
      language_family: "Quechuan (Runa Simi)",
      legal_status: "Constitutionally recognized language in Peru, Bolivia, and Ecuador, with specialized land titles for peasant communities ('Comunidades Campesinas').",
      population_projection_2026: "10,350,000 (Revitalizing rural networks)"
    }
  },
  {
    id: "mapuche",
    family_id: "araucanian",
    familyName: "Araucanian Family",
    name: "Mapuche",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: -38.7359, longitude: -72.5904 },
    population_count: 1700000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF3366, #800020)",
    metadata: {
      summary: "The Mapuche are the indigenous inhabitants of south-central Chile and southwestern Argentina. They famously repelled both the Inca Empire expansion and centuries of Spanish colonization in the Arauco War. Historically, they are agrarian and silvicultural, centered on ancestral 'Lof' (clans) led by a Lonko. Today, they are locked in a high-intensity territorial conflict with the Chilean state and multinational forestry corporations over the recovery of stolen ancestral lands.",
      language_family: "Araucanian (Mapudungun)",
      legal_status: "Officially recognized under Chile's Indígena Law, but denied constitutional representation; locked in severe anti-terrorism criminalization cycles for land recovery protests.",
      population_projection_2026: "1,780,000 (Fierce territorial resistance)"
    }
  },
  {
    id: "cherokee",
    family_id: "iroquoian",
    familyName: "Iroquoian Family",
    name: "Cherokee",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 35.9156, longitude: -94.9700 },
    population_count: 430000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF4500, #7F0000)",
    metadata: {
      summary: "The Cherokee (Tsalagi) are historically from the Southeastern United States but were forcibly removed via the devastating Trail of Tears in 1838-1839. Adapting with incredible resilience, the Cherokee Nation established a sophisticated constitutional republic in Oklahoma. Sequoyah's development of the Cherokee syllabary in 1821 revolutionized literacy. Today, they lead tribal self-governance, running expansive health, economic, and language preservation systems.",
      language_family: "Iroquoian (Southern branch)",
      legal_status: "Sovereign Cherokee Nation (and Eastern Band of Cherokee Indians) federally recognized, with high treaty-based judicial autonomy affirmed by the landmark McGirt v. Oklahoma supreme court decision.",
      population_projection_2026: "452,000 (Dynamic growth)"
    }
  },
  {
    id: "san",
    family_id: "khoisan",
    familyName: "Khoisan Kinship Family",
    name: "San (Bushmen)",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: -21.0000, longitude: 21.0000 },
    population_count: 100000,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #FFB300, #805C00)",
    metadata: {
      summary: "The San (or Bushmen) are descendants of the first anatomically modern human inhabitants of Southern Africa, with archeological continuity spanning over 20,000 years. Renowned for their incredible click-consonant languages, hunting tracking skills, and profound rock art, they live in the arid Kalahari basin of Botswana, Namibia, and South Africa. They face ongoing threats of forced eviction from nature reserves and hunting bans that criminalize their traditional lifestyle.",
      language_family: "Khoe-Kwadi, Tuu, and Kx'a Families (Khoisan group)",
      legal_status: "Highly precarious. Won a landmark land rights court case in Botswana (Central Kalahari Game Reserve), but are frequently denied water access and basic hunting licenses.",
      population_projection_2026: "105,000 (Undergoing transition to settled pastoralism)"
    }
  },
  {
    id: "maasai",
    family_id: "nilotic",
    familyName: "Nilotic Pastoral Family",
    name: "Maasai",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: -1.4880, longitude: 35.8450 },
    population_count: 1500000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FF0000, #8B0000)",
    metadata: {
      summary: "The Maasai are an ethnic group of semi-nomadic pastoralists inhabiting northern, central, and southern Kenya and northern Tanzania. They are instantly recognizable by their striking red 'shúkà' robes, elaborate beadwork, and energetic jumping dances ('Adumu'). Their lives revolve around their cattle, which they believe were given to them by God (Enkai). They are presently battling massive evictions and land privatization in Tanzania under the guise of wildlife conservation.",
      language_family: "Nilo-Saharan (Eastern Nilotic branch)",
      legal_status: "Subject to state-led land administration that often ignores customary pastoral rights; actively fighting historical land-loss lawsuits against conservation parks.",
      population_projection_2026: "1,595,000 (Fierce defense of grazing corridors)"
    }
  },
  {
    id: "tuareg",
    family_id: "berber_afroasiatic",
    familyName: "Berber Afroasiatic Family",
    name: "Tuareg",
    region: "Africa",
    category: "Stateless",
    location: { latitude: 18.0000, longitude: 8.0000 },
    population_count: 2500000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #1E90FF, #00008B)",
    metadata: {
      summary: "The Tuareg are a large Berber ethnic confederation principally inhabiting the Sahara desert, across Niger, Mali, Algeria, and Libya. Known as the 'Blue People' due to the indigo dye of their distinctive veils ('tagelmust'), they have a history as nomadic trans-Saharan traders. They preserve their own unique alphabet, Tifinagh. They have led numerous armed rebellions for political independence and have struggled against the fragmentation of their nomadic territories by European colonization frontiers.",
      language_family: "Afroasiatic (Berber / Tamasheq branch)",
      legal_status: "Recognized minority populations across fractured Sahara borders; have established temporary unrecognized autonomous administrations (e.g. Azawad in northern Mali).",
      population_projection_2026: "2,650,000 (Highly migratory across desert borders)"
    }
  },
  {
    id: "hadza",
    family_id: "hadza_isolate",
    familyName: "Hadza Isolate Family",
    name: "Hadza",
    region: "Africa",
    category: "Isolated",
    location: { latitude: -3.5350, longitude: 35.0350 },
    population_count: 1300,
    color_hex: "#FFCC00",
    gradient_specs: "linear-gradient(135deg, #E6C229, #CC7A00)",
    metadata: {
      summary: "The Hadza are an indigenous hunter-gatherer group living around Lake Eyasi in the central Rift Valley of Tanzania. They are one of the last remaining tribes that live almost exclusively by foraging, hunting with bows and arrows, and harvesting tubers and wild honey. Their click-rich language is an isolate, completely unrelated to any other. They face extreme pressure from encroaching agriculturalists and pastoralists who are deforesting their ancient hunting ranges.",
      language_family: "Hadza (Language Isolate)",
      legal_status: "Granted historic communal land title deeds by the Tanzanian government in 2011 to safeguard their core territories, but enforceability against illegal settlers remains weak.",
      population_projection_2026: "1,350 (Fragile hunter-forager core)"
    }
  },
  {
    id: "basques",
    family_id: "basque_isolate",
    familyName: "Basque Pyrenean Isolate",
    name: "Basques",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 43.1000, longitude: -2.0000 },
    population_count: 3000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #00FF7F, #006400)",
    metadata: {
      summary: "The Basques (Euskaldunak) are an indigenous people inhabiting the Pyrenees mountains on the border of Spain and France. Their language, Euskera, is a ancient language isolate—the only pre-Indo-European language surviving in Western Europe, predating the Roman Empire. They possess a rich maritime history, wood-and-stone-cutting athletics, and deep local democratic assemblies under sacred oaks (Gernika). After decades of conflict, they have secured strong regional fiscal autonomy.",
      language_family: "Basque (Euskera, Language Isolate)",
      legal_status: "The Basque Country holds high autonomous community status in Spain with separate taxation, police, and educational bodies. French Basque areas have limited cultural protections.",
      population_projection_2026: "3,080,000 (Successful cultural-technological resurgence)"
    }
  },
  {
    id: "sardinians",
    family_id: "sardinian_paleo_med",
    familyName: "Paleo-Mediterranean Island Family",
    name: "Sardinians",
    region: "Europe",
    category: "Indigenous",
    location: { latitude: 40.1200, longitude: 9.0120 },
    population_count: 1600000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #20B2AA, #005F56)",
    metadata: {
      summary: "Sardinians are the indigenous people of the Mediterranean island of Sardinia. Possessing an extraordinary bronze-age legacy of thousands of stone towers ('Nuraghe'), they have retained a highly distinct linguistic, musical, and pastoral culture. As a global 'Blue Zone', they are studied for longevity. Their inland pastoralists (Barbagia) successfully resisted Roman, Phoenician, and Byzantine conquests for centuries, preserving customary highland grazing laws.",
      language_family: "Indo-European (Sardinian / Limba Sarda)",
      legal_status: "Sardinia has an autonomous regional status constitutionally recognized in Italy, but linguistic activists struggle for full bilingual administrative and school integration.",
      population_projection_2026: "1,550,000 (Demographic decline but high rural longevity)"
    }
  },
  {
    id: "dayak",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Dayak",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -1.0000, longitude: 113.5000 },
    population_count: 6500000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #BA55D3, #320A45)",
    metadata: {
      summary: "The Dayak are the indigenous peoples native to the island of Borneo. Traditionally living in spectacular central longhouses ('betang') and possessing deep ecological knowledge of tropical rain forest protection, they celebrate ancestor worship and animistic rituals. They face devastating eco-injustices due to rapid deforestation, monoculture oil palm plantation conversion, and state-led transmigration programs that strip them of customary forest titles.",
      language_family: "Austronesian (Malayo-Polynesian dialects)",
      legal_status: "Protected under Indonesian Adat (customary) law frameworks, but land rights are frequently overridden by central government forestry and mining concessions.",
      population_projection_2026: "6,750,000 (Intense mobilization for forest protection)"
    }
  },
  {
    id: "batak",
    family_id: "austronesian_oceania",
    familyName: "Austronesian & Pacific Family",
    name: "Batak",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 2.5000, longitude: 99.0000 },
    population_count: 8500000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #DDA0DD, #4B0082)",
    metadata: {
      summary: "The Batak are several closely related ethnic groups inhabiting the highlands of North Sumatra, surrounding the ancient volcanic Lake Toba. Exhibiting amazing carpentry seen in their saddle-backed roof houses ('jabu'), they preserve a patrilineal clan system and unique stone-grave culture. Having historically written their own Batak script, they have successfully merged customary laws with global trade while keeping clan ties and dynamic musical polyphony active.",
      language_family: "Austronesian (Batak languages)",
      legal_status: "Customary forest claims are legally recognized under landmark Indonesian Constitutional Court decisions, but enforcement is slow against paper-pulp companies.",
      population_projection_2026: "8,950,000 (Strong urban and highland cultural networks)"
    }
  },
  {
    id: "evenks",
    family_id: "tungusic",
    familyName: "Tungusic Siberian Family",
    name: "Evenks",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 60.0000, longitude: 120.0000 },
    population_count: 80000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #48D1CC, #008B8B)",
    metadata: {
      summary: "The Evenks are a Tungusic people of northern Siberia, Russia, and northeast China. Traditionally practicing nomadic reindeer riding and forest-hunting adaptation, they have historically migrated across the vast taiga forest zones. They hold deep animistic connections to forest spirits and are the inventors of the word 'Shaman'. In recent decades, their fragile lichen grazing pastures have been devastated by active Russian pipeline construction and intensive mining.",
      language_family: "Tungusic (Evenki branch)",
      legal_status: "Sovereign clan holdings recognized in Siberia, but they struggle to maintain reindeer migration pathways against coal, mineral, and oil extraction concessions.",
      population_projection_2026: "82,500 (Under severe industrial taiga fragmentation)"
    }
  },
  {
    id: "huli",
    family_id: "papuan_highlands",
    familyName: "Trans-New Guinea Highland Family",
    name: "Huli",
    region: "Oceania",
    category: "Indigenous",
    location: { latitude: -5.9600, longitude: 143.1400 },
    population_count: 250000,
    color_hex: "#9933CC",
    gradient_specs: "linear-gradient(135deg, #FF69B4, #800080)",
    metadata: {
      summary: "The Huli are an indigenous people living in the Tari Basin in the highlands of Papua New Guinea. They are world-renowned for their unique custom of growing ceremonial wigs from their own hair, adorned with colorful bird-of-paradise feathers and yellow clay face paint ('ambua'). Operating under complex kin networks, they practice sweet potato mountain-mound agriculture and raise prized pigs. They are currently facing community disruption from multi-billion dollar natural gas pipeline infrastructure.",
      language_family: "Trans-New Guinea (Huli-Duna branch)",
      legal_status: "Sovereign land rights protected under Papua New Guinea's constitution, which guarantees customary land ownership, but under-served by state education and courts.",
      population_projection_2026: "265,000 (Facing high youth modernization waves)"
    }
  },
  {
    id: "hmong",
    family_id: "hmong_mien",
    familyName: "Hmong-Mien Hill Peoples",
    name: "Hmong",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 22.3000, longitude: 103.1500 },
    population_count: 15000000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #32CD32, #005F00)",
    metadata: {
      summary: "The Hmong are an indigenous sub-group of East and Southeast Asian hill peoples. Originating from China, many migrated south to northern Vietnam, Laos, and Thailand to escape historic imperial persecution. Well known for spectacular silver jewelry, complex batik textile resist-dyeing, and highland hemp weaving, they have a clan structure that maintains cohesion across borders. Their involvement in historical conflicts (e.g. the Secret War in Laos) led to a global diaspora.",
      language_family: "Hmong-Mien (Miao-Yao)",
      legal_status: "Officially recognized state minority groups across China, Vietnam, and Laos, but face political marginalization and assimilation press.",
      population_projection_2026: "15,450,000 (Highly integrated highland trade systems)"
    }
  },
  {
    id: "inuit",
    family_id: "eskimo_aleut",
    familyName: "Eskimo-Aleut Family",
    name: "Inuit",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 64.2000, longitude: -83.0000 },
    population_count: 150000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF6B6B, #8B0000)",
    metadata: {
      summary: "Inhabiting the Arctic regions of North America (Alaska, Northern Canada, and Greenland), they possess legendary cultural adaptations for hunting sea mammals, constructing igloos, and mushing sled dogs. In 1999, they secured massive land-claims self-rule via Nunavut's creation.",
      language_family: "Eskimo-Aleut (Inuktitut / Inupiaq)",
      legal_status: "Sovereign territorial self-governance of Nunavut in Canada, home-rule in Greenland under Denmark, and federally structured native village status in Alaska.",
      population_projection_2026: "158,000 (High birth rates and strong geopolitical voice)"
    }
  },
  {
    id: "maya",
    family_id: "mayan",
    familyName: "Mayan Family",
    name: "Maya (Yucatec/K'iche')",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 15.7835, longitude: -90.2308 },
    population_count: 8000000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF8C00, #4B1A00)",
    metadata: {
      summary: "Direct heirs of the monumental Mayan civilization of southern Mexico, Guatemala, and Belize. They preserve stunning astronomical calculations, terraced agriculture, backstrap weaving, and community elder networks despite historic Spanish and republic-era genocidal campaigns.",
      language_family: "Mayan language family (K'iche', Yucatec, Kaqchikel)",
      legal_status: "Partially protected and recognized under the 1996 Guatemalan Peace Accords and Mexico's San Andrés Accords, though real-world autonomy remains heavily disputed.",
      population_projection_2026: "8,350,000 (Increasing cross-border linguistic solidarity)"
    }
  },
  {
    id: "yanomami",
    family_id: "yanomaman",
    familyName: "Yanomaman Amazonian Family",
    name: "Yanomami",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 2.5000, longitude: -63.5000 },
    population_count: 38000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #E25822, #5D1900)",
    metadata: {
      summary: "Living in the deep Amazonian rainforest of Brazil and Venezuela, they reside in collective circle-dwelling 'shabono' villages, practicing horticulture and shamanism. Their territory is threatened by heavy gold mine pollution ('garimpeiros') and illegal violence.",
      language_family: "Yanomaman language family",
      legal_status: "Protected under Brazil's massive Yanomami Indigenous Land and Venezuela's Alto Orinoco Biosphere Reserve, but constantly suffering underfunded law enforcement against illegal miners.",
      population_projection_2026: "39,500 (Under severe epidemiological and territorial defense stress)"
    }
  },
  {
    id: "guarani",
    family_id: "tupi_guarani",
    familyName: "Tupian South American Family",
    name: "Guaraní",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: -25.3000, longitude: -57.6300 },
    population_count: 5000000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #C71585, #3A001E)",
    metadata: {
      summary: "Stretching across Paraguay, southern Brazil, and Argentina. Their linguistic dominance is unique; Guaraní is a co-official national language of Paraguay spoken widely. Today, they lead high-intensity agrarian blockades for historic land demarcation.",
      language_family: "Tupian (Tupí-Guaraní branch)",
      legal_status: "Co-official national language in Paraguay and Bolivia, but Brazilian clans (Kaiowá) suffer extreme human-rights violence from industrial agriculture encroachments.",
      population_projection_2026: "5,150,000 (Pioneering custom-driven environmental models)"
    }
  },
  {
    id: "lakota",
    family_id: "siouan",
    familyName: "Siouan Plains Family",
    name: "Lakota (Sioux)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 44.3676, longitude: -100.3364 },
    population_count: 170000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #DEB887, #6B3A00)",
    metadata: {
      summary: "Sovereign equestrian nomadic masters of the Great Plains. Custodians of the sacred Black Hills ('Paha Sapa') and famous for leading historical battles for sovereignty. Recently pioneered the deep Standing Rock pipeline water-protection movement.",
      language_family: "Siouan (Lakota dialect)",
      legal_status: "Sovereign federally recognized tribes under 1868 Fort Laramie Treaty boundaries; ongoing legal battles refusing monetary compensation in favor of actual land return.",
      population_projection_2026: "176,000 (Advancing tribal language immersion academies)"
    }
  },
  {
    id: "haida",
    family_id: "haida_isolate",
    familyName: "Haida Pacific Isolate",
    name: "Haida",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 53.2000, longitude: -132.0000 },
    population_count: 5000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #4682B4, #001A33)",
    metadata: {
      summary: "Inhabiting the misty archipelago of Haida Gwaii (British Columbia) and Alaska, they are world-famous for monumental cedar totems, formline art, ocean canoes, and active marine conservation stewardship alongside federal co-management boards.",
      language_family: "Haida (Language Isolate)",
      legal_status: "Self-governed under the Council of the Haida Nation, successfully enforcing landmark resource-rights and cultural co-management deeds with Canada.",
      population_projection_2026: "5,300 (Reintroducing fluid language programs)"
    }
  },
  {
    id: "zapotec",
    family_id: "oto_manguean",
    familyName: "Oto-Manguean Mesoamerican Family",
    name: "Zapotec",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 17.0732, longitude: -96.7266 },
    population_count: 800000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #E066FF, #4D008D)",
    metadata: {
      summary: "Inhabiting Oaxaca, Mexico. Creators of Monte Albán, they preserve deep textile craft, 'Tequio' (obligatory communal labor), and matriarchal family traditions in Juchitán, where 'Muxes' (third-gender individuals) hold celebrated roles.",
      language_family: "Oto-Manguean (Zapotec languages)",
      legal_status: "Governed locally under traditional 'Usos y Costumbres' (customary laws) recognized in Oaxacan municipal codes.",
      population_projection_2026: "825,000 (Robust commercial and linguistic density)"
    }
  },
  {
    id: "aymara",
    family_id: "aymaran",
    familyName: "Aymaran Andean Family",
    name: "Aymara",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: -16.5000, longitude: -68.1500 },
    population_count: 2000000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF6F00, #4E2000)",
    metadata: {
      summary: "High-altitude Altiplano farmers and weavers surrounding Lake Titicaca in Bolivia and Peru. Symbolized by the colorful Wiphala flag, they hold deep devotion to Pachamama (Mother Earth) and Suma Qamaña (Good Living).",
      language_family: "Aymaran",
      legal_status: "Protected under Bolivia's Plurinational Constitution (with Aymara co-official state language status) and Peru's indigenous recognition policies.",
      population_projection_2026: "2,080,000 (Leading organic highland trade networks)"
    }
  },
  {
    id: "kuna",
    family_id: "chibchan",
    familyName: "Chibchan Central American Family",
    name: "Kuna (Guna)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 9.2500, longitude: -78.2500 },
    population_count: 80000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FFD700, #AA5300)",
    metadata: {
      summary: "Inhabiting the San Blas islands of Panama, they are famous for 'Mola' textiles (highly detailed layered hand-stitching) and they successfully rebelled in 1925 to secure full autonomy.",
      language_family: "Chibchan (Kuna language)",
      legal_status: "Sovereign autonomous Comarca of Guna Yala framework within Panama, setting strict entrance rules and land ownership strictly within Guna clans.",
      population_projection_2026: "84,000 (First islands preparing global relocation due to rising sea levels)"
    }
  },
  {
    id: "chumash",
    family_id: "chumashan",
    familyName: "Chumashan Coastal Family",
    name: "Chumash",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 34.4208, longitude: -119.6982 },
    population_count: 5000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF5722, #8B2500)",
    metadata: {
      summary: "The Chumash are indigenous maritime peoples of central and southern coastal California. Famous for creating ocean-going redwood plank canoes ('tomols'), exquisite shell bead currency, and sophisticated astronomical tracking systems reflected in rock art.",
      language_family: "Chumashan language family",
      legal_status: "The Santa Ynez Band of Chumash Indians is a federally recognized tribe; other regional Chumash bands continue to campaign for federal recognition while defending coastal eco-reserves.",
      population_projection_2026: "5,300 (Active marine and cultural resurgence)"
    }
  },
  {
    id: "yurok",
    family_id: "algonquian",
    familyName: "Algonquian & Algic Family",
    name: "Yurok",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 41.2662, longitude: -124.0883 },
    population_count: 6500,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF3D00, #4E0D00)",
    metadata: {
      summary: "The Yurok are California's largest federally recognized tribe, residing along the Klamath River and Pacific coastline. They are ancient stewards of old-growth redwood forests and salmon ecosystems, renowned for basketry and active river-restoration leadership.",
      language_family: "Algic (Yurok language)",
      legal_status: "Sovereign federally recognized tribe with extensive tribal court systems; pioneering the 'Rights of Nature' legal doctrine to protect the Klamath River.",
      population_projection_2026: "6,700 (Securing historical dam removals in 2024-2026)"
    }
  },
  {
    id: "ohlone",
    family_id: "utian",
    familyName: "Utian Penutian Family",
    name: "Ohlone (Muwekma)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 37.7749, longitude: -122.4194 },
    population_count: 5000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF9100, #6D2D00)",
    metadata: {
      summary: "The Ohlone (comprising several triblets like Muwekma and Rumsen) are the indigenous inhabitants of the San Francisco Bay and Monterey Bay areas. Historically managers of oak woodlands and coastal shellmounds, they survived mission-era forced labor and are actively revitalizing their culture and Chochenyo language.",
      language_family: "Utian (Penutian stock)",
      legal_status: "Lacking active federal recognition due to historical administrative errors, but actively organized under tribal trusts and partnering with local land trusts for cultural easement access.",
      population_projection_2026: "5,200 (Campaigning for federal recognition restoration)"
    }
  },
  {
    id: "washoe",
    family_id: "washo_isolate",
    familyName: "Washoe Hokan Isolate",
    name: "Washoe (Wašišiw)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 39.0968, longitude: -120.0324 },
    population_count: 1500,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #8D6E63, #3E2723)",
    metadata: {
      summary: "The Washoe (Wašišiw) are the indigenous guardians of Lake Tahoe (Da ow aga) and the surrounding Great Basin and Sierra Nevada mountains. Renowned for world-class willow basketry, they spent summers at Lake Tahoe, gathering pine nuts, fishing, and practicing deep environmental kinship.",
      language_family: "Washo (Hokan language isolate)",
      legal_status: "Sovereign federally recognized Washoe Tribe of Nevada and California, actively managing tribal lands and restoring ancestral stewardship roles with the US Forest Service.",
      population_projection_2026: "1,600 (Restoring cultural fire stewardship)"
    }
  },
  {
    id: "northern_paiute",
    family_id: "uto_aztecan",
    familyName: "Uto-Aztecan Numic Family",
    name: "Northern Paiute (Numu)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 40.5422, longitude: -118.2500 },
    population_count: 10000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #E65100, #5D2300)",
    metadata: {
      summary: "The Northern Paiute (Numu) historically inhabited the vast desert basins of western Nevada, eastern Oregon, and northeastern California. Builders of tule reed houses and skilled hunters, their spiritual leader Wovoka founded the Ghost Dance movement of 1890, a powerful pan-indigenous spiritual revival of peace and earth restoration.",
      language_family: "Uto-Aztecan (Numic branch)",
      legal_status: "Sovereign federally recognized tribes residing across reservations (like Pyramid Lake and Walker River) with high-level water-rights defense coalitions.",
      population_projection_2026: "10,400 (Leading solar and ecological programs)"
    }
  },
  {
    id: "cree",
    family_id: "algonquian",
    familyName: "Algonquian & Algic Family",
    name: "Cree (Nēhiyawak)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 55.0000, longitude: -106.0000 },
    population_count: 350000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #D50000, #4A0000)",
    metadata: {
      summary: "The Cree (Nēhiyawak) represent one of the largest First Nations in Canada, spanning from the Rocky Mountains East through the boreal sub-arctic forests to Quebec. Renowned for their close kinship with hunting caribou/moose and goose-hunting traditions, they have a powerful oral history, sacred lodge traditions, and strong political leadership.",
      language_family: "Algic (Cree language continuum)",
      legal_status: "Governed under treaty statuses (Treaties 4, 6, 8, 9) with Canada and the historic James Bay and Northern Quebec Agreement, granting strong regional self-rule.",
      population_projection_2026: "365,000 (Strong youth demographic revival)"
    }
  },
  {
    id: "ojibwe",
    family_id: "algonquian",
    familyName: "Algonquian & Algic Family",
    name: "Ojibwe (Anishinaabe)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 48.0000, longitude: -84.0000 },
    population_count: 200000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #C2185B, #53002C)",
    metadata: {
      summary: "The Ojibwe (Anishinaabe, also Chippewa) are a prominent First Nation in Canada and the United States surrounding the Great Lakes and boreal woodlands. Famously writing on birchbark scrolls, harvesting sacred 'manoomin' (wild rice) via canoes, and initiating the Midewiwin grand medicine society, they are legendary protectors of lakes and water channels.",
      language_family: "Algic (Anishinaabemowin)",
      legal_status: "Sovereign First Nations in Canada with constitutional treaty rights (Robinson treaties, Dish with One Spoon treaty frameworks), leading international Great Lakes eco-commissions.",
      population_projection_2026: "207,000 (Major language immersion school programs)"
    }
  },
  {
    id: "mikmaq",
    family_id: "algonquian",
    familyName: "Algonquian & Algic Family",
    name: "Mi'kmaq",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 45.4000, longitude: -63.5000 },
    population_count: 170000,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #EC407A, #620023)",
    metadata: {
      summary: "The Mi'kmaq are the indigenous people of Canada's Atlantic Maritime provinces (Mi'kma'ki) and Maine. Master builders of ocean-navigating birchbark canoes, they have a deep historic relationship with lobster, fish, and coastal foraging, guided by 'Netukulimk' (sustainable resource use). They signed the historic Covenant Chain of Peace and Friendship treaties.",
      language_family: "Algic (Mi'kmaw language)",
      legal_status: "Sovereign First Nations; affirmed under Canada's Section 35 constitution with treaty right to fish for a 'moderate livelihood' as upheld in the Marshall decision.",
      population_projection_2026: "176,000 (Expanding sovereign moderate-livelihood fishery operations)"
    }
  },
  {
    id: "mohawk",
    family_id: "iroquoian",
    familyName: "Iroquoian Haudenosaunee Family",
    name: "Mohawk (Kanien'kehá:ka)",
    region: "Americas",
    category: "Indigenous",
    location: { latitude: 45.0000, longitude: -74.5000 },
    population_count: 4500,
    color_hex: "#990000",
    gradient_specs: "linear-gradient(135deg, #FF1744, #5D0014)",
    metadata: {
      summary: "The Mohawk (Kanien'kehá:ka) are the 'Keepers of the Eastern Door' of the ancient Iroquois (Haudenosaunee) Confederacy. Traditionally living in longhouses in New York and the St. Lawrence river valley of Canada, they adhere to the Great Law of Peace, which established a powerful democratic confederation that influenced early modern representative democracies. Famous for spectacular high-steel ironworking, they maintain strong sovereign borders.",
      language_family: "Iroquoian (Mohawk language)",
      legal_status: "Sovereign Mohawk councils (e.g., Kahnawake, Akwesasne) straddling the US-Canada border, actively enforcing independent border control and self-determination rights under the Jay Treaty.",
      population_projection_2026: "46,500 (Aggressively defending non-interfered borders and sovereign commerce)"
    }
  },
  {
    id: "amazigh",
    family_id: "berber_afroasiatic",
    familyName: "Berber Afroasiatic Family",
    name: "Amazigh (Berber)",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 31.5, longitude: -5.0 },
    population_count: 30000000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FF9900, #993300)",
    metadata: {
      summary: "The Amazigh (plural Imazighen, meaning 'free people') are the indigenous inhabitants of North Africa, with a continuous presence dating back over 10,000 years. Spanning from Morocco and Algeria to Libya and Egypt, they historically developed agriculture, pastoralism, and the unique Tifinagh script. They have fought ancient, colonial, and modern battles for the preservation of their linguistic and land rights.",
      language_family: "Afroasiatic (Berber / Tamazight languages)",
      legal_status: "Tamazight is now recognized as an official statutory language in Morocco (2011) and Algeria (2016), but local communities face historic underinvestment, land confiscations, and water rights struggles.",
      population_projection_2026: "31,250,000 (Sustained cultural education and language revitalization in schools)"
    }
  },
  {
    id: "druze",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Druze (Al-Muwahhidun)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 33.5, longitude: 35.8 },
    population_count: 1500000,
    color_hex: "#006666",
    gradient_specs: "linear-gradient(135deg, #10B981, #065F46)",
    metadata: {
      summary: "The Druze are an esoteric, monotheistic ethno-religious group indigenous to the Levant (primarily Lebanon, Syria, Israel, and Jordan). Emphasizing philosophy, reincarnation, and cosmic intellect, they have historically maintained a highly cohesive and independent social structure in remote mountain strongholds, acting as a crucial political and military force in Middle Eastern history.",
      language_family: "Afroasiatic (Semitic / Neo-Arabic dialects with specialized liturgical terms)",
      legal_status: "Recognized as a distinct religious community with autonomous personal-status courts in Lebanon, Syria, and Israel, but physically divided by modern geopolitical borders.",
      population_projection_2026: "1,540,000 (Stable community demographics with strong cultural preservation)"
    }
  },
  {
    id: "copt",
    family_id: "egyptian_afroasiatic",
    familyName: "Egyptian Afroasiatic Family",
    name: "Copts",
    region: "Africa",
    category: "Indigenous",
    location: { latitude: 27.0, longitude: 31.0 },
    population_count: 15000000,
    color_hex: "#CC6600",
    gradient_specs: "linear-gradient(135deg, #FFD700, #8F3A00)",
    metadata: {
      summary: "The Copts are the indigenous Christian population of Egypt, direct descendants of the ancient Egyptians. The term 'Copt' is derived from the Greek word for 'Egyptian'. They preserve the Coptic language—the final stage of the ancient Egyptian language written in a modified Greek alphabet—and their ancient liturgical traditions in the face of centuries of political shifts.",
      language_family: "Afroasiatic (Egyptian branch, preserved liturgically in Coptic; daily language is Arabic)",
      legal_status: "Constitutionally recognized citizens of Egypt, but experience structural and social discrimination, particularly regarding church construction laws and representation in public offices.",
      population_projection_2026: "15,800,000 (Sustained presence, strong cultural preservation networks)"
    }
  },
  {
    id: "yazidis",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Yazidis",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 36.3333, longitude: 43.1667 },
    population_count: 700000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #F59E0B, #B45309)",
    metadata: {
      summary: "The Yazidis are an ancient monotheistic ethnic and religious minority indigenous to Upper Mesopotamia (primarily northern Iraq). Their unique, rich fusion religion of Sharfadin centers around Melek Taus (the Peacock Angel). They survived dozens of historic massacres, most recently the devastating 2014 Daesh genocide in Mount Sinjar.",
      language_family: "Indo-European (Indo-Iranian / Kurmanji Kurdish dialect)",
      legal_status: "Protected under Iraq's national constitution with representation quotas, but the Sinjar homelands remain severely devastated and unsafe for mass returns.",
      population_projection_2026: "730,000 (Slowly rebuilding Sinjar and organizing diaspora communities)"
    }
  },
  {
    id: "assyrian",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Assyrians (Suraye)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 36.8, longitude: 43.3 },
    population_count: 3500000,
    color_hex: "#009999",
    gradient_specs: "linear-gradient(135deg, #0DA3DB, #044F8C)",
    metadata: {
      summary: "The Assyrians are an indigenous East Semitic-speaking ethnic group native to Upper Mesopotamia, modern northern Iraq, northwestern Iran, northeastern Syria, and southeastern Turkey. Descendants of the ancient Mesopotamian empires, they preserve the Syriac-Aramaic language (the tongue of Christ) and are largely Christian. They have faced displacement and land confiscation over centuries.",
      language_family: "Afroasiatic (Semitic / Neo-Aramaic)",
      legal_status: "Officially recognized as a constituent minority group in Iraq, Syria, and Iran, but face acute challenges with territorial security and cultural autonomy in the Nineveh Plains.",
      population_projection_2026: "3,550,000 (High global diaspora density actively supporting ancestral lands)"
    }
  },
  {
    id: "marsh_arabs",
    family_id: "middle_east_caucasus",
    familyName: "Middle East & Caucasus Family",
    name: "Marsh Arabs (Ma'dan)",
    region: "Asia",
    category: "Indigenous",
    location: { latitude: 31.0, longitude: 47.0 },
    population_count: 500000,
    color_hex: "#006666",
    gradient_specs: "linear-gradient(135deg, #14B8A6, #1E1B4B)",
    metadata: {
      summary: "The Marsh Arabs (Ma'dan) are unique indigenous inhabitants of the Mesopotamian marshes in southern Iraq. Descended from the ancient Sumerian and Babylonian civilizations, they live in floating arched reed houses ('mudhif') and are renowned for buffalo pastoralism and marsh navigation. Their ecosystem was systematically drained by Saddam Hussein in 1991, but is undergoing active re-flooding and revival.",
      language_family: "Afroasiatic (Semitic / Mesopotamian Arabic dialect)",
      legal_status: "Their territorial wetlands are recognized as a UNESCO World Heritage site and protected reserve, though climate change and upstream damming continue to pose severe water supply crises.",
      population_projection_2026: "515,000 (Battling active climate desalination of the marshes)"
    }
  }
];
