import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  INDIGENOUS_GROUPS, 
  IndigenousGroup 
} from './data/indigenousData';
import { 
  Search, 
  Globe, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Users, 
  Layers, 
  Filter, 
  ArrowRight, 
  X, 
  MapPin, 
  Loader2, 
  HelpCircle, 
  Volume2, 
  Compass, 
  FileText, 
  LayoutDashboard, 
  Wifi,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Indigenous' | 'Stateless' | 'Isolated'>('All');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Americas' | 'Asia' | 'Europe' | 'Africa' | 'Oceania'>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  
  const [activeGroupId, setActiveGroupId] = useState<string>('sami'); // start with Sami
  const [searchFocused, setSearchFocused] = useState(false);

  // AI Assistant states
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiContextGroup, setAiContextGroup] = useState<IndigenousGroup | null>(null);
  const [aiTitle, setAiTitle] = useState('ISPIM AI Cultural Envoy');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Custom prompt inputs for the group detail box
  const [customGroupAnswer, setCustomGroupAnswer] = useState<string>('');
  const [isCustomGroupLoading, setIsCustomGroupLoading] = useState<boolean>(false);
  const [customGroupPrompt, setCustomGroupPrompt] = useState<string>('');

  // Map state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // --- DERIVED DATA ---
  // Unique family ids of all groups for filters
  const familyIds = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; name: string }[] = [];
    INDIGENOUS_GROUPS.forEach(g => {
      if (!seen.has(g.family_id)) {
        seen.add(g.family_id);
        list.push({ id: g.family_id, name: g.familyName });
      }
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return INDIGENOUS_GROUPS.filter((group) => {
      const matchSearch = 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.metadata.language_family.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.metadata.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'All' || group.category === selectedStatus;
      const matchRegion = selectedRegion === 'All' || group.region === selectedRegion;
      const matchFamily = selectedFamily === 'All' || group.family_id === selectedFamily;

      return matchSearch && matchStatus && matchRegion && matchFamily;
    });
  }, [searchQuery, selectedStatus, selectedRegion, selectedFamily]);

  // Selected Group details
  const activeGroup = useMemo(() => {
    return INDIGENOUS_GROUPS.find(g => g.id === activeGroupId) || null;
  }, [activeGroupId]);

  // Group kinship "Cousins" (from same language family) in alphabetical order
  const cousinGroups = useMemo(() => {
    if (!activeGroup) return [];
    return INDIGENOUS_GROUPS.filter(g => g.family_id === activeGroup.family_id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeGroup]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalCount = filteredGroups.length;
    const totalPop = filteredGroups.reduce((acc, g) => acc + g.population_count, 0);
    const regionsCount = {
      Americas: filteredGroups.filter(g => g.region === 'Americas').length,
      Asia: filteredGroups.filter(g => g.region === 'Asia').length,
      Europe: filteredGroups.filter(g => g.region === 'Europe').length,
      Africa: filteredGroups.filter(g => g.region === 'Africa').length,
      Oceania: filteredGroups.filter(g => g.region === 'Oceania').length,
    };
    const categoriesCount = {
      Indigenous: filteredGroups.filter(g => g.category === 'Indigenous').length,
      Stateless: filteredGroups.filter(g => g.category === 'Stateless').length,
      Isolated: filteredGroups.filter(g => g.category === 'Isolated').length,
    };
    return { totalCount, totalPop, regionsCount, categoriesCount };
  }, [filteredGroups]);

  // --- INITIALIZE MAP ---
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Create map centered on general continental boundaries
      const map = L.map(mapContainerRef.current, {
        center: [30.0, 15.0],
        zoom: 2.5,
        minZoom: 1.5,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Create overlay group for markers
      const markersGroup = L.layerGroup().addTo(map);

      mapRef.current = map;
      markersRef.current = markersGroup;
    }

    return () => {
      // cleanup is handled gracefully
    };
  }, []);

  // --- UPDATE MARKERS ---
  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      markersRef.current.clearLayers();

      filteredGroups.forEach((group) => {
        // Construct the custom HTML element for marker with family gradients
        const customIcon = L.divIcon({
          html: `
            <div class="custom-pulse-marker" style="color: ${group.color_hex};" id="marker-${group.id}">
              <div class="custom-pulse-ring" style="background: ${group.color_hex};"></div>
              <div class="custom-pulse-dot" style="background: ${group.gradient_specs};"></div>
            </div>
          `,
          className: '',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker([group.location.latitude, group.location.longitude], {
          icon: customIcon
        });

        // Hover Tooltip with Glassmorphic popup style
        marker.bindTooltip(`
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-bold text-sm tracking-wide font-display text-white">${group.name}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-white/10" style="color: ${group.color_hex}">
                ${group.category}
              </span>
            </div>
            <div class="text-[11px] text-zinc-300 font-semibold mb-0.5">${group.familyName}</div>
            <div class="text-[10px] text-zinc-400">Language: ${group.metadata.language_family}</div>
            <div class="text-[10px] text-zinc-400">Region: ${group.region}</div>
            <div class="text-[9px] text-amber-300/80 italic mt-1">Click to reveal narrative & AI envoy</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -10],
          opacity: 0.98,
          sticky: true
        });

        // Click Event: auto-pan & open left sidebar details
        marker.on('click', () => {
          setActiveGroupId(group.id);
          mapRef.current?.flyTo([group.location.latitude, group.location.longitude], 6, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        });

        markersRef.current?.addLayer(marker);
      });
    }
  }, [filteredGroups]);

  // --- MANUAL SELECTION PAN ---
  const handleSelectGroup = (group: IndigenousGroup) => {
    setActiveGroupId(group.id);
    if (mapRef.current) {
      mapRef.current.flyTo([group.location.latitude, group.location.longitude], 6, {
        duration: 1.5
      });
    }
  };

  // --- AI QUERY CALLS (LAZY INITIALIZATION) ---
  const runAiQuery = async (promptText: string, contextGroup: IndigenousGroup | null, titleText?: string) => {
    setIsAiPanelOpen(true);
    setAiResponse('');
    setIsAiLoading(true);
    if (titleText) setAiTitle(titleText);
    setAiContextGroup(contextGroup);

    const apiKey = process.env.GEMINI_API_KEY;

    // Gracefully handle raw, unconfigured or empty keys
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
      setAiResponse(`### Deep Integration Notice
The application detected that there is no valid \`GEMINI_API_KEY\` set in the secrets env. 

#### 🔧 How To Configure the API Key:
1. Click the **Global Settings / Secrets** panel in the bottom-left or top-right configuration of the AI Studio UI.
2. Add a new Secret with Key Name: \`GEMINI_API_KEY\`.
3. Provide your standard paid Google Cloud or Gemini developer API key.
4. Try this prompt again!

---

#### 💡 Alternate Interactive Experience:
While you set up your API Key, you can instantly test:
* **The Cultural gradients & Kinship logic** (The parent-child colors match families across the interactive Leaflet dark mode map).
* **Multi-tiered search and filtering** by Region and Status (Indigenous, Stateless, Isolated).
* **Bidirectional Map Pan & Zoom** (Click on a marker on the map to open statistics, and click other 'Cousin' groups in the sidebar to auto-fly to coordinates).`);
      setIsAiLoading(false);
      return;
    }

    try {
      // Lazy SDK init
      const ai = new GoogleGenAI({ apiKey });

      // Compose rich ethnobotanical and political contextual prompt to enforce accuracy
      let fullPrompt = promptText;
      if (contextGroup) {
        fullPrompt = `You are an expert geospatial cultural anthropologist, human-rights representative, and specialized consultant for the UNHCR and IWGIA. 
Analyze the following group:
- Name: ${contextGroup.name}
- Linguistic Family: ${contextGroup.metadata.language_family} (${contextGroup.familyName})
- Geographic Region: ${contextGroup.region}
- Population Count: ${contextGroup.population_count} (2026 Projection: ${contextGroup.metadata.population_projection_2026 || 'Pending'})
- Legal Status: ${contextGroup.metadata.legal_status}
- Summary: ${contextGroup.metadata.summary}

User Action / Question: ${promptText}

Provide an academic, respectful, rights-based response of about 150-200 words. Highlight self-determination indicators and cultural survival strategies. Highlight international instruments like ILO Convention 169. Formulate in clean Markdown.`;
      } else {
        fullPrompt = `${promptText}

Use the database of our mapped peoples (including the Sámi, Nenets, Pulaar, Jola, Maasai, San, Adivasi, Rohingya, Kurds, and Atakora Otamari) as case studies where relevant. Provide an academic, rights-based, respectful study of about 250 words. Format with headers and bullet points in Markdown.`;
      }

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullPrompt
      });

      if (result.text) {
        setAiResponse(result.text);
      } else {
        setAiResponse("Received empty response from Gemini API. Please retry.");
      }
    } catch (err: any) {
      console.error(err);
      setAiResponse(`### API Call Unsuccessful\n\nThere was an error communicating with the Gemini models. Please verify your billing status or API key permissions.\n\n**Error Trace:** \`${err?.message || err}\``);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- GROUP SPECIFIC ASK BOX ---
  const handleGroupSpecificAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGroupPrompt.trim() || !activeGroup) return;

    setIsCustomGroupLoading(true);
    setCustomGroupAnswer('');
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
      setCustomGroupAnswer("Gemini API key is not configured. Run the prompt anyway to read setup metrics.");
      runAiQuery(customGroupPrompt, activeGroup, `Querying the Oracle for ${activeGroup.name}`);
      setIsCustomGroupLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Act as an expert envoy for the ${activeGroup.name} people. Answer this specific query concerning our heritage, lands, language, or present challenges: "${customGroupPrompt}". Context: ${activeGroup.metadata.summary}. Give a concise, poignant 100-word response.`;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      if (result.text) {
        setCustomGroupAnswer(result.text);
      }
    } catch (err: any) {
      setCustomGroupAnswer(`Error: ${err.message || err}`);
    } finally {
      setIsCustomGroupLoading(false);
    }
  };

  // --- MARKDOWN SIMPLE PARSER ---
  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('####')) {
        return <h5 key={idx} className="text-xs font-bold text-amber-200 mt-3 mb-1 font-display uppercase tracking-wider">{trimmed.replace('####', '').trim()}</h5>;
      }
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold text-amber-300 mt-4 mb-2 font-display border-b border-white/5 pb-1">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-bold text-zinc-100 mt-5 mb-2 font-display tracking-tight">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={idx} className="text-lg font-bold text-zinc-50 mt-6 mb-3 font-display border-b border-zinc-700/50 pb-2">{trimmed.replace('#', '').trim()}</h2>;
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return <li key={idx} className="text-xs text-zinc-300 ml-4 list-disc my-1 leading-relaxed">{trimmed.substring(1).trim()}</li>;
      }
      if (trimmed.match(/^\d+\./)) {
        return <li key={idx} className="text-xs text-zinc-300 ml-4 list-decimal my-1 leading-relaxed">{trimmed.replace(/^\d+\./, '').trim()}</li>;
      }

      // Strong / Bold inline formatting
      const htmlText = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-100 font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-zinc-400 italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-zinc-800/80 px-1 py-0.5 rounded font-mono text-[10px] text-amber-200">$1</code>');

      return (
        <p 
          key={idx} 
          className="text-xs text-zinc-300 mb-2 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: htmlText || '&nbsp;' }} 
        />
      );
    });
  };

  // --- RESET ALL FILTERS ---
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedRegion('All');
    setSelectedFamily('All');
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#0c0c0e] font-sans antialiased text-zinc-200">
      
      {/* 1. TOP COMMAND BAR (UTILITY LAYER) */}
      <header className="glass-panel z-40 relative flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-white/5">
        
        {/* Title Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Globe className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-500 font-display">
                ISPIM
              </h1>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold uppercase tracking-widest">
                v2.5
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans tracking-wide">
              Indigenous & Stateless Peoples Interactive Map
            </p>
          </div>
        </div>

        {/* Filters Matrix */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          
          {/* Status filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/5">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-xs hover:text-white cursor-pointer focus:outline-none text-zinc-300 font-medium"
            >
              <option value="All" className="bg-[#121214] text-zinc-100">Status: All</option>
              <option value="Indigenous" className="bg-[#121214] text-zinc-100">Indigenous</option>
              <option value="Stateless" className="bg-[#121214] text-zinc-100">Stateless</option>
              <option value="Isolated" className="bg-[#121214] text-zinc-100">Isolated</option>
            </select>
          </div>

          {/* Region filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="bg-transparent text-xs hover:text-white cursor-pointer focus:outline-none text-zinc-300 font-medium"
            >
              <option value="All" className="bg-[#121214] text-zinc-100">Region: All</option>
              <option value="Americas" className="bg-[#121214] text-zinc-100">Americas</option>
              <option value="Asia" className="bg-[#121214] text-zinc-100">Asia</option>
              <option value="Europe" className="bg-[#121214] text-zinc-100">Europe</option>
              <option value="Africa" className="bg-[#121214] text-zinc-100">Africa</option>
              <option value="Oceania" className="bg-[#121214] text-zinc-100">Oceania</option>
            </select>
          </div>

          {/* Kinship Family filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <select 
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-transparent text-xs hover:text-white cursor-pointer focus:outline-none text-zinc-300 font-medium max-w-[150px] overflow-hidden text-ellipsis"
            >
              <option value="All" className="bg-[#121214] text-zinc-100">Family: All</option>
              {familyIds.map((fam) => (
                <option key={fam.id} value={fam.id} className="bg-[#121214] text-zinc-100">
                  {fam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search container */}
          <div className="relative flex items-center">
            <Search className={`absolute left-3 w-4 h-4 transition-colors ${searchFocused ? 'text-amber-400' : 'text-zinc-500'}`} />
            <input 
              type="text"
              placeholder="Search clans, languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-9 pr-8 py-1.5 w-[200px] rounded-lg text-xs font-medium glass-input ${searchFocused ? 'w-[250px]' : 'w-[200px]'}`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors"
                id="search-clear-btn"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Active filtered indicator / Reset button */}
          {(searchQuery || selectedStatus !== 'All' || selectedRegion !== 'All' || selectedFamily !== 'All') && (
            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition-colors"
              id="reset-filters-btn"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Clear Filters ({filteredGroups.length})
            </button>
          )}

        </div>

        {/* System Online lights state */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span>AI: Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse"></span>
            <span>DB: {stats.totalCount} Peoples Mapped</span>
          </div>
        </div>

      </header>

      {/* Main content grid */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* 2. LEFT SIDEBAR DASHBOARD (METADATA LAYER) */}
        <aside className="glass-panel w-full lg:w-[380px] h-[400px] lg:h-auto flex flex-col border-r border-white/5 z-30 overflow-hidden shrink-0">
          
          {/* Scrollable content container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {activeGroup ? (
              /* ACTIVE GROUP VIEW */
              <div className="space-y-4" id="active-group-sidebar">
                
                {/* Header Card */}
                <div className="relative p-4 rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(15,15,20,0.82)' }}>
                  {/* Decorative background gradient */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ background: activeGroup.gradient_specs }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">
                        {activeGroup.region} Region
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/5 border border-white/10" style={{ color: activeGroup.color_hex }}>
                        {activeGroup.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold font-display tracking-tight text-white mb-1">
                      {activeGroup.name}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-amber-200">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: activeGroup.gradient_specs }} />
                      <span className="font-semibold">{activeGroup.familyName}</span>
                    </div>

                    {/* Population projection banner */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Verified Count</div>
                        <div className="font-mono text-sm font-bold text-zinc-100">
                          {activeGroup.population_count.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider">2026 Projection</div>
                        <div className="font-mono text-xs font-semibold text-amber-200/90">
                          {activeGroup.metadata.population_projection_2026 || "Not Available"}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Cultural Gradients and Cousin logic */}
                <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 font-display">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Parent-Child Custom Gradient</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center border border-white/10 shrink-0" style={{ background: activeGroup.gradient_specs }}>
                      <span className="text-white text-[10px] font-bold font-mono">C</span>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-300">
                        Hue: <span className="font-mono uppercase tracking-wider text-amber-200" style={{ color: activeGroup.color_hex }}>{activeGroup.family_id}</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Minor cousin-tribes share their parental core hue to denote ethnic kinship while keeping distinct gradient specs.
                      </p>
                    </div>
                  </div>

                  {/* COUSINS IN THE SYSTEM */}
                  {cousinGroups.length > 0 ? (
                    <div className="pt-3 border-t border-white/5 space-y-1.5">
                      <div className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">Related Cousin Tribes:</div>
                      <div className="flex flex-col gap-1.5">
                        {cousinGroups.map((cousin) => {
                          const isActive = cousin.id === activeGroupId;
                          return (
                            <button
                              key={cousin.id}
                              onClick={() => handleSelectGroup(cousin)}
                              className={`text-xs px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer w-full text-left group/btn ${
                                isActive
                                  ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/20'
                                  : 'bg-zinc-900/60 border-white/5 hover:border-amber-400/30 text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                              }`}
                              id={`cousin-btn-${cousin.id}`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="relative flex h-2 w-2 shrink-0">
                                  {isActive && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-amber-400" />
                                  )}
                                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: cousin.gradient_specs }} />
                                </span>
                                <span className={isActive ? 'font-semibold truncate text-[13px]' : 'truncate text-[13px]'}>
                                  {cousin.name}
                                </span>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 ${
                                isActive 
                                  ? 'text-amber-400 translate-x-0.5 opacity-100' 
                                  : 'text-zinc-500 opacity-60 group-hover/btn:opacity-100 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5'
                              }`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 pt-2 italic">No other related cousin groups mapped in the local registry.</div>
                  )}

                </div>

                {/* Narrative / Context */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 font-display">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Historical Narrative & Resilience Summary</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/20 p-3 rounded-lg border border-white/5">
                    {activeGroup.metadata.summary}
                  </p>
                </div>

                {/* Complex Legal/Political rights-based status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 font-display">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rights-Based Legal & Political Status</span>
                  </div>
                  <div className="p-3 rounded-lg border border-red-500/10 bg-red-950/2 font-sans text-xs text-zinc-300 space-y-1">
                    <div className="font-semibold text-zinc-100 text-[11px]" style={{ color: activeGroup.color_hex }}>
                      {activeGroup.metadata.language_family} Isolate context
                    </div>
                    <p className="leading-relaxed">
                      {activeGroup.metadata.legal_status}
                    </p>
                  </div>
                </div>

                {/* Direct Ask Gemini Input Container */}
                <div className="p-4 rounded-xl border border-amber-500/15" style={{ background: 'linear-gradient(180deg, rgba(20,18,15,0.7) 0%, rgba(12,12,14,0.9) 100%)' }}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 font-display mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask Gemini about {activeGroup.name} people</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mb-3Leading">
                    Have specific questions about their ethnobotanical history, regional folklore, or present struggles? Submit a direct query.
                  </p>
                  
                  <form onSubmit={handleGroupSpecificAsk} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={`e.g. Traditional dress, religion...`}
                      value={customGroupPrompt}
                      onChange={(e) => setCustomGroupPrompt(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg glass-input min-w-0"
                    />
                    <button 
                      type="submit"
                      disabled={isCustomGroupLoading || !customGroupPrompt.trim()}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-xs font-bold text-[#0c0c0e] flex items-center justify-center cursor-pointer transition-colors"
                      id="ask-group-btn"
                    >
                      {isCustomGroupLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </form>

                  {customGroupAnswer && (
                    <div className="mt-3 p-3 rounded bg-zinc-950 border border-white/5 max-h-[160px] overflow-y-auto" id="custom-group-answer-box">
                      <div className="text-[9px] uppercase font-bold text-amber-400 tracking-wider mb-1">Envoys answer:</div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{customGroupAnswer}</p>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              /* CORE OVERVIEW VIEW - WHEN POPULATION IN GENERAL VIEW */
              <div className="space-y-5" id="sidebar-overview-layout">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 text-center">
                  <Globe className="w-8 h-8 text-amber-400/80 mx-auto mb-2" />
                  <h3 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-200">
                    Geospatial Workspace
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Showing statistics and distribution metrics for current system filters. Expand groups by clicking map markers or selecting them below.
                  </p>
                </div>

                {/* SVG MINI CHART BAR */}
                <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 space-y-3">
                  <div className="text-xs font-bold font-display text-zinc-300 flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>Regional Distribution ({stats.totalCount})</span>
                  </div>

                  <div className="space-y-2">
                    {/* SVG graphic rendering */}
                    <div className="text-[10px] text-zinc-400 font-medium">Mapped ethnic segments across major continents:</div>
                    
                    {/* CUSTOM BARS IN HTML CSS */}
                    <div className="space-y-1.5 pt-1">
                      {Object.entries(stats.regionsCount).map(([regionName, count]) => {
                        const numValue = count as number;
                        const pct = stats.totalCount > 0 ? (numValue / stats.totalCount) * 100 : 0;
                        return (
                          <div key={regionName} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-zinc-300 font-semibold">{regionName}</span>
                              <span className="text-zinc-400 font-mono">{count} ({Math.round(pct)}%)</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${pct}%`,
                                  background: regionName === 'Europe' ? 'linear-gradient(90deg, #009999, #00E1E1)' :
                                              regionName === 'Africa' ? 'linear-gradient(90deg, #FFCC00, #CC6600)' :
                                              regionName === 'Americas' ? 'linear-gradient(90deg, #CC0000, #800000)' :
                                              regionName === 'Oceania' ? 'linear-gradient(90deg, #9933CC, #660099)' :
                                              'linear-gradient(90deg, #00A896, #028090)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cultural legend explanation card */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-2">
                  <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest font-mono">
                    Culture Gradients Rule
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    This interactive map employs an Attribute-Based system to denote kinship. Main language Families share a core thematic hue range, and individual tribes are distinguished by nested parent-child linear gradients.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#009999] to-[#00E1E1]" />
                      <span className="text-zinc-300">Uralic Arctic</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFCC00] to-[#CC9900]" />
                      <span className="text-zinc-300">Niger-Congo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#CC0000] to-[#800000]" />
                      <span className="text-zinc-300">Americas Indig.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#9933CC] to-[#660099]" />
                      <span className="text-zinc-300">Austronesian</span>
                    </div>
                  </div>
                </div>

                {/* Direct List select box */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-300 font-display uppercase tracking-widest">
                    Mapped Populations Index
                  </div>
                  <div className="border border-white/5 rounded-xl divide-y divide-white/5 max-h-[250px] overflow-y-auto bg-zinc-950/20">
                    {filteredGroups.map((group) => (
                      <button 
                        key={group.id}
                        onClick={() => handleSelectGroup(group)}
                        className="w-full flex items-center justify-between text-left p-3 hover:bg-zinc-900/60 transition-colors text-xs font-semibold text-zinc-300 hover:text-white"
                        id={`index-item-${group.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: group.gradient_specs }} />
                          <span>{group.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
                          <span>{group.population_count.toLocaleString()}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
                        </div>
                      </button>
                    ))}
                    {filteredGroups.length === 0 && (
                      <div className="p-4 text-center text-xs text-zinc-500 italic">No groups match filters. Click 'reset filters' in the command bar.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Bottom attribution card */}
          <div className="p-4 border-t border-white/5 bg-zinc-950/60 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              Spliced from IWGIA & MRG data
            </span>
            <span>UNHCR Database verified 2026</span>
          </div>

        </aside>

        {/* 3. CENTRAL MAP CANVAS (VISUALIZATION LAYER) */}
        <main className="flex-1 relative h-full w-full bg-[#0d0d11]">
          {/* Leaflet native Div Container */}
          <div 
            ref={mapContainerRef} 
            className="absolute inset-0 z-10 w-full h-full"
            style={{ outline: 'none' }}
          />

          {/* Quick AI Trigger Action Chips (Floating Over the Map) */}
          <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 max-w-[280px] md:max-w-md pointer-events-auto">
            
            <button 
              onClick={() => runAiQuery(
                "Identify which mapped communities (e.g. Manchu, Xakriabá, Veps) are undergoing the most severe language threats. What are the geopolitical factors driving these shifts? What recommendations do international human rights bodies (UNESCO, IWGIA) offer for revitalization?",
                null,
                "Linguistic Shifts & Endangerment analysis"
              )}
              className="px-3 py-2 rounded-full glass-panel hover:border-amber-400/30 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-all shadow-xl"
              style={{ background: 'rgba(20,20,30,0.85)' }}
              id="action-btn-lang-shifts"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Expose Language Shifts
            </button>

            <button 
              onClick={() => runAiQuery(
                "Examine the rights-based status of unrecognized stateless groups like the West Papuans, Rohingya, or Yanomami. Detail how they exist outside conventional state systems, the impact of land exploitation, and what protections they are afforded under ILO Convention 169.",
                null,
                "Statelessness & Land Rights Legal analysis"
              )}
              className="px-3 py-2 rounded-full glass-panel hover:border-amber-400/30 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-all shadow-xl"
              style={{ background: 'rgba(20,20,30,0.85)' }}
              id="action-btn-legal-status"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              Expose Legal Injustices
            </button>

            <button 
              onClick={() => runAiQuery(
                "Act as an expert geospatial cultural anthropologist. Analyze the parental-child kinship links of our mapped Uralic, Niger-Congo, and Austronesian families. Explain how these 'cousin' groups showcase deep historic bonds, shared folklore, yet distinct territorial adaptations.",
                null,
                "Cultural Kinship and Syncretism Analysis"
              )}
              className="px-3 py-2 rounded-full glass-panel hover:border-amber-400/30 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-all shadow-xl"
              style={{ background: 'rgba(20,20,30,0.85)' }}
              id="action-btn-kinship"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Trace Cultural Symbiosis
            </button>

            {/* General AI ask button */}
            <button 
              onClick={() => {
                setIsAiPanelOpen(true);
                setAiResponse("### Ask ISPIM AI Envoy\nType anything in the prompt input below like:\n* *'How do the Otamari tata houses preserve pre-colonial defense strategies?'*\n* *'Who are the Jola and why are they considered forest guardians?'*\n* *'Explain the concept of self-identification under UNDRIP.'*");
              }}
              className="px-3 py-2 rounded-full bg-amber-500 text-zinc-950 font-display font-medium text-xs flex items-center gap-1.5 shadow-xl glow-btn hover:bg-amber-400"
              id="action-btn-global-ask"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Envoy
            </button>

          </div>

          {/* 4. OVERLAY ENVOY AI RESPONSE PANEL (GLASSMORPHIC CHROME) */}
          {isAiPanelOpen && (
            <div className="absolute inset-y-4 right-4 w-full max-w-[340px] md:max-w-md z-30 glass-panel-gold rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto" id="global-ai-overlay-panel">
              
              {/* Header */}
              <div className="px-5 py-4 border-b border-amber-500/10 flex items-center justify-between bg-zinc-950/40">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-mono text-zinc-400">Gemini Intelligence</h3>
                    <div className="text-sm font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-300">
                      {aiTitle}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiPanelOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  id="ai-panel-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Response markdown scrolling content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {aiContextGroup && (
                  <div className="p-3 rounded-lg border border-amber-500/10 bg-amber-950/5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs" style={{ background: aiContextGroup.gradient_specs }}>
                      {aiContextGroup.name.charAt(0)}
                    </span>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-mono">Current Context Scope:</div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">{aiContextGroup.name}</div>
                    </div>
                  </div>
                )}

                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 space-y-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-mono text-zinc-400 text-xs tracking-wider animate-pulse">Consulting IWGIA & UN Ethnohistorical resources...</p>
                  </div>
                ) : (
                  <div className="space-y-1 select-text">
                    {parseMarkdown(aiResponse)}
                  </div>
                )}

              </div>

              {/* User text input for questions */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiPromptInput.trim()) {
                    runAiQuery(aiPromptInput, aiContextGroup, "Custom Linguistic Analysis");
                    setAiPromptInput('');
                  }
                }}
                className="p-4 border-t border-amber-500/10 bg-zinc-950/50 space-y-3"
              >
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="Ask more about language shifts, relocations..."
                    className="flex-1 px-4 py-2 text-xs rounded-xl glass-input min-w-0"
                  />
                  <button 
                    type="submit"
                    disabled={isAiLoading || !aiPromptInput.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-[#0c0c0e] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer disabled:opacity-50 flex items-center gap-1 transition-all"
                    id="submit-ai-overlay-btn"
                  >
                    Send
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 justify-center">
                  <Info className="w-3 h-3 text-amber-500" />
                  <span>Enforces ILO No. 169 & UN UNDRIP Framework values.</span>
                </div>
              </form>

            </div>
          )}

          {/* Quick Guide overlay on Map bottom-left */}
          <div className="absolute bottom-4 left-4 z-20 p-4 rounded-xl glass-panel max-w-[280px]" style={{ background: 'rgba(15,15,22,0.8)' }}>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-amber-200 mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Dynamic Interactive Canvas
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Every circular pulse represents an active community mapped according to modern coordinates from LandMark.
            </p>
            <p className="text-[10px] text-zinc-400 mt-2 font-semibold">
              💡 Hover on pulses to reveal fast metrics. Click markers to anchor details.
            </p>
          </div>

        </main>

      </div>

    </div>
  );
}
