import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Search, X, Sparkles, Zap, Palette, GraduationCap, Compass, Grid,
  ExternalLink, Star, ChevronRight, Menu, ArrowUpRight,
  Layers, Box, Bookmark, BookmarkCheck, User, LogIn, LogOut, Plus, Trash2,
  Mail, Lock, Eye, EyeOff, RefreshCw, AlertCircle, Info, Check, Copy,
  Share, Twitter, Linkedin, Link, Folder, Folders, History, TrendingUp, Clock, Tag
} from 'lucide-react';
import BorderGlow from './components/BorderGlow';
import CardSwap, { Card } from './components/CardSwap';
import SideRays from './components/SideRays';
import { AnimateIcon, ExternalLink as AnimatedExternalLink } from './components/AnimateIcon';
import { RotatingTextContainer, RotatingText } from './components/RotatingText';
import { LoadingScreen } from './components/LoadingScreen';

// ============================================
// DATA: All 128 tools (updated retro TV link)
// ============================================
const toolsData = [
  {"id": "remove-bg", "name": "Remove.bg", "link": "https://www.remove.bg", "description": "AI-powered instant background removal for portraits, products, and graphics.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium"},
  {"id": "cleanup-pictures", "name": "Cleanup.pictures", "link": "https://cleanup.pictures", "description": "Remove unwanted objects, text, or people from any image using AI inpainting.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium ($3.99/mo)"},
  {"id": "autodraw", "name": "Autodraw", "link": "https://www.autodraw.com", "description": "Google's machine learning tool that pairs rough sketches with professional clip art.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Free"},
  {"id": "kittl", "name": "Kittl", "link": "https://www.kittl.com", "description": "AI-powered design platform with advanced typography, templates, and vector asset generation.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium ($10/mo)"},
  {"id": "collov-ai", "name": "Collov AI", "link": "https://collov.ai", "description": "AI-driven interior design and virtual home staging tool to transform empty space concepts.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium"},
  {"id": "reimagine-home", "name": "Reimagine Home", "link": "https://www.reimaginehome.ai", "description": "AI interior design platform for remodeling, virtual staging, and exterior landscaping concepts.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium"},
  {"id": "newarc-ai", "name": "NewArc AI", "link": "https://newarc.ai", "description": "Generates photorealistic architectural and fashion design renders from primitive sketches.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium"},
  {"id": "photoroom", "name": "Photoroom", "link": "https://www.photoroom.com", "description": "Professional studio-quality product photography generator and background editor.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Freemium ($9.99/mo)"},
  {"id": "vectorizer-ai", "name": "Vectorizer.ai", "link": "https://vectorizer.ai", "description": "Convert raster PNG/JPG images into clean, scalable vector SVG graphics using AI.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Premium ($9.99/mo)"},
  {"id": "midjourney", "name": "Midjourney", "link": "https://www.midjourney.com", "description": "State-of-the-art text-to-image AI model hosted natively inside Discord communities.", "category": "AI & Creative Tools", "subcategory": "Image & Design AI", "pricing": "Premium ($10/mo)"},
  {"id": "reka-ai", "name": "Reka AI", "link": "https://reka.ai", "description": "Advanced multimodal AI workspace built for automated short-form video clip discovery and editing.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "acapella-extractor", "name": "Acapella Extractor", "link": "https://www.acapella-extractor.com", "description": "Isolate and extract crystal-clear vocals from any audio track using deep learning.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "vocal-remover", "name": "Vocal Remover", "link": "https://vocalremover.org", "description": "Splits any music track into separate vocal and instrumental stems using AI algorithms.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "intangible-ai", "name": "Intangible AI", "link": "https://intangible.ai", "description": "AI video generation and cinematic visualization tools for rapid pre-production workflows.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "ssemble", "name": "Ssemble", "link": "https://ssemble.com", "description": "Online video editor loaded with powerful AI plugins for automated captions and tracking.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "x-minus-pro", "name": "X-Minus Pro", "link": "https://x-minus.pro", "description": "Advanced vocal extraction and karaoke backing track generator powered by AI source separation.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "meshy-ai", "name": "Meshy AI", "link": "https://www.meshy.ai", "description": "Turn textual descriptions or 2D images into rich 3D digital assets and textures.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium ($20/mo)"},
  {"id": "luma-dream-machine", "name": "Luma Dream Machine", "link": "https://lumalabs.ai/dream-machine", "description": "High-fidelity cinematic video generator producing realistic actions and fluid movements from prompts.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium"},
  {"id": "elevenlabs", "name": "ElevenLabs", "link": "https://elevenlabs.io", "description": "Hyper-realistic AI voice synthesis, text-to-speech, and precise voice cloning software.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium ($5/mo)"},
  {"id": "suno-ai", "name": "Suno AI", "link": "https://suno.com", "description": "Generates full-length musical compositions complete with lyrics, instrumentation, and vocals from text.", "category": "AI & Creative Tools", "subcategory": "Video & Audio AI", "pricing": "Freemium ($8/mo)"},
  {"id": "gamma-app", "name": "Gamma App", "link": "https://gamma.app", "description": "AI design engine that writes and formats stunning presentations, webpages, and document briefs.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium ($10/mo)"},
  {"id": "napkin-ai", "name": "Napkin AI", "link": "https://www.napkin.ai", "description": "Analyzes long-form text documents and instantly generates visual business diagrams and charts.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium ($15/mo)"},
  {"id": "ponder-chat", "name": "Ponder Chat", "link": "https://ponder.chat", "description": "AI copywriting companion specialized in creating search-optimized blog posts and marketing copy.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium"},
  {"id": "coze", "name": "Coze", "link": "https://www.coze.com", "description": "No-code development environment to build advanced multi-agent AI chatbots for messaging apps.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium"},
  {"id": "flowith", "name": "FloWith", "link": "https://flowith.io", "description": "Infinite-canvas AI interface allowing users to run complex, non-linear deep research trees.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium"},
  {"id": "perplexity-ai", "name": "Perplexity AI", "link": "https://www.perplexity.ai", "description": "Conversational search engine that conducts deep web research with detailed inline source citations.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium ($20/mo)"},
  {"id": "v0-by-vercel", "name": "v0 by Vercel", "link": "https://v0.dev", "description": "Generative UI system producing production-ready React, Tailwind, and HTML code blocks via chat.", "category": "AI & Creative Tools", "subcategory": "Productivity & Copywriting AI", "pricing": "Freemium ($20/mo)"},
  {"id": "tinywow", "name": "TinyWow", "link": "https://tinywow.com", "description": "Massive suite of 200+ free web tools handling PDF, video, image, and document modification.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Freemium ($5.99/mo)"},
  {"id": "stirling-pdf", "name": "Stirling-PDF", "link": "https://stirlingpdf.io", "description": "Powerful, fully web-based PDF editor that can be self-hosted locally for complete privacy.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Free (Open Source)"},
  {"id": "squoosh", "name": "Squoosh", "link": "https://squoosh.app", "description": "Google's image compression tool featuring advanced live side-by-side codec comparison previews.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Free"},
  {"id": "unpigeon", "name": "Unpigeon", "link": "https://unpigeon.me", "description": "Privacy-focused mail pipeline converting messy commercial email newsletter blasts into clean RSS feeds.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Free"},
  {"id": "cloudconvert", "name": "CloudConvert", "link": "https://cloudconvert.com", "description": "Universal file converter supporting over 200+ formats including video, audio, documents, and archives.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Freemium ($9/mo)"},
  {"id": "alternativeto", "name": "AlternativeTo", "link": "https://alternativeto.net", "description": "Crowdsourced database tracking user recommendations and alternatives to mainstream expensive software.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Free"},
  {"id": "cyberchef", "name": "CyberChef", "link": "https://gchq.github.io/CyberChef", "description": "The Ultimate 'Cyber Swiss Army Knife' for encoding, decoding, data formatting, and encryption analysis.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Free (Open Source)"},
  {"id": "convertio", "name": "Convertio", "link": "https://convertio.co", "description": "Advanced file converter processing heavy document archives, spreadsheet formats, and media formats online.", "category": "Utility & Productivity", "subcategory": "File Converters & Management", "pricing": "Freemium ($9.99/mo)"},
  {"id": "have-i-been-pwned", "name": "Have I Been Pwned", "link": "https://haveibeenpwned.com", "description": "Essential data breach index checker checking if personal emails or credentials have leaked online.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Free"},
  {"id": "wifi-map", "name": "WiFi Map", "link": "https://www.wifimap.io", "description": "Crowdsourced world map containing millions of active public WiFi hotspots and verified passwords.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Freemium"},
  {"id": "10-minute-mail", "name": "10 Minute Mail", "link": "https://10minutemail.com", "description": "Generates safe, temporary, disposable self-destructing emails to bypass annoying signup forms.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Free"},
  {"id": "virustotal", "name": "VirusTotal", "link": "https://www.virustotal.com", "description": "Aggregated antivirus scanner analyzing uploaded files and web domains against 70+ security engines.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Free"},
  {"id": "speedtest-by-ookla", "name": "Speedtest by Ookla", "link": "https://www.speedtest.net", "description": "Global industry standard for measuring raw internet connection speeds, latency, and stability.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Free"},
  {"id": "dns-checker", "name": "DNS Checker", "link": "https://dnschecker.org", "description": "Global DNS propagation checker mapping active records across servers situated worldwide.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Free"},
  {"id": "temp-mail", "name": "Temp Mail", "link": "https://temp-mail.org", "description": "Robust temporary email inbox service protecting primary addresses against spam marketing lists.", "category": "Utility & Productivity", "subcategory": "System, Network & Security", "pricing": "Freemium ($10/mo)"},
  {"id": "roadtrippers", "name": "Roadtrippers", "link": "https://roadtrippers.com", "description": "Comprehensive mapping software helping plan complex driving routes full of dynamic roadside points.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Freemium ($8/mo)"},
  {"id": "drive-and-listen", "name": "Drive & Listen", "link": "https://drivenlisten.com", "description": "Immersive virtual drive simulator tracking global metro streets synced to real local radio loops.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "make-my-drive-fun", "name": "Make My Drive Fun", "link": "https://www.makemydrivefun.com", "description": "Pinpoints quirky roadside attractions and forgotten historical locations along standard highways.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "the-true-size-of", "name": "The True Size Of", "link": "https://thetruesize.com", "description": "Interactive mapping engine revealing absolute dimensions of landmasses by breaking Mercator models.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "mcbroken", "name": "McBroken", "link": "https://mcbroken.com", "description": "Live tracking dashboard reflecting operational status of McDonald's ice cream machines across US metros.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "layla-ai", "name": "Layla AI", "link": "https://layla.ai", "description": "AI concierge generating customized multi-day travel itineraries and hotel listings dynamically.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Freemium ($49/yr)"},
  {"id": "flightradar24", "name": "Flightradar24", "link": "https://www.flightradar24.com", "description": "Global flight tracking utility delivering real-time telemetry from aircraft flying worldwide.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Freemium ($1.49/mo)"},
  {"id": "ventusky", "name": "Ventusky", "link": "https://www.ventusky.com", "description": "Stunning interactive meteorological map projecting wind currents, precipitation layers, and live fronts.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Freemium ($4.49/yr)"},
  {"id": "gridzzly", "name": "Gridzzly", "link": "https://gridzzly.com", "description": "Customizable grid and lined paper generator for architectural sketching, engineering, or print work.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "printfriendly", "name": "PrintFriendly", "link": "https://www.printfriendly.com", "description": "Optimizes messy blog posts and webpages by stripping ads and banners to build clean print PDFs.", "category": "Utility & Productivity", "subcategory": "Travel, Geography & Practical Utilities", "pricing": "Free"},
  {"id": "flourish-studio", "name": "Flourish Studio", "link": "https://flourish.studio", "description": "No-code data visualization tool framing deep statistics into beautiful animated graphics.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Freemium"},
  {"id": "dora-run", "name": "Dora Run", "link": "https://www.dora.run", "description": "Next-gen design suite outputting responsive, multi-axis 3D web spaces without complex code bases.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Freemium ($18/mo)"},
  {"id": "framer", "name": "Framer", "link": "https://www.framer.com", "description": "Design platform transforming high-fidelity interactive canvas layers straight into live code pages.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Freemium ($30/mo)"},
  {"id": "jitter-video", "name": "Jitter Video", "link": "https://jitter.video", "description": "Web-based motion graphics tool tailored for UI prototypes and rapid video content creation.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Freemium ($19/mo)"},
  {"id": "anime-js", "name": "Anime.js", "link": "https://animejs.com", "description": "Extremely powerful, highly lightweight JavaScript animation wrapper powering premium responsive web components.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Free (Open Source)"},
  {"id": "space-type-generator", "name": "Space Type Generator", "link": "https://spacetypegenerator.com", "description": "Kinetic typography designer offering deep manipulation vectors for interactive moving 3D font arrays.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Free"},
  {"id": "typeface-animator", "name": "Typeface Animator", "link": "https://typefaceanimator.com", "description": "Text transformation workspace outputting procedural kinetic title assets ready for editing layouts.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Free"},
  {"id": "react-bits", "name": "React Bits", "link": "https://reactbits.dev", "description": "Curated codebase housing premium, animated React UI design components built for fast deployment.", "category": "Design, Creative & Gaming", "subcategory": "Interactive Web & Motion Graphics", "pricing": "Free (Open Source)"},
  {"id": "coolors", "name": "Coolors", "link": "https://coolors.co", "description": "Superfast color palette generator providing harmonized tonal schemas across thousands of variants.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Freemium ($5/mo)"},
  {"id": "freepik", "name": "Freepik", "link": "https://www.freepik.com", "description": "Colossal creative marketplace providing high-resolution vectors, photos, PSD mocks, and templates.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Freemium ($9/mo)"},
  {"id": "sweezy-cursors", "name": "Sweezy Cursors", "link": "https://sweezy-cursors.com", "description": "Fun extensions delivering hundreds of highly creative, animated mouse pointers across custom themes.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Free"},
  {"id": "pngimg", "name": "PNGImg", "link": "https://pngimg.com", "description": "Curated catalog of thousands of alpha-masked, transparent-background PNG elements for design collages.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Free"},
  {"id": "pacdora", "name": "Pacdora", "link": "https://www.pacdora.com", "description": "Dynamic 3D packaging simulation lab wrapping graphical print wraps cleanly onto box structures.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Freemium"},
  {"id": "ui-ball", "name": "UI Ball", "link": "https://uiball.com", "description": "Library of elegant, lightweight loading indicators engineered natively using pure CSS and SVG formats.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Free (Open Source)"},
  {"id": "uiverse-io", "name": "Uiverse.io", "link": "https://uiverse.io", "description": "Community-led database containing beautiful, styled UI inputs, cards, buttons, and switches.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Free (Open Source)"},
  {"id": "font-squirrel", "name": "Font Squirrel", "link": "https://www.fontsquirrel.com", "description": "Hand-selected archive hosting commercial-free high-grade fonts complete with web format conversion modules.", "category": "Design, Creative & Gaming", "subcategory": "Creative Graphics & Asset Creation", "pricing": "Free"},
  {"id": "lostgamer", "name": "LostGamer", "link": "https://lostgamer.io", "description": "Geoguessr-style geographic location engine testing mapping tracking inside massive video game layouts.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "mapgenie", "name": "MapGenie", "link": "https://mapgenie.io", "description": "Interactive, crowd-sourced game worlds mapping locations of collectibles, achievements, and vaults.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Freemium ($10/yr)"},
  {"id": "slow-roads", "name": "Slow Roads", "link": "https://slowroads.io", "description": "Soothing procedural casual driving game rendered inside browser engines using beautiful dynamic scenery.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "azgaars-map-generator", "name": "Azgaar's Map Generator", "link": "https://azgaar.github.io", "description": "Deep world-building procedural fantasy map generator providing demographic and vector layout metrics.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free (Open Source)"},
  {"id": "chunkbase", "name": "Chunkbase", "link": "https://is.gd/chunkbase_mine", "description": "Minecraft structural diagnostic mapping platform displaying world generation mechanics directly via seed numbers.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "dungeon-scrawl", "name": "Dungeon Scrawl", "link": "https://dungeonscrawl.com", "description": "Vector-based map creator outputting clean tabletop blueprints perfect for classic dungeon layouts.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Freemium ($0.99/mo)"},
  {"id": "watabou-generators", "name": "Watabou Generators", "link": "https://watabou.github.io", "description": "Algorithmic generation engine modeling fantasy medieval cities, castles, and complex layouts.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "airconsole", "name": "AirConsole", "link": "https://www.airconsole.com", "description": "Turns web browsers into multiplayer game screens powered by using standard smartphones as controllers.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Freemium ($4.99/mo)"},
  {"id": "system-requirements-lab", "name": "System Requirements Lab", "link": "https://www.systemrequirementslab.com", "description": "Hardware telemetry assessment checking if a specific desktop configuration meets benchmark specs for games.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "retrogames-cc", "name": "RetroGames.cc", "link": "https://www.retrogames.cc", "description": "Huge browser-based emulator archive hosting classic arcade, console, and retro handheld games directly online.", "category": "Design, Creative & Gaming", "subcategory": "Gaming & Simulation Hubs", "pricing": "Free"},
  {"id": "tryrobin-ai", "name": "TryRobin AI", "link": "https://tryrobin.io", "description": "AI optimization module auditing corporate resumes to pass Applicant Tracking Systems effortlessly.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Freemium"},
  {"id": "jobcrawl", "name": "JobCrawl", "link": "https://jobcrawl.org", "description": "Aggregated employment crawling platform tracking corporate site careers boards prior to general listings.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Freemium ($3.99)"},
  {"id": "class-central", "name": "Class Central", "link": "https://www.classcentral.com", "description": "Aggregates thousands of open university course listings featuring granular reviews from previous students.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Free"},
  {"id": "mindluster", "name": "MindLuster", "link": "https://www.mindluster.com", "description": "Online educational library providing courses with downloadable completion credentials for career tracking.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Free"},
  {"id": "roadmap-sh", "name": "Roadmap.sh", "link": "https://roadmap.sh", "description": "Incredibly structured visual learning trees mapping exact milestones for tech roles.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Free"},
  {"id": "resume-io", "name": "Resume.io", "link": "https://resume.io", "description": "Advanced text template builder framing professional, structurally sound employment documents.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Freemium ($2.95)"},
  {"id": "leetcode", "name": "LeetCode", "link": "https://leetcode.com", "description": "Technical interview prep terminal featuring hundreds of algorithms across development stacks.", "category": "Education, Development & Career", "subcategory": "Professional & Career Development", "pricing": "Freemium ($35/mo)"},
  {"id": "replit", "name": "Replit", "link": "https://replit.com", "description": "Full cloud IDE framework built around cooperative live workspaces and fast AI generation.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium"},
  {"id": "n8n", "name": "N8N", "link": "https://n8n.io", "description": "Visual node-based automation framework linking complex web applications and data flows seamlessly.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium ($20/mo)"},
  {"id": "coddy-tech", "name": "Coddy Tech", "link": "https://coddy.tech", "description": "Micro-sized, task-driven coding environment giving continuous sandboxed testing feedback.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium"},
  {"id": "natively-dev", "name": "Natively Dev", "link": "https://natively.dev", "description": "Converts progressive web software and simple code structures directly into true mobile packages.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium ($49/mo)"},
  {"id": "gpt-excel", "name": "GPT Excel", "link": "https://gptexcel.uk", "description": "AI script engine translating text commands instantly into complex Excel functions or SQL blocks.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium ($6.30/mo)"},
  {"id": "text-to-cad-zoo", "name": "Text-To-CAD Zoo", "link": "https://text-to-cad.zoo.dev", "description": "AI geometric transformation system rendering production-ready 3D engineering models from descriptions.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Free"},
  {"id": "chef-convex", "name": "Chef Convex", "link": "https://chef.convex.dev", "description": "Instant application infrastructure provisioning that outputs production-ready backend code via prompts.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Freemium"},
  {"id": "json-editor-online", "name": "JSON Editor Online", "link": "https://jsoneditoronline.org", "description": "Web-based tool to parse, inspect, format, and edit complex nested JSON structures clearly.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Free"},
  {"id": "regex101", "name": "RegEx101", "link": "https://regex101.com", "description": "Regular expression workspace featuring interactive debugging, token explanation, and pattern validation.", "category": "Education, Development & Career", "subcategory": "Coding, AI Dev & Automation", "pricing": "Free"},
  {"id": "chemistry-nobook", "name": "Chemistry NoBook", "link": "https://chemistry-en.nobook.com/console/templates/resource", "description": "High-fidelity virtual chemistry simulation lab modeling advanced visual reactions safely.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Free"},
  {"id": "chemequations", "name": "ChemEquations", "link": "https://chemequations.com", "description": "Auto-balancing chemical equation script delivering element breakdowns and structural metrics.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Free"},
  {"id": "cymath", "name": "Cymath", "link": "https://www.cymath.com", "description": "Step-by-step mathematical problem solver explaining calculus, algebra, and equation steps visually.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Freemium ($4.99/mo)"},
  {"id": "litsolutions", "name": "LitSolutions", "link": "https://litsolutions.org", "description": "Crowdsourced database of verified textbook solutions and step-by-step calculations for STEM tracks.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Free"},
  {"id": "phet-simulations", "name": "PhET Simulations", "link": "https://phet.colorado.edu", "description": "Interactive physics, biological systems, and climate models hosted by the University of Colorado.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Free"},
  {"id": "biodigital-human", "name": "BioDigital Human", "link": "https://human.biodigital.com", "description": "Fully interactive 3D virtual human anatomy model designed for clinical research and healthcare training.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Free"},
  {"id": "wolfram-alpha", "name": "Wolfram Alpha", "link": "https://www.wolframalpha.com", "description": "Computational logic machine computing formula steps, algorithmic logic, and structural matrices.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Freemium ($4.75/mo)"},
  {"id": "symbolab", "name": "Symbolab", "link": "https://www.symbolab.com", "description": "Advanced scientific computational calculator plotting mathematical graphs and detailed calculus trees.", "category": "Education, Development & Career", "subcategory": "Math, Science & STEM Learning", "pricing": "Freemium ($6.99/mo)"},
  {"id": "google-katamari", "name": "Google Katamari", "link": "https://www.google.com/search?q=katamari", "description": "Launches an interactive rolling ball game directly inside Google search results pages via script.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "myretrotvs-90s", "name": "MyRetroTVs (90s)", "link": "https://www.myretrotvs.com", "description": "Simulates old CRT television physical dials streaming actual historical broadcast media.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "pointer-pointer", "name": "Pointer Pointer", "link": "https://pointerpointer.com", "description": "Quirky portal displaying photographs tracking the coordinates of the user's cursor position.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "click-the-red-button", "name": "Click The Red Button", "link": "https://clicktheredbutton.com", "description": "An interactive experimental journey that opens unexpected corners and obscure media on the web.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "fakeupdate-net", "name": "FakeUpdate.net", "link": "https://fakeupdate.net", "description": "Full-screen system progression animations ideal for harmless computer lab pranks or corporate breaks.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "the-wayback-machine", "name": "The Wayback Machine", "link": "https://archive.org/web", "description": "Massive archival system storing historical snapshots of millions of websites across decades.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "neal-fun", "name": "Neal.fun", "link": "https://neal.fun", "description": "A treasure trove of interactive interactive games and data visualizations detailing various unique mechanics.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "windows-93", "name": "Windows 93", "link": "https://www.windows93.net", "description": "An interactive, nostalgic parody OS operating completely within the web browser.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "the-scale-of-the-universe", "name": "The Scale of the Universe", "link": "https://htwins.net/scale2", "description": "An incredible zoomable interactive exploration detailing spatial bounds from subatomic fields to galaxies.", "category": "Hidden Gems & Discovery", "subcategory": "Easter Eggs & Hidden Features", "pricing": "Free"},
  {"id": "freesewing", "name": "FreeSewing", "link": "https://freesewing.org", "description": "Procedural vector clothing design generator outputting tailored layouts from direct biometric specs.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free (Open Source)"},
  {"id": "radio-garden", "name": "Radio Garden", "link": "https://radio.garden", "description": "Interactive geographical world globe linking directly into thousands of active local broadcast streams.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "music-map", "name": "Music-Map", "link": "https://www.music-map.com", "description": "Proximity mapping web engine clustering musical artists based on fan interest correlations.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "chefgpt", "name": "ChefGPT", "link": "https://www.chefgpt.xyz", "description": "AI cooking platform analyzing left-behind kitchen ingredients to propose tasty meal paths.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Freemium"},
  {"id": "supercook", "name": "Supercook", "link": "https://www.supercook.com", "description": "Dynamic recipe engine indexing millions of culinary preparations matching specific available stocks.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "the-toy-maker", "name": "The Toy Maker", "link": "https://thetoymaker.com", "description": "Printable folding design blueprints mapping out interactive mechanical toys for kids.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "musclewiki", "name": "MuscleWiki", "link": "https://musclewiki.com", "description": "Interactive anatomical chart instantly displaying professional exercise movements for specific muscles.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "gnoosic", "name": "Gnoosic", "link": "https://www.gnoosic.com", "description": "Intelligent music discovery engine that recommends bands based on individual user preference profiles.", "category": "Hidden Gems & Discovery", "subcategory": "Creative Hobbies & Obscure Tools", "pricing": "Free"},
  {"id": "auto-catalog-archive", "name": "Auto Catalog Archive", "link": "https://autocatalogarchive.com", "description": "Massive repository of scanned vintage vehicle brochures tracking detailed historical options.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "1a-auto", "name": "1A Auto", "link": "https://www.1aauto.com", "description": "Incredibly granular mechanic troubleshooting library tracking standard visual maintenance steps.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "carcarekiosk", "name": "CarCareKiosk", "link": "https://www.carcarekiosk.com", "description": "Make-and-model specific automotive repair videos showcasing common technical fixes clearly.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "ifixit", "name": "iFixit", "link": "https://www.ifixit.com", "description": "Enormous open hardware restoration directory detailing step-by-step tech dismantling documentation.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "before-i-play", "name": "Before I Play", "link": "https://beforeiplay.com", "description": "Community checklist tracking completely spoiler-free tactical considerations prior to starting games.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "trace-moe", "name": "Trace.moe", "link": "https://trace.moe", "description": "Reverse screenshot parser tracking precise frame locations, timelines, and episode origins across animated media.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "geoguessr", "name": "Geoguessr", "link": "https://www.geoguessr.com", "description": "The original geographic navigation quiz locating players globally inside StreetView images.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Freemium ($1.99/mo)"},
  {"id": "museum-of-endangered-sounds", "name": "Museum of Endangered Sounds", "link": "https://savethesounds.info", "description": "Audio museum safeguarding historical technical audio signatures like old dial-up modems and machinery.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free"},
  {"id": "internet-janitor", "name": "Internet Janitor", "link": "https://internet-janitor.itch.io", "description": "Unique toolsets dedicated to publishing text-based interactive games without engine setups.", "category": "Hidden Gems & Discovery", "subcategory": "Digital Archives & Curiosities", "pricing": "Free (Open Source)"}
];

// ============================================
// CATEGORY CONFIGURATION
// ============================================
const categories = [
  { id: 'all', name: 'All Tools', icon: Grid, color: '#6366f1' },
  { id: 'AI & Creative Tools', name: 'AI & Creative', icon: Sparkles, color: '#8b5cf6' },
  { id: 'Utility & Productivity', name: 'Utilities', icon: Zap, color: '#06b6d4' },
  { id: 'Design, Creative & Gaming', name: 'Design & Gaming', icon: Palette, color: '#ec4899' },
  { id: 'Education, Development & Career', name: 'Dev & Education', icon: GraduationCap, color: '#10b981' },
  { id: 'Hidden Gems & Discovery', name: 'Hidden Gems', icon: Compass, color: '#f59e0b' }
];

const filters = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'popular', label: 'Popular', icon: TrendingUp },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'free', label: 'Free', icon: Tag },
  { id: 'freemium', label: 'Freemium', icon: Star },
  { id: 'premium', label: 'Premium', icon: Box }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getCategoryColor = (category) => categories.find(c => c.id === category)?.color || '#6366f1';
const getCategoryIcon = (category) => categories.find(c => c.id === category)?.icon || Box;
const getPricingBadge = (pricing) => {
  if (pricing.toLowerCase().includes('free')) return { label: 'Free', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (pricing.toLowerCase().includes('freemium')) return { label: 'Freemium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
  if (pricing.toLowerCase().includes('premium')) return { label: 'Premium', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  return { label: 'Free', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
};
const getToolById = (id) => toolsData.find(t => t.id === id);

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem('toolvault_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('toolvault_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('toolvault_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };
  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('toolvault_users') || '[]');
    if (users.find(u => u.email === email)) return { success: false, error: 'Email already exists' };
    const newUser = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('toolvault_users', JSON.stringify(users));
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('toolvault_user', JSON.stringify(userWithoutPassword));
    return { success: true };
  };
  const logout = () => { setUser(null); localStorage.removeItem('toolvault_user'); };
  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

// ============================================
// SAVED TOOLS CONTEXT
// ============================================
const SavedContext = createContext(null);
const SavedProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedTools, setSavedTools] = useState([]);
  const [collections, setCollections] = useState([]);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (user) {
      const storedSaved = localStorage.getItem(`toolvault_saved_${user.id}`);
      const storedCollections = localStorage.getItem(`toolvault_collections_${user.id}`);
      const storedHistory = localStorage.getItem(`toolvault_history_${user.id}`);
      if (storedSaved) setSavedTools(JSON.parse(storedSaved));
      if (storedCollections) setCollections(JSON.parse(storedCollections));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } else { setSavedTools([]); setCollections([]); setHistory([]); }
  }, [user]);
  const saveTool = (toolId) => {
    if (!user) return;
    const newSaved = [...savedTools, { toolId, savedAt: new Date().toISOString() }];
    setSavedTools(newSaved);
    localStorage.setItem(`toolvault_saved_${user.id}`, JSON.stringify(newSaved));
  };
  const unsaveTool = (toolId) => {
    if (!user) return;
    const newSaved = savedTools.filter(s => s.toolId !== toolId);
    setSavedTools(newSaved);
    localStorage.setItem(`toolvault_saved_${user.id}`, JSON.stringify(newSaved));
  };
  const isSaved = (toolId) => savedTools.some(s => s.toolId === toolId);
  const addToHistory = (toolId) => {
    if (!user) return;
    const newHistory = [{ toolId, visitedAt: new Date().toISOString() }, ...history.filter(h => h.toolId !== toolId)].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem(`toolvault_history_${user.id}`, JSON.stringify(newHistory));
  };
  const createCollection = (name, description = '') => {
    if (!user) return;
    const newCollection = { id: Date.now().toString(), name, description, toolIds: [], createdAt: new Date().toISOString() };
    const newCollections = [...collections, newCollection];
    setCollections(newCollections);
    localStorage.setItem(`toolvault_collections_${user.id}`, JSON.stringify(newCollections));
    return newCollection.id;
  };
  const deleteCollection = (collectionId) => {
    if (!user) return;
    const newCollections = collections.filter(c => c.id !== collectionId);
    setCollections(newCollections);
    localStorage.setItem(`toolvault_collections_${user.id}`, JSON.stringify(newCollections));
  };
  const addToCollection = (collectionId, toolId) => {
    if (!user) return;
    const newCollections = collections.map(c => c.id === collectionId ? { ...c, toolIds: [...c.toolIds, toolId] } : c);
    setCollections(newCollections);
    localStorage.setItem(`toolvault_collections_${user.id}`, JSON.stringify(newCollections));
  };
  return <SavedContext.Provider value={{ savedTools, collections, history, saveTool, unsaveTool, isSaved, addToHistory, createCollection, deleteCollection, addToCollection }}>{children}</SavedContext.Provider>;
};
const useSaved = () => useContext(SavedContext);

// ============================================
// ANIMATED BACKGROUND
// ============================================
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#0a0a0f]" />
    <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }} />
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
  </div>
);

// ============================================
// FLOATING PARTICLES
// ============================================
const FloatingParticles = () => {
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, duration: Math.random() * 20 + 10, delay: Math.random() * 5, opacity: Math.random() * 0.3 + 0.1 })), []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-white" style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }} animate={{ y: [0, -100, 0], x: [0, Math.random() * 50 - 25, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }} transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
};

// ============================================
// AUTH MODAL
// ============================================
const AuthModal = ({ onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = mode === 'login' ? login(email, password) : signup(name, email, password);
    if (result.success) onClose();
    else setError(result.error);
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 10 }} animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, scale: 0.8, y: 40, rotateX: 10 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10" style={{ perspective: '1000px' }}>
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-sm text-white/40">{mode === 'login' ? 'Sign in to access your saved tools' : 'Join Tool Vault to save your favorites'}</p>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"><X className="w-5 h-5" /></motion.button>
          </div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-sm text-white/50 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RefreshCw className="w-5 h-5" /></motion.div> : <>{mode === 'login' ? <LogIn className="w-5 h-5" /> : <User className="w-5 h-5" />}{mode === 'login' ? 'Sign In' : 'Create Account'}</>}
            </motion.button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">{mode === 'login' ? "Don't have an account? " : "Already have an account? "}<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">{mode === 'login' ? 'Sign up' : 'Sign in'}</motion.button></p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// NAVBAR
// ============================================
const Navbar = ({ searchQuery, setSearchQuery, activeCategory, setActiveCategory, scrolled, activeView, setActiveView }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const { savedTools } = useSaved();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedTools.length },
    { id: 'history', label: 'History', icon: History },
    { id: 'collections', label: 'Collections', icon: Folders },
  ];

  return (
    <>
      <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveView('home')}>
              <motion.div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center" whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                <Box className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">Tool Vault</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button key={item.id} onClick={() => setActiveView(item.id)} className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeView === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <div className="flex items-center gap-1.5">
                    <item.icon className="w-4 h-4" /><span>{item.label}</span>
                    {item.badge > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold">{item.badge}</motion.span>}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <motion.div className="relative w-full transition-all duration-300" animate={{ scale: isSearchFocused ? 1.02 : 1 }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input type="text" placeholder="Search 128+ tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-300" />
                {searchQuery && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-white/40 hover:text-white/60" /></motion.button>}
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <span className="text-sm text-white/70 hidden sm:block">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-56 bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        <div className="p-4 border-b border-white/5"><p className="text-sm font-semibold text-white">{user.name}</p><p className="text-xs text-white/40">{user.email}</p></div>
                        <div className="p-2">
                          <button onClick={() => { setActiveView('saved'); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"><Bookmark className="w-4 h-4" />Saved Tools ({savedTools.length})</button>
                          <button onClick={() => { setActiveView('collections'); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"><Folders className="w-4 h-4" />Collections</button>
                          <button onClick={() => { setActiveView('history'); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"><History className="w-4 h-4" />History</button>
                          <div className="border-t border-white/5 my-1" />
                          <button onClick={() => { logout(); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"><LogOut className="w-4 h-4" />Sign Out</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAuth(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"><LogIn className="w-4 h-4" /><span className="hidden sm:inline">Sign In</span></motion.button>
              )}
              <motion.button className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{ scale: 0.9 }}><Menu className="w-5 h-5" /></motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
              <div className="px-4 py-4 space-y-2">
                <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" /></div>
                {navItems.map((item) => <button key={item.id} onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${activeView === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}><item.icon className="w-4 h-4" />{item.label}{item.badge > 0 && <span className="ml-auto px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold">{item.badge}</span>}</button>)}
                {categories.map((cat) => <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}><cat.icon className="w-4 h-4" />{cat.name}</button>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} />}</AnimatePresence>
    </>
  );
};

// ============================================
// DASHBOARD HERO WITH SIDE RAYS
// ============================================
const DashboardHero = () => (
  <section className="relative h-[500px] overflow-hidden rounded-3xl mx-4 mb-8 border border-white/10">
    <SideRays speed={1.5} rayColor1="#6366f1" rayColor2="#8b5cf6" intensity={2} spread={2} origin="top-right" tilt={-15} saturation={1.5} blend={0.75} falloff={1.6} opacity={0.8} />
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="text-center">
        <RotatingTextContainer text={['Discover', 'Explore', 'Create', 'Build']} interval={2500} className="text-5xl md:text-7xl font-bold mb-4 justify-center">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </RotatingTextContainer>
        <p className="text-white/40 text-lg max-w-md mx-auto">128 curated tools for designers, developers, and creators</p>
      </div>
    </div>
  </section>
);

// ============================================
// FEATURED TOOLS WITH CARD SWAP
// ============================================
const FeaturedCardSwap = ({ onSelectTool }) => {
  const featured = toolsData.slice(0, 5);
  return (
    <section className="px-4 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-semibold text-white/80">Featured Tools</h2>
        </div>
        <div className="relative h-[500px] flex items-center justify-center">
          <CardSwap cardDistance={80} verticalDistance={60} delay={4000} pauseOnHover skewAmount={4} easing="elastic" onCardClick={(idx) => onSelectTool(featured[idx])}>
            {featured.map((tool) => (
              <Card key={tool.id} customClass="bg-[#0f0f14] border border-white/10">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getCategoryColor(tool.category)}20` }}>
                      {React.createElement(getCategoryIcon(tool.category), { className: "w-5 h-5", style: { color: getCategoryColor(tool.category) } })}
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{getPricingBadge(tool.pricing).label}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-white/40 flex-1">{tool.description}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <AnimateIcon animateOnHover><AnimatedExternalLink animateOnHover className="w-5 h-5 text-white/60" /></AnimateIcon>
                    <span className="text-xs text-white/30">{tool.subcategory}</span>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TOOL GRID WITH BORDER GLOW CARDS
// ============================================
const ToolGrid = ({ tools, onSelectTool }) => {
  const { user } = useAuth();
  const { isSaved, saveTool, unsaveTool } = useSaved();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <motion.div key={tool.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.03 }}>
          <BorderGlow edgeSensitivity={25} glowColor="260 80 70" backgroundColor="#0f0f14" borderRadius={20} glowRadius={35} glowIntensity={1.2} coneSpread={20} animated={index < 6} colors={['#6366f1', '#8b5cf6', '#ec4899']}>
            <div className="p-5 cursor-pointer" onClick={() => onSelectTool(tool)}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getCategoryColor(tool.category)}15` }}>
                  {React.createElement(getCategoryIcon(tool.category), { className: "w-5 h-5", style: { color: getCategoryColor(tool.category) } })}
                </div>
                <div className="flex items-center gap-2">
                  {user && (
                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); isSaved(tool.id) ? unsaveTool(tool.id) : saveTool(tool.id); }} className="p-1.5 rounded-lg transition-all" title={isSaved(tool.id) ? "Remove from saved" : "Save tool"}>
                      {isSaved(tool.id) ? <BookmarkCheck className="w-4 h-4 text-indigo-400" /> : <Bookmark className="w-4 h-4 text-white/30 hover:text-white/60" />}
                    </motion.button>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPricingBadge(tool.pricing).color}`}>{getPricingBadge(tool.pricing).label}</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{tool.name}</h3>
              <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-3">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">{tool.subcategory}</span>
                <div className="flex items-center gap-2">
                  <AnimateIcon animateOnHover><AnimatedExternalLink animateOnHover className="w-4 h-4 text-white/30" /></AnimateIcon>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// FILTER CHIPS
// ============================================
const FilterChips = ({ activeFilter, setActiveFilter }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    {filters.map((filter) => (
      <motion.button key={filter.id} onClick={() => setActiveFilter(filter.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeFilter === filter.id ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white/60 hover:border-white/10'}`}>
        <filter.icon className="w-3.5 h-3.5" /><span>{filter.label}</span>
      </motion.button>
    ))}
  </div>
);

// ============================================
// STATS BAR
// ============================================
const StatsBar = ({ totalTools, filteredCount, activeCategory }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-2">
      <span className="text-sm text-white/40">Showing <span className="text-white/60 font-medium">{filteredCount}</span> of <span className="text-white/60 font-medium">{totalTools}</span> tools</span>
    </div>
    {activeCategory !== 'all' && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5">{categories.find(c => c.id === activeCategory)?.name}</motion.span>}
  </motion.div>
);

// ============================================
// SAVED TOOLS PAGE
// ============================================
const SavedToolsPage = ({ onSelectTool }) => {
  const { savedTools } = useSaved();
  const { user } = useAuth();
  if (!user) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center px-4">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"><Bookmark className="w-10 h-10 text-white/20" /></motion.div>
      <h3 className="text-2xl font-semibold text-white/60 mb-2">Sign in to save tools</h3>
      <p className="text-white/30 max-w-md">Create an account to save your favorite tools and access them from anywhere.</p>
    </motion.div>
  );
  const savedToolData = savedTools.map(s => getToolById(s.toolId)).filter(Boolean);
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><Bookmark className="w-5 h-5 text-indigo-400" /></div>
          <div><h2 className="text-2xl font-bold text-white">Saved Tools</h2><p className="text-sm text-white/40">{savedToolData.length} tools bookmarked</p></div>
        </motion.div>
        {savedToolData.length > 0 ? <ToolGrid tools={savedToolData} onSelectTool={onSelectTool} /> : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6"><Bookmark className="w-8 h-8 text-white/20" /></div>
            <h3 className="text-xl font-semibold text-white/60 mb-2">No saved tools yet</h3>
            <p className="text-white/30 max-w-md">Browse the tools and click the bookmark icon to save your favorites here.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================
// HISTORY PAGE
// ============================================
const HistoryPage = ({ onSelectTool }) => {
  const { history } = useSaved();
  const { user } = useAuth();
  if (!user) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center px-4">
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"><History className="w-10 h-10 text-white/20" /></motion.div>
      <h3 className="text-2xl font-semibold text-white/60 mb-2">Sign in to see history</h3>
      <p className="text-white/30 max-w-md">Your browsing history will be tracked once you sign in.</p>
    </motion.div>
  );
  const historyToolData = history.map(h => ({ ...getToolById(h.toolId), visitedAt: h.visitedAt })).filter(Boolean);
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><History className="w-5 h-5 text-amber-400" /></div>
          <div><h2 className="text-2xl font-bold text-white">Browsing History</h2><p className="text-sm text-white/40">{historyToolData.length} tools visited</p></div>
        </motion.div>
        {historyToolData.length > 0 ? (
          <div className="space-y-3">
            {historyToolData.map((tool, index) => (
              <motion.div key={`${tool.id}-${index}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => onSelectTool(tool)} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 cursor-pointer transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getCategoryColor(tool.category)}15` }}>{React.createElement(getCategoryIcon(tool.category), { className: "w-5 h-5", style: { color: getCategoryColor(tool.category) } })}</div>
                <div className="flex-1 min-w-0"><h4 className="text-sm font-semibold text-white group-hover:text-white/90">{tool.name}</h4><p className="text-xs text-white/40 truncate">{tool.description}</p></div>
                <div className="text-xs text-white/30 flex-shrink-0">{new Date(tool.visitedAt).toLocaleDateString()}</div>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6"><History className="w-8 h-8 text-white/20" /></div>
            <h3 className="text-xl font-semibold text-white/60 mb-2">No history yet</h3>
            <p className="text-white/30 max-w-md">Start exploring tools and your browsing history will appear here.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COLLECTIONS PAGE
// ============================================
const CollectionsPage = ({ onSelectTool }) => {
  const { collections, createCollection, deleteCollection } = useSaved();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  if (!user) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center px-4">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"><Folders className="w-10 h-10 text-white/20" /></motion.div>
      <h3 className="text-2xl font-semibold text-white/60 mb-2">Sign in to create collections</h3>
      <p className="text-white/30 max-w-md">Organize your tools into custom collections for easy access.</p>
    </motion.div>
  );
  const handleCreate = () => { if (newName.trim()) { createCollection(newName.trim(), newDesc.trim()); setNewName(''); setNewDesc(''); setShowCreate(false); } };
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><Folders className="w-5 h-5 text-purple-400" /></div>
            <div><h2 className="text-2xl font-bold text-white">Collections</h2><p className="text-sm text-white/40">{collections.length} collections</p></div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/20 transition-all"><Plus className="w-4 h-4" />New Collection</motion.button>
        </motion.div>
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Collection</h3>
              <div className="space-y-4">
                <div><label className="block text-sm text-white/50 mb-1.5">Name</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Design Tools" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50" /></div>
                <div><label className="block text-sm text-white/50 mb-1.5">Description (optional)</label><input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50" /></div>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreate} className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors">Create</motion.button>
                  <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection, index) => {
              const collectionTools = collection.toolIds.map(id => getToolById(id)).filter(Boolean);
              return (
                <motion.div key={collection.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center"><Folder className="w-5 h-5 text-purple-400" /></div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteCollection(collection.id)} className="p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></motion.button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{collection.name}</h3>
                  {collection.description && <p className="text-sm text-white/40 mb-3">{collection.description}</p>}
                  <p className="text-xs text-white/30 mb-4">{collectionTools.length} tools</p>
                  {collectionTools.length > 0 && (
                    <div className="flex -space-x-2 mb-4">
                      {collectionTools.slice(0, 5).map((tool) => (
                        <div key={tool.id} className="w-8 h-8 rounded-full border-2 border-[#0f0f14] flex items-center justify-center" style={{ backgroundColor: `${getCategoryColor(tool.category)}30` }}>{React.createElement(getCategoryIcon(tool.category), { className: "w-4 h-4", style: { color: getCategoryColor(tool.category) } })}</div>
                      ))}
                      {collectionTools.length > 5 && <div className="w-8 h-8 rounded-full border-2 border-[#0f0f14] bg-white/10 flex items-center justify-center text-xs text-white/60">+{collectionTools.length - 5}</div>}
                    </div>
                  )}
                  <div className="space-y-2">
                    {collectionTools.slice(0, 3).map((tool) => (
                      <div key={tool.id} onClick={() => onSelectTool(tool)} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all">{React.createElement(getCategoryIcon(tool.category), { className: "w-3.5 h-3.5", style: { color: getCategoryColor(tool.category) } })}<span className="text-sm text-white/70 truncate">{tool.name}</span></div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6"><Folders className="w-8 h-8 text-white/20" /></div>
            <h3 className="text-xl font-semibold text-white/60 mb-2">No collections yet</h3>
            <p className="text-white/30 max-w-md">Create collections to organize your favorite tools into groups.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};


// ============================================
// TOOL DETAIL MODAL
// ============================================
const ToolDetailModal = ({ tool, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const { user } = useAuth();
  const { isSaved, saveTool, unsaveTool, addToHistory, collections, addToCollection } = useSaved();

  if (!tool) return null;

  const categoryColor = getCategoryColor(tool.category);
  const pricingBadge = getPricingBadge(tool.pricing);
  const CategoryIcon = getCategoryIcon(tool.category);
  const saved = isSaved(tool.id);

  useEffect(() => { if (user) addToHistory(tool.id); }, [tool.id, user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tool.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!user) return;
    saved ? unsaveTool(tool.id) : saveTool(tool.id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 15 }} animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, scale: 0.8, y: 40, rotateX: 15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50" style={{ perspective: '1000px' }}>
        <div className="h-40 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${categoryColor}30, transparent)` }}>
          <div className="absolute inset-0 opacity-30">
            <motion.div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px]" style={{ backgroundColor: categoryColor }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
          </div>
          <div className="relative flex items-center justify-between p-6">
            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"><X className="w-5 h-5" /></motion.button>
            <div className="flex items-center gap-2">
              {user && <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave} className={`p-2 rounded-full transition-all ${saved ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'}`}>{saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}</motion.button>}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} className="p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all">{copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}</motion.button>
            </div>
          </div>
          <div className="relative px-6 -mt-4">
            <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${categoryColor}20`, border: `1px solid ${categoryColor}30` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <CategoryIcon className="w-10 h-10" style={{ color: categoryColor }} />
            </motion.div>
          </div>
        </div>
        <div className="p-6 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${pricingBadge.color}`}>{pricingBadge.label}</span>
          </div>
          <p className="text-white/50 leading-relaxed mb-6">{tool.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['Category', 'Subcategory', 'Pricing', 'Link'].map((label, i) => (
              <motion.div key={label} className="p-4 rounded-xl bg-white/5 border border-white/5" whileHover={{ scale: 1.02, borderColor: `${categoryColor}30` }}>
                <span className="text-xs text-white/30 uppercase tracking-wider">{label}</span>
                <p className="text-sm text-white/80 mt-1 truncate">{i === 0 ? tool.category : i === 1 ? tool.subcategory : i === 2 ? tool.pricing : tool.link}</p>
              </motion.div>
            ))}
          </div>
          {user && collections.length > 0 && (
            <div className="mb-6">
              <button onClick={() => setShowCollections(!showCollections)} className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-3">
                <Folders className="w-4 h-4" />Add to Collection
                <ChevronDown className={`w-3 h-3 transition-transform ${showCollections ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showCollections && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2">
                    {collections.map((c) => <motion.button key={c.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCollection(c.id, tool.id)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"><Folder className="w-3 h-3 inline mr-1" />{c.name}</motion.button>)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <motion.a href={tool.link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all" style={{ backgroundColor: categoryColor }}>
            <ExternalLink className="w-5 h-5" /><span>Visit Tool</span>
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowUpRight className="w-5 h-5" /></motion.div>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => (
  <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <motion.div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Box className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-lg font-bold text-white/80">Tool Vault</span>
        </div>
        <p className="text-sm text-white/30">Curated collection of 128+ digital tools and utilities</p>
        <div className="flex items-center gap-4"><span className="text-xs text-white/20">Built with React + Tailwind + Framer Motion</span></div>
      </div>
    </div>
  </footer>
);

// ============================================
// PAGE TRANSITION
// ============================================
const PageTransition = ({ children, key }) => (
  <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

// ============================================
// MAIN APP
// ============================================
export default function ToolVault() {
  return (
    <AuthProvider>
      <SavedProvider>
        <ToolVaultApp />
      </SavedProvider>
    </AuthProvider>
  );
}

function ToolVaultApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { addToHistory } = useSaved();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.querySelector('input[type="text"]')?.focus(); }
      if (e.key === 'Escape') setSelectedTool(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    let filtered = toolsData;
    if (activeCategory !== 'all') filtered = filtered.filter(t => t.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.subcategory.toLowerCase().includes(q));
    }
    if (activeFilter !== 'all') {
      if (activeFilter === 'free') filtered = filtered.filter(t => t.pricing.toLowerCase().includes('free'));
      else if (activeFilter === 'freemium') filtered = filtered.filter(t => t.pricing.toLowerCase().includes('freemium'));
      else if (activeFilter === 'premium') filtered = filtered.filter(t => t.pricing.toLowerCase().includes('premium'));
    }
    return filtered;
  }, [searchQuery, activeCategory, activeFilter]);

  const handleSelectTool = (tool) => { setSelectedTool(tool); if (user) addToHistory(tool.id); };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      <LoadingScreen onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <>
          <AnimatedBackground />
          <FloatingParticles />
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory} scrolled={scrolled} activeView={activeView} setActiveView={setActiveView} />
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              {activeView === 'home' && (
                <PageTransition key="home">
                  <div className="pt-24">
                    <DashboardHero />
                    <FeaturedCardSwap onSelectTool={handleSelectTool} />
                    <section className="px-4 sm:px-6 lg:px-8 pb-16">
                      <div className="max-w-7xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-semibold text-white/80">{searchQuery ? 'Search Results' : 'All Tools'}</h2>
                          </div>
                        </motion.div>
                        <FilterChips activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                        <StatsBar totalTools={toolsData.length} filteredCount={filteredTools.length} activeCategory={activeCategory} />
                        <AnimatePresence mode="wait">
                          {filteredTools.length > 0 ? <ToolGrid tools={filteredTools} onSelectTool={handleSelectTool} /> : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
                              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6"><Search className="w-8 h-8 text-white/20" /></div>
                              <h3 className="text-xl font-semibold text-white/60 mb-2">No tools found</h3>
                              <p className="text-white/30 max-w-md">We could not find any tools matching "{searchQuery}". Try a different search term.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </section>
                  </div>
                </PageTransition>
              )}
              {activeView === 'saved' && <PageTransition key="saved"><SavedToolsPage onSelectTool={handleSelectTool} /></PageTransition>}
              {activeView === 'history' && <PageTransition key="history"><HistoryPage onSelectTool={handleSelectTool} /></PageTransition>}
              {activeView === 'collections' && <PageTransition key="collections"><CollectionsPage onSelectTool={handleSelectTool} /></PageTransition>}
            </AnimatePresence>
          </main>
          <Footer />
          <AnimatePresence>{selectedTool && <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}</AnimatePresence>
        </>
      )}
    </div>
  );
}
