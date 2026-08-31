import kleoChatbotLogo from '../assets/kleo_chatbot_logo.png';

export interface AvatarPreset {
  id: string;
  name: string;
  category: string;
  url: string;
}

export interface BannerPreset {
  id: string;
  name: string;
  category: string;
  gradient: string;
  patternType?: 'polyGrid' | 'dots' | 'waves' | 'circuit' | 'sakura';
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'default-student',
    name: 'CLASE Student',
    category: 'Illustrated',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%2338BDF8'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%2310B981'/><rect x='44' y='52' width='12' height='18' fill='%238D5B4C'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%238D5B4C'/><path d='M 44 54 Q 50 60 56 54' stroke='%23FFFFFF' stroke-width='2.5' stroke-linecap='round' fill='none'/><path d='M 33 42 C 33 28 42 22 50 22 C 58 22 67 28 67 42 C 67 33 60 28 50 28 C 40 28 33 33 33 42 Z' fill='%231F2937'/></svg>"
  },
  {
    id: 'kleo-mascot',
    name: 'Kleo Siamese Cat',
    category: 'Mascot',
    url: kleoChatbotLogo
  },
  {
    id: 'polyglot-scholar',
    name: 'Polyglot Scholar',
    category: 'Academic',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%2310B981'/><path d='M 20 92 C 20 74 35 66 50 66 C 65 66 80 74 80 92 Z' fill='%23064E3B'/><rect x='44' y='50' width='12' height='18' fill='%23C68642'/><ellipse cx='50' cy='44' rx='16' ry='18' fill='%23C68642'/><circle cx='43' cy='43' r='4' stroke='%23F59E0B' stroke-width='1.5' fill='none'/><circle cx='57' cy='43' r='4' stroke='%23F59E0B' stroke-width='1.5' fill='none'/><line x1='47' y1='43' x2='53' y2='43' stroke='%23F59E0B' stroke-width='1.5'/><path d='M 45 52 Q 50 56 55 52' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' fill='none'/><path d='M 32 38 C 32 24 42 18 50 18 C 58 18 68 24 68 38 C 68 30 60 25 50 25 C 40 25 32 30 32 38 Z' fill='%23451A03'/></svg>"
  },
  {
    id: 'anime-tokyo',
    name: 'Tokyo Dreamer',
    category: 'Anime',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23EC4899'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%23831843'/><rect x='44' y='52' width='12' height='18' fill='%23FBD5BD'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23FBD5BD'/><circle cx='43' cy='44' r='2.5' fill='%23831843'/><circle cx='57' cy='44' r='2.5' fill='%23831843'/><path d='M 45 53 Q 50 57 55 53' stroke='%23E11D48' stroke-width='2' stroke-linecap='round' fill='none'/><path d='M 30 40 C 30 20 40 16 50 16 C 60 16 70 20 70 40 C 74 55 72 70 72 70 C 66 58 66 45 66 40 C 60 30 40 30 34 40 C 34 45 34 58 28 70 C 28 70 26 55 30 40 Z' fill='%23F472B6'/></svg>"
  },
  {
    id: 'cyberpunk-dev',
    name: 'Cyberpunk Polyglot',
    category: 'Cyber',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%230F172A'/><path d='M 20 92 C 20 72 34 65 50 65 C 66 65 80 72 80 92 Z' fill='%231E293B'/><rect x='44' y='52' width='12' height='18' fill='%23D1D5DB'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23E5E7EB'/><rect x='36' y='40' width='28' height='8' rx='2' fill='%2306B6D4' stroke='%2322D3EE' stroke-width='1.5'/><circle cx='43' cy='44' r='2' fill='%23FFFFFF'/><circle cx='57' cy='44' r='2' fill='%23FFFFFF'/><path d='M 45 54 H 55' stroke='%2306B6D4' stroke-width='2'/><path d='M 32 36 L 40 18 L 50 26 L 60 18 L 68 36 Z' fill='%23F43F5E'/></svg>"
  },
  {
    id: 'seoul-sunset',
    name: 'Seoul Sunset Creator',
    category: 'Illustrated',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23F97316'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%237C2D12'/><rect x='44' y='52' width='12' height='18' fill='%23E0A96D'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23E0A96D'/><path d='M 44 54 Q 50 59 56 54' stroke='%23FFFFFF' stroke-width='2' fill='none'/><path d='M 32 40 C 32 25 40 20 50 20 C 60 20 68 25 68 40 C 68 32 60 27 50 27 C 40 27 32 32 32 40 Z' fill='%2318181B'/></svg>"
  },
  {
    id: 'lofi-cafe',
    name: 'Lofi Study Companion',
    category: 'Anime',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%238B5CF6'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%234C1D95'/><rect x='44' y='52' width='12' height='18' fill='%23FDE68A'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23FDE68A'/><circle cx='34' cy='44' r='5' fill='%23DDD6FE' stroke='%23A78BFA' stroke-width='1.5'/><circle cx='66' cy='44' r='5' fill='%23DDD6FE' stroke='%23A78BFA' stroke-width='1.5'/><path d='M 34 40 C 34 26 66 26 66 40' stroke='%23DDD6FE' stroke-width='2.5' fill='none'/></svg>"
  },
  {
    id: 'cosmic-star',
    name: 'Cosmic Polyglot',
    category: 'Cosmic',
    url: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23312E81'/><path d='M 20 92 C 20 72 34 65 50 65 C 66 65 80 72 80 92 Z' fill='%231E1B4B'/><circle cx='50' cy='45' r='18' fill='%236366F1'/><path d='M 50 32 L 53 41 L 62 44 L 54 49 L 56 58 L 50 53 L 44 58 L 46 49 L 38 44 L 47 41 Z' fill='%23FDE047'/></svg>"
  }
];

export const BANNER_PRESETS: BannerPreset[] = [
  {
    id: 'clase-cyan',
    name: 'CLASE Cyan Matrix (Default)',
    category: 'Signature',
    gradient: 'linear-gradient(135deg, #1b6875 0%, #2ea2b0 35%, #1e7887 70%, #155561 100%)',
    patternType: 'polyGrid'
  },
  {
    id: 'tokyo-cyberpunk',
    name: 'Tokyo Neon Cyberpunk',
    category: 'Cyberpunk',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 35%, #831843 70%, #0f172a 100%)',
    patternType: 'circuit'
  },
  {
    id: 'seoul-sunset',
    name: 'Seoul Sunset Glow',
    category: 'Signature',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 35%, #f59e0b 70%, #7c2d12 100%)',
    patternType: 'waves'
  },
  {
    id: 'emerald-academic',
    name: 'Emerald Academic Matrix',
    category: 'Nature',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 35%, #10b981 70%, #022c22 100%)',
    patternType: 'polyGrid'
  },
  {
    id: 'deep-cosmic',
    name: 'Deep Cosmic Nebula',
    category: 'Cosmic',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 35%, #6b21a8 70%, #020617 100%)',
    patternType: 'dots'
  },
  {
    id: 'sakura-pink',
    name: 'Kyoto Sakura Blossom',
    category: 'Nature',
    gradient: 'linear-gradient(135deg, #831843 0%, #db2777 40%, #f472b6 75%, #500724 100%)',
    patternType: 'sakura'
  },
  {
    id: 'matte-obsidian',
    name: 'Matte Obsidian Carbon',
    category: 'Minimal',
    gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
    patternType: 'dots'
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon Glow',
    category: 'Signature',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #701a75 40%, #ea580c 80%, #f97316 100%)',
    patternType: 'waves'
  }
];
