import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import ThreeGlobe from './components/ThreeGlobe';
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

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Indigenous' | 'Stateless' | 'Isolated'>('All');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Americas' | 'Asia' | 'Europe' | 'Africa' | 'Oceania'>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  
  const [activeGroupId, setActiveGroupId] = useState<string>('sami');
  const [searchFocused, setSearchFocused] = useState(false);

  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [mobilePerspective, setMobilePerspective] = useState<'map' | 'directory' | 'ai'>('map');
  const [isFiltersOpenOnMobile, setIsFiltersOpenOnMobile] = useState(false);

  const setMobileTabAndScrollToId = (tab: 'map' | 'directory' | 'ai') => {
    setMobilePerspective(tab);
    setTimeout(() => {
      const el = document.getElementById('active-group-sidebar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  useEffect(() => {
    if (mobilePerspective === 'map' && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 150);
    }
  }, [mobilePerspective]);

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiContextGroup, setAiContextGroup] = useState<IndigenousGroup | null>(null);
  const [aiTitle, setAiTitle] = useState('ISPIM AI Cultural Envoy');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [customGroupAnswer, setCustomGroupAnswer] = useState<string>('');
  const [isCustomGroupLoading, setIsCustomGroupLoading] = useState<boolean>(false);
  const [customGroupPrompt, setCustomGroupPrompt] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

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

  const activeGroup = useMemo(() => {
    return INDIGENOUS_GROUPS.find(g => g.id === activeGroupId) || null;
  }, [activeGroupId]);

  const cousinGroups = useMemo(() => {
    if (!activeGroup) return [];
    return INDIGENOUS_GROUPS.filter(g => g.family_id === activeGroup.family_id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeGroup]);

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

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.0, 15.0],
        zoom: 2.5,
        minZoom: 1.5,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false,
        worldCopyJump: true,
        maxBounds: [
          [-85, -180],
          [85, 180]
        ],
        maxBoundsViscosity: 1.0
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);

      mapRef.current = map;
      markersRef.current = markersGroup;
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      markersRef.current.clearLayers();

      filteredGroups.forEach((group) => {
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

  const handleSelectGroup = (group: IndigenousGroup) => {
    setActiveGroupId(group.id);
    if (mapRef.current) {
      mapRef.current.flyTo([group.location.latitude, group.location.longitude], 6, {
        duration: 1.5
      });
    }
    setMobilePerspective('map');
  };

  const runAiQuery = async (promptText: string, contextGroup: IndigenousGroup | null, titleText?: string) => {
    setIsAiPanelOpen(true);
    setAiResponse('');
    setIsAiLoading(true);
    if (titleText) setAiTitle(titleText);
    setAiContextGroup(contextGroup);
    setMobilePerspective('ai');

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: promptText,
          contextGroup: contextGroup
        })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setAiResponse(data.text);
      } else if (data.error === "MISSING_API_KEY") {
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
      } else {
        setAiResponse(`### API Call Unsuccessful\n\nThere was an error communicating with the Gemini models: ${data.error || "Unknown Error"}`);
      }
    } catch (err: any) {
      console.error(err);
      setAiResponse(`### Connection Error\n\nThere was an error connecting to the backend server.\n\n**Error Trace:** \`${err?.message || err}\``);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGroupSpecificAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGroupPrompt.trim() || !activeGroup) return;

    setIsCustomGroupLoading(true);
    setCustomGroupAnswer('');

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contextGroup: activeGroup,
          isGroupSpecific: true,
          customPrompt: customGroupPrompt
        })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setCustomGroupAnswer(data.text);
      } else if (data.error === "MISSING_API_KEY") {
        setCustomGroupAnswer("Gemini API key is not configured. Run the prompt anyway to read setup metrics.");
        runAiQuery(customGroupPrompt, activeGroup, `Querying the Oracle for ${activeGroup.name}`);
      } else {
        setCustomGroupAnswer(`Error: ${data.error || "Unknown Error"}`);
      }
    } catch (err: any) {
      setCustomGroupAnswer(`Connection Error: ${err.message || err}`);
    } finally {
      setIsCustomGroupLoading(false);
    }
  };

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedRegion('All');
    setSelectedFamily('All');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'All') count++;
    if (selectedRegion !== 'All') count++;
    if (selectedFamily !== 'All') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedStatus, selectedRegion, selectedFamily, searchQuery]);

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#040406] font-sans antialiased text-zinc-300">
      
      <header className="z-40 relative flex items-center justify-between gap-3 px-4 md:px-5 border-b border-zinc-800 bg-[#060608] shrink-0 h-14">
        
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-1 h-5 md:w-1.5 md:h-6 bg-blue-600 rounded-sm animate-pulse shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[10px] md:text-xs font-bold font-mono tracking-wider md:tracking-widest text-zinc-100 uppercase truncate">
                <span className="hidden xs:inline">ISPIM // </span>GEOPOLITICAL INDEX
              </h1>
              <span className="hidden sm:inline text-[8px] font-mono px-1.5 py-0.2 select-none rounded border border-blue-500/20 text-blue-400 bg-blue-950/20">
                SYS_2.5
              </span>
            </div>
            <p className="hidden md:block text-[9px] font-mono text-zinc-500 tracking-wide truncate">
              MAPPED INDIGENOUS REPERTOIRE & STATELESS GLOBAL SURVIVAL DECK
            </p>
          </div>
        </div>

        <div className="flex items-center p-0.5 rounded border border-zinc-800 bg-zinc-950 shadow-inner shrink-0">
          <button 
            onClick={() => {
              setViewMode('2d');
              setMobilePerspective('map');
            }}
            className={`px-2.5 md:px-3.5 py-1 font-mono text-[9px] uppercase font-bold tracking-wider rounded transition-all cursor-pointer ${
              viewMode === '2d' 
                ? 'bg-blue-600/90 text-white shadow-md' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="hidden xs:inline">2D Vector</span>
            <span className="xs:hidden">2D</span>
          </button>
          <button 
            onClick={() => {
              setViewMode('3d');
              setMobilePerspective('map');
            }}
            className={`px-2.5 md:px-3.5 py-1 font-mono text-[9px] uppercase font-bold tracking-wider rounded transition-all cursor-pointer ${
              viewMode === '3d' 
                ? 'bg-blue-600/90 text-white shadow-md' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="hidden xs:inline">3D Spherical</span>
            <span className="xs:hidden">3D</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 max-w-full">
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-805 bg-[#09090c]">
            <Filter className="w-3 h-3 text-zinc-500" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-[10px] font-mono hover:text-white cursor-pointer focus:outline-none text-zinc-400"
            >
              <option value="All" className="bg-[#09090c] text-zinc-300">STATUS: ALL</option>
              <option value="Indigenous" className="bg-[#09090c] text-zinc-300">INDIGENOUS</option>
              <option value="Stateless" className="bg-[#09090c] text-zinc-300">STATELESS</option>
              <option value="Isolated" className="bg-[#09090c] text-zinc-300">ISOLATED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-805 bg-[#09090c]">
            <Globe className="w-3 h-3 text-zinc-500" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="bg-transparent text-[10px] font-mono hover:text-white cursor-pointer focus:outline-none text-zinc-400"
            >
              <option value="All" className="bg-[#09090c] text-zinc-300">REGION: ALL</option>
              <option value="Americas" className="bg-[#09090c] text-zinc-300">AMERICAS</option>
              <option value="Asia" className="bg-[#09090c] text-zinc-300">ASIA</option>
              <option value="Europe" className="bg-[#09090c] text-zinc-300">EUROPE</option>
              <option value="Africa" className="bg-[#09090c] text-zinc-300">AFRICA</option>
              <option value="Oceania" className="bg-[#09090c] text-zinc-300">OCEANIA</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-805 bg-[#09090c]">
            <Layers className="w-3 h-3 text-zinc-500" />
            <select 
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-transparent text-[10px] font-mono hover:text-white cursor-pointer focus:outline-none text-zinc-400 max-w-[130px] overflow-hidden text-ellipsis"
            >
              <option value="All" className="bg-[#09090c] text-zinc-300">FAMILY: ALL</option>
              {familyIds.map((fam) => (
                <option key={fam.id} value={fam.id} className="bg-[#09090c] text-zinc-300">
                  {fam.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center bg-[#09090c] border border-zinc-805 rounded">
            <Search className={`absolute left-2.5 w-3 h-3 transition-colors ${searchFocused ? 'text-blue-400' : 'text-zinc-500'}`} />
            <input 
              type="text"
              placeholder="Query clans, dialects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-7 pr-7 py-1 w-[150px] text-[10px] font-mono bg-transparent text-zinc-200 outline-none transition-all duration-300 focus:w-[190px]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {(searchQuery || selectedStatus !== 'All' || selectedRegion !== 'All' || selectedFamily !== 'All') && (
            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[9px] font-mono px-2 py-1.5 rounded bg-blue-950/25 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
              CLEAR ({filteredGroups.length})
            </button>
          )}

        </div>

        <button
          onClick={() => setIsFiltersOpenOnMobile(!isFiltersOpenOnMobile)}
          className={`lg:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border font-mono text-[9px] font-bold tracking-wider cursor-pointer transition-all shrink-0 ${
            isFiltersOpenOnMobile || activeFiltersCount > 0
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.15)] animate-pulse'
              : 'border-zinc-800 bg-[#09090c] hover:bg-zinc-900 text-zinc-400 hover:text-zinc-250'
          }`}
        >
          <Filter className={`w-3.5 h-3.5 ${activeFiltersCount > 0 ? 'text-blue-400' : 'text-zinc-500'}`} />
          <span>FILTER</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center px-1.5 py-0.2 rounded bg-blue-600 text-white font-mono text-[8px] font-black leading-tight">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="hidden lg:flex items-center gap-3 text-[9px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>SECURE_AI: TRUE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>MAP_NODES: {stats.totalCount} ACTIVE</span>
          </div>
        </div>

      </header>

      {isFiltersOpenOnMobile && (
        <div className="lg:hidden absolute left-0 right-0 top-14 z-50 p-4 border-b border-zinc-800 bg-[#07070a]/98 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 gap-3.5 shadow-2 flex flex-col shadow-2xl animate-fade-in">
          
          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Global Search Cluster</span>
            <div className="relative flex items-center bg-[#09090c] border border-zinc-800 rounded p-1">
              <Search className="w-3.5 h-3.5 text-zinc-505 ml-1.5 mr-2 shrink-0" />
              <input 
                type="text"
                placeholder="Query clans, dialects, summary datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-mono bg-transparent text-zinc-200 outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Select Category</span>
            <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-[#09090c]">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-transparent text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#09090c] text-zinc-300">STATUS: ALL</option>
                <option value="Indigenous" className="bg-[#09090c] text-blue-400">INDIGENOUS</option>
                <option value="Stateless" className="bg-[#09090c] text-red-400">STATELESS</option>
                <option value="Isolated" className="bg-[#09090c] text-amber-400">ISOLATED</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Select Region</span>
            <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-[#09090c]">
              <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="w-full bg-transparent text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#09090c] text-zinc-300">REGION: ALL</option>
                <option value="Americas" className="bg-[#09090c] text-zinc-300">AMERICAS</option>
                <option value="Asia" className="bg-[#09090c] text-zinc-301">ASIA</option>
                <option value="Europe" className="bg-[#09090c] text-zinc-301">EUROPE</option>
                <option value="Africa" className="bg-[#09090c] text-zinc-301">AFRICA</option>
                <option value="Oceania" className="bg-[#09090c] text-zinc-301">OCEANIA</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Select Language Family</span>
            <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-[#09090c]">
              <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select 
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#09090c] text-zinc-300">FAMILY: ALL</option>
                {familyIds.map((fam) => (
                  <option key={fam.id} value={fam.id} className="bg-[#09090c] text-zinc-302">
                    {fam.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:col-span-2 pt-2 border-t border-zinc-800">
            <button 
              onClick={() => {
                handleResetFilters();
              }}
              disabled={activeFiltersCount === 0}
              className="flex items-center gap-1.5 text-[9px] font-mono px-3 py-2 rounded bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              RESET ({activeFiltersCount})
            </button>
            <button 
              onClick={() => setIsFiltersOpenOnMobile(false)}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[9px] uppercase shadow-md transition-colors cursor-pointer"
            >
              APPLY FILTERS ({filteredGroups.length})
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-black">
        
        <main className="flex-1 relative h-full w-full bg-black">
          
          <div 
            className={`absolute inset-0 z-10 w-full h-full transition-opacity duration-300 ${
              viewMode === '2d' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div 
              ref={mapContainerRef} 
              className="w-full h-full"
              style={{ outline: 'none' }}
            />
          </div>

          <div 
            className={`absolute inset-0 z-10 w-full h-full transition-opacity duration-300 ${
              viewMode === '3d' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {viewMode === '3d' && (
              <ThreeGlobe 
                groups={filteredGroups}
                activeGroupId={activeGroupId}
                onSelectGroup={(id) => {
                  setActiveGroupId(id);
                  const lookup = INDIGENOUS_GROUPS.find(g => g.id === id);
                  if (lookup && mapRef.current) {
                    mapRef.current.setView([lookup.location.latitude, lookup.location.longitude], 6);
                  }
                }}
              />
            )}
          </div>

          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute left-4 top-4 z-30 p-2.5 rounded border border-zinc-800 bg-[#09090c]/90 text-blue-400 hover:text-white cursor-pointer shadow-xl transition-all hover:bg-zinc-900 group"
              title="Expand Inspector Matrix"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="absolute left-full ml-2 px-2 py-1 rounded border border-zinc-800 bg-[#09090c] text-[8px] tracking-widest font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                EXPAND_INDEX
              </span>
            </button>
          )}

          {!isAiPanelOpen && (
            <button
              onClick={() => {
                setIsAiPanelOpen(true);
                if (!aiResponse) {
                  setAiResponse("### Ask ISPIM AI Envoy\nType anything in the prompt input below like:\n* *'How do the Otamari tata houses preserve pre-colonial defense strategies?'*\n* *'Who are the Jola and why are they considered forest guardians?'*\n* *'Explain the concept of self-identification under UNDRIP.'*");
                }
              }}
              className="absolute right-4 top-4 z-30 p-2.5 rounded border border-zinc-800 bg-[#09090c]/90 text-blue-400 hover:text-white cursor-pointer shadow-xl transition-all hover:bg-zinc-900 group"
              title="Open AI Intelligence Envoy"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="absolute right-full mr-2 px-2 py-1 rounded border border-zinc-800 bg-[#09090c] text-[8px] tracking-widest font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                CONSULT_ENVOY
              </span>
            </button>
          )}

          <aside 
            className={`absolute inset-x-0 top-0 bottom-0 lg:left-4 lg:top-4 lg:bottom-4 w-full lg:w-[350px] h-full lg:h-auto z-30 flex flex-col rounded-none lg:rounded border-none lg:border border-zinc-800 bg-[#07070a]/96 lg:bg-[#07070a]/92 backdrop-blur-md shadow-2xl transition-all duration-300 pointer-events-auto overflow-hidden ${
              isSidebarCollapsed ? '-translate-x-full lg:-translate-x-[380px]' : 'translate-x-0'
            } ${mobilePerspective === 'directory' ? 'flex' : 'hidden lg:flex'}`}
          >
            
            <div className="px-4 py-3 border-b border-zinc-805 bg-zinc-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-300">
                  SYSTEM INSPECTOR
                </span>
              </div>
              <button 
                onClick={() => {
                  setIsSidebarCollapsed(true);
                  setMobilePerspective('map');
                }}
                className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
                title="Collapse Inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {activeGroup ? (
                
                <div className="space-y-4 animate-fade-in" id="active-group-sidebar">
                  
                  <div className="relative p-3 rounded border border-zinc-800 bg-[#0a0a0d] overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 opacity-10 font-mono text-[36px] select-none font-bold text-blue-500">

                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                          {activeGroup.region} SEGMENT
                        </span>
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-zinc-805 bg-zinc-900/50 uppercase tracking-wider text-blue-400">
                          {activeGroup.category}
                        </span>
                      </div>

                      <h2 className="text-sm font-bold font-mono tracking-tight text-zinc-100 uppercase">
                        {activeGroup.name}
                      </h2>

                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: activeGroup.gradient_specs }} />
                        <span>{activeGroup.familyName}</span>
                      </div>

                      <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase">VERIFIED_COUNT</p>
                          <p className="font-bold text-zinc-200">{activeGroup.population_count.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase">PROJECTION_2026</p>
                          <p className="font-bold text-blue-400">{activeGroup.metadata.population_projection_2026 || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded border border-zinc-800 bg-[#0a0a0d]/40 space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase text-zinc-400 font-bold tracking-widest">
                      <span>Kinship Color Index</span>
                      <span className="text-zinc-600">ID: {activeGroup.family_id.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded shadow-inner flex shrink-0 border border-zinc-800" style={{ background: activeGroup.gradient_specs }} />
                      <div className="text-[9px] font-mono text-zinc-400 leading-normal">
                        Minor clanned subdivisions share parent hue family <span className="text-blue-400">{activeGroup.familyName}</span> to map architectural roots and territorial migration.
                      </div>
                    </div>

                    {cousinGroups.length > 0 && (
                      <div className="pt-2.5 border-t border-zinc-800 space-y-1">
                        <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block">Related System Nodes:</span>
                        <div className="grid grid-cols-1 gap-1">
                          {cousinGroups.map((cousin) => {
                            const isActive = cousin.id === activeGroupId;
                            return (
                              <button
                                key={cousin.id}
                                onClick={() => handleSelectGroup(cousin)}
                                className={`text-[10px] font-mono px-2 py-1 rounded border transition-all duration-150 flex items-center justify-between cursor-pointer w-full text-left ${
                                  isActive
                                    ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 font-semibold'
                                    : 'bg-[#09090c]/50 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                                }`}
                              >
                                <span className="truncate flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cousin.gradient_specs }} />
                                  {cousin.name.toUpperCase()}
                                </span>
                                <ChevronRight className="w-3 h-3 text-zinc-600" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-widest">
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      <span>SOCIODEMOGRAPHIC BRIEF</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed bg-[#0a0a0d]/20 p-2.5 rounded border border-zinc-900 font-mono">
                      {activeGroup.metadata.summary}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-widest">
                      <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse" />
                      <span>LEGAL SURVIVAL STATUS</span>
                    </div>
                    <div className="p-2.5 rounded border border-zinc-900 bg-[#0a0a0d]/20 font-mono text-[10px] text-zinc-400 leading-relaxed">
                      {activeGroup.metadata.legal_status}
                    </div>
                  </div>

                  <div className="p-3 rounded border border-blue-500/20 bg-blue-950/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>LOCAL ENVOY QUERY PORT</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono leading-normal">
                      Query cultural preservation folklore, vernacular architecture defense, or land rights challenges:
                    </p>
                    
                    <form onSubmit={handleGroupSpecificAsk} className="flex gap-1.5">
                      <input 
                        type="text"
                        placeholder={`e.g. Traditional dress, oral lore...`}
                        value={customGroupPrompt}
                        onChange={(e) => setCustomGroupPrompt(e.target.value)}
                        className="flex-1 px-2 py-1 text-[10px] font-mono rounded border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-blue-500/50 outline-none"
                      />
                      <button 
                        type="submit"
                        disabled={isCustomGroupLoading || !customGroupPrompt.trim()}
                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 hover:shadow-md cursor-pointer text-[10px] font-bold font-mono text-white flex items-center justify-center transition-colors disabled:opacity-30"
                      >
                        {isCustomGroupLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                      </button>
                    </form>

                    {customGroupAnswer && (
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900 max-h-[140px] overflow-y-auto" id="custom-group-answer-box">
                        <span className="text-[8px] uppercase font-bold text-blue-400 font-mono tracking-wider block mb-1">DATA RESPONSE LOCK:</span>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-mono whitespace-pre-line">{customGroupAnswer}</p>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                
                <div className="space-y-4 font-mono select-none" id="sidebar-overview-layout">
                  
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950 text-center space-y-1">
                    <Globe className="w-5 h-5 text-blue-500 mx-auto animate-spin-slow" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                      GEOSPATIAL SPATIAL GRID
                    </h3>
                    <p className="text-[9px] text-zinc-500 leading-relaxed">
                      Select map markers or indices to anchor individual cluster coordinates and lock telemetry focus.
                    </p>
                  </div>

                  <div className="p-3 rounded border border-zinc-800 bg-[#0a0a0d] space-y-2.5">
                    <div className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                      <LayoutDashboard className="w-3 h-3 text-blue-400" />
                      <span>REGIONAL RATIO INDEX ({stats.totalCount})</span>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(stats.regionsCount).map(([regionName, count]) => {
                        const numValue = count as number;
                        const pct = stats.totalCount > 0 ? (numValue / stats.totalCount) * 100 : 0;
                        return (
                          <div key={regionName} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="text-zinc-400 font-bold uppercase tracking-wide">{regionName}</span>
                              <span className="text-zinc-500 font-mono font-medium">{count} ({Math.round(pct)}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-850">
                              <div 
                                className="h-full rounded-sm bg-blue-600 shadow-[0_0_4px_rgba(59,130,246,0.3)] transition-all duration-400" 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 rounded border border-zinc-800 bg-[#0a0a0d]/50 space-y-1.5">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">MAP_TELEMETRY_KEY</span>
                    <p className="text-[9px] text-zinc-400 leading-normal leading-relaxed">
                      Map nodes represent indigenous segments, isolated communities, and stateless peoples plotted directly on Mercator (2D) and Spherical (3D) coordinates.
                    </p>
                    <div className="grid grid-cols-2 gap-1 pt-1 text-[8px] text-zinc-400 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Indigenous</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Stateless</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Isolated</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest block">
                      SECURE POPULATION REGISTER
                    </span>
                    <div className="border border-zinc-800 rounded divide-y divide-zinc-900 max-h-[160px] overflow-y-auto bg-zinc-950">
                      {filteredGroups.map((group) => (
                        <button 
                          key={group.id}
                          onClick={() => handleSelectGroup(group)}
                          className="w-full flex items-center justify-between text-left p-2 hover:bg-zinc-900 transition-colors text-[10px] font-bold text-zinc-400 hover:text-white"
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.gradient_specs }} />
                            {group.name.toUpperCase()}
                          </span>
                          <span className="font-mono text-zinc-500 text-[9px] shrink-0">
                            {group.population_count.toLocaleString()}
                          </span>
                        </button>
                      ))}
                      {filteredGroups.length === 0 && (
                        <div className="p-4 text-center text-[9px] text-zinc-600 italic">No nodes detected under current criteria.</div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[8px] text-zinc-500 font-mono select-none">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-500" />
                UNHCR DATASETS VERIFIED_2026
              </span>
              <span>SYS_STABLE: OK</span>
            </div>

          </aside>

          {isAiPanelOpen && (
            <div 
              className={`absolute inset-x-0 top-0 bottom-0 lg:right-4 lg:top-4 lg:bottom-4 w-full lg:w-[380px] h-full lg:h-auto z-30 flex flex-col rounded-none lg:rounded border-none lg:border border-zinc-800 bg-[#07070a]/96 lg:bg-[#07070a]/92 backdrop-blur-md shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 ${
                isAiPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-[420px]'
              } ${mobilePerspective === 'ai' ? 'flex' : 'hidden lg:flex'}`}
              id="global-ai-overlay-panel"
            >
              
              <div className="px-4 py-3 border-b border-zinc-808 bg-zinc-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-blue-950/20 border border-blue-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-[8px] uppercase tracking-widest font-mono text-zinc-500 font-bold">GEMINI INTELLIGENCE</h3>
                    <div className="text-xs font-bold font-mono text-zinc-200">
                      {aiTitle.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAiPanelOpen(false);
                    setMobilePerspective('map');
                  }}
                  className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {aiContextGroup && (
                  <div className="p-2.5 rounded border border-zinc-800 bg-blue-950/5 flex items-center gap-2.5">
                    <span className="w-6.5 h-6.5 rounded flex items-center justify-center font-mono font-bold text-[10px] text-white shrink-0" style={{ background: aiContextGroup.gradient_specs }}>
                      {aiContextGroup.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[8px] text-zinc-500 font-mono">ENVOY_CONTEXT_LATCHED:</div>
                      <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest truncate">{aiContextGroup.name}</div>
                    </div>
                  </div>
                )}

                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 space-y-2.5">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <p className="text-[9px] font-mono text-zinc-500 tracking-wider animate-pulse uppercase">QUERYING ANTHROPOLOGICAL UN STACK...</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono select-text text-zinc-400">
                    
                    {parseMarkdown(aiResponse)}

                    <div className="mt-6 pt-5 border-t border-zinc-800 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#90b1e4]">
                          TACTICAL ENVOY QUICK INQUIRIES
                        </h4>
                      </div>
                      <p className="text-[9px] text-zinc-500 leading-normal leading-relaxed">
                        Execute secure preconfigured Gemini API queries on self-determination, legal status conflicts, and language endangerment metrics:
                      </p>
                      
                      <div className="grid grid-cols-1 gap-2 pt-1 font-mono">
                        {[
                          {
                            title: "Linguistic Erosion Matrix",
                            desc: "Explore severe language endangerment (e.g., Manchu, Jola) and revitalization programs.",
                            prompt: "Identify which mapped communities (e.g. Manchu, Xakriabá, Veps) are undergoing the most severe language threats. What are the geopolitical factors driving these shifts? What recommendations do international human rights bodies (UNESCO, IWGIA) offer for revitalization?"
                          },
                          {
                            title: "Statelessness & Territorial Injustice",
                            desc: "Analyze unrecognized sovereign conflicts and ILO Convention 169 protections.",
                            prompt: "Examine the rights-based status of unrecognized stateless groups like the West Papuans, Rohingya, or Yanomami. Detail how they exist outside conventional state systems, the impact of land exploitation, and what protections they are afforded under ILO Convention 169."
                          },
                          {
                            title: "Ethnohistoric Kinship & Clanning",
                            desc: "Trace shared parent-child folklore and boundaries across Uralic and Austronesian families.",
                            prompt: "Act as an expert geospatial cultural anthropologist. Analyze the parental-child kinship links of our mapped Uralic, Niger-Congo, and Austronesian families. Explain how these 'cousin' groups showcase deep historic bonds, shared folklore, yet distinct territorial adaptations."
                          },
                          {
                            title: "Pre-Colonial Ecological Architecture",
                            desc: "Deconstruct eco-centric folklore structures protecting regional biodiversity pools.",
                            prompt: "How do pre-colonial architectural designs and eco-centric folklore of stateless or isolated groups (like Jola or San) preserve ecological balance? Provide specific case studies of indigenous-led conservation."
                          }
                        ].map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => runAiQuery(q.prompt, aiContextGroup, q.title)}
                            className="w-full text-left p-2.5 rounded border border-zinc-800 bg-zinc-950/40 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all text-zinc-400 hover:text-white cursor-pointer group/qbtn shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-bold tracking-tight text-zinc-300 group-hover/qbtn:text-blue-400">
                                {q.title.toUpperCase()}
                              </span>
                              <ChevronRight className="w-3 h-3 text-zinc-650 group-hover/qbtn:text-blue-400 transform group-hover/qbtn:translate-x-0.5 transition-all shrink-0" />
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-1 leading-normal">
                              {q.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiPromptInput.trim()) {
                    runAiQuery(aiPromptInput, aiContextGroup, "Manual Query Capture");
                    setAiPromptInput('');
                  }
                }}
                className="p-3 border-t border-zinc-800 bg-zinc-950/75 space-y-2.5 shrink-0"
              >
                <div className="flex gap-1.5">
                  <input 
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="Input custom geopolitical query..."
                    className="flex-1 px-3 py-1.5 text-[10px] font-mono rounded border border-zinc-800 bg-zinc-950 text-zinc-300 outline-none focus:border-blue-500/50"
                  />
                  <button 
                    type="submit"
                    disabled={isAiLoading || !aiPromptInput.trim()}
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 hover:shadow-md text-[10px] font-bold font-mono text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                  >
                    SEND_PORT
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500 justify-center">
                  <Info className="w-3 h-3 text-blue-500" />
                  <span>DECK BOUND UNDER UNDRIP AND ILO CONVENTION 169 MANDATES</span>
                </div>
              </form>

            </div>
          )}

          <div className="absolute hover:opacity-10 bottom-4 left-4 z-20 p-3 rounded border border-zinc-800 bg-[#07070a]/90 max-w-[210px] pointer-events-auto leading-relaxed select-none">
            <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              COGNITIVE DECK
            </h4>
            <p className="text-[9px] font-mono text-zinc-500 leading-normal">
              Nodes plotted with precision from Landsat, IWGIA and Landmark databases.
            </p>
            <p className="text-[9px] font-mono text-blue-400 mt-2 font-semibold">
              💡 Drag to steer. Click nodes to focus and unlock direct UN Envoy channels.
            </p>
          </div>

        </main>

      </div>

      <div className="lg:hidden z-40 flex border-t border-zinc-900 bg-[#060608] h-12 shrink-0">
        <button 
          onClick={() => {
            setMobilePerspective('map');
            setIsSidebarCollapsed(true);
            setIsAiPanelOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
            mobilePerspective === 'map' ? 'text-blue-400 bg-zinc-950/60 font-bold' : 'text-zinc-600 hover:text-zinc-400'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          Tactical Map
        </button>
        <button 
          onClick={() => {
            setMobilePerspective('directory');
            setIsSidebarCollapsed(false);
            setIsAiPanelOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
            mobilePerspective === 'directory' ? 'text-blue-400 bg-zinc-950/60 font-bold' : 'text-zinc-650 hover:text-zinc-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          Inspector
        </button>
        <button 
          onClick={() => {
            setMobilePerspective('ai');
            setIsSidebarCollapsed(true);
            setIsAiPanelOpen(true);
          }}
          className={`flex-1 flex flex-col items-center justify-center font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
            mobilePerspective === 'ai' ? 'text-blue-400 bg-zinc-950/60 font-bold' : 'text-zinc-650 hover:text-zinc-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 animate-pulse" />
          Envoy Link
        </button>
      </div>

    </div>
  );
}
