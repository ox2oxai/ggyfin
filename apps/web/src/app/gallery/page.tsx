'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Video,
  Image as ImageIcon,
  Users2,
  X,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Milk,
  Store,
  Shirt,
  Sprout,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PublicHeader } from '../../components/public-header';
import { PublicFooter } from '../../components/public-footer';
import { useLanguage } from '../../components/language-context';
import { GGYBrandMark } from '../../components/brand-mark';

interface StoryItem {
  id: string;
  type: 'video' | 'photo' | 'shg';
  nameEn: string;
  nameKn: string;
  villageEn: string;
  villageKn: string;
  district: string;
  schemeEn: string;
  schemeKn: string;
  amount: string;
  metricEn: string;
  metricKn: string;
  duration?: string;
  quoteEn: string;
  quoteKn: string;
  transcriptEn: string;
  transcriptKn: string;
  categoryEn: string;
  categoryKn: string;
  tagEn: string;
  tagKn: string;
  thumbnailBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

const GALLERY_STORIES: StoryItem[] = [
  {
    id: 'vid-lakshmi',
    type: 'video',
    nameEn: 'Smt. Lakshmi Gowda',
    nameKn: 'ಶ್ರೀಮತಿ ಲಕ್ಷ್ಮಿ ಗೌಡ',
    villageEn: 'Channapatna Taluk',
    villageKn: 'ಚನ್ನಪಟ್ಟಣ ತಾಲೂಕು',
    district: 'Ramanagara',
    schemeEn: 'Dairy Development Term Loan',
    schemeKn: 'ಹೈನುಗಾರಿಕೆ ಅಭಿವೃದ್ಧಿ ಸಾಲ',
    amount: '₹1,20,000',
    metricEn: 'Daily milk yield rose from 15L to 35L',
    metricKn: 'ದೈನಂದಿನ ಹಾಲಿನ ಇಳುವರಿ ೧೫ ಲೀ ನಿಂದ ೩೫ ಲೀಟರ್‌ಗೆ ಏರಿಕೆ',
    duration: '2:45 min',
    quoteEn: '“With GGY’s doorstep UPI collection, I bought two HF crossbred cows without paying any broker commission. My family now earns ₹38,000 net profit every month.”',
    quoteKn: '“ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಸಾಲ ಪಡೆದು ೨ ಸಂಕರ ತಳಿಯ ಹಸುಗಳನ್ನು ಖರೀದಿಸಿದೆ. ಈಗ ಪ್ರತಿ ತಿಂಗಳು ನಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ₹೩೮,೦೦೦ ನಿವ್ವಳ ಆದಾಯ ಸಿಗುತ್ತಿದೆ.”',
    transcriptEn: 'Lakshmi explains how she applied for the dairy loan through the GGY Field Officer in Channapatna. Approval took 15 minutes with masked Aadhaar, and repayment is deducted via weekly UPI directly from her milk cooperative payout.',
    transcriptKn: 'ಲಕ್ಷ್ಮಿಯವರು ಚನ್ನಪಟ್ಟಣದಲ್ಲಿ ಜಿಜಿವೈ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಯ ಮೂಲಕ ಸಾಲ ಪಡೆದ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತಾರೆ. ಆಧಾರ್ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ೧೫ ನಿಮಿಷಗಳಲ್ಲಿ ಅನುಮೋದನೆ ದೊರೆತಿದ್ದು, ಡೇರಿ ಹಾಲಿನ ಹಣದಿಂದಲೇ ಯುಪಿಐ ಮೂಲಕ ವಾರದ ಕಂತು ಪಾವತಿಸುತ್ತಿದ್ದಾರೆ.',
    categoryEn: 'Dairy & Livestock',
    categoryKn: 'ಹೈನುಗಾರಿಕೆ & ಪಶುಸಂಗೋಪನೆ',
    tagEn: 'Dairy Transformation',
    tagKn: 'ಹೈನುಗಾರಿಕೆ ಯಶೋಗಾಥೆ',
    thumbnailBg: 'from-emerald-950 via-forest-900 to-slate-950',
    icon: Milk
  },
  {
    id: 'vid-basavaraj',
    type: 'video',
    nameEn: 'Sri Basavaraj Patil',
    nameKn: 'ಶ್ರೀ ಬಸವರಾಜ್ ಪಾಟೀಲ್',
    villageEn: 'Kunigal Town',
    villageKn: 'ಕುಣಿಗಲ್ ಪಟ್ಟಣ',
    district: 'Tumakuru',
    schemeEn: 'Kirana & Village Retail Capital',
    schemeKn: 'ಕಿರಾಣಿ & ಸಣ್ಣ ವ್ಯಾಪಾರ ಬಂಡವಾಳ',
    amount: '₹80,000',
    metricEn: 'Inventory expanded with 2.5x monthly turnover',
    metricKn: 'ದಿನಸಿ ಸರಕು ವಿಸ್ತರಣೆ ಮತ್ತು ೨.೫ ಪಟ್ಟು ವಹಿವಾಟು ಹೆಚ್ಚಳ',
    duration: '3:15 min',
    quoteEn: '“The wholesale FMCG supplier received direct payment from GGY at 0% processing fee. I installed a UPI soundbox and my customers pay digitally without hassle.”',
    quoteKn: '“ಸಗಟು ವಿತರಕರಿಗೆ ನೇರವಾಗಿ ಹಣ ಪಾವತಿಯಾಗಿದ್ದರಿಂದ ೧೫% ರಿಯಾಯಿತಿ ಸಿಕ್ಕಿತು. ಅಂಗಡಿಯಲ್ಲಿ ಯುಪಿಐ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಅಳವಡಿಸಿದ್ದು, ಗ್ರಾಹಕರು ಸುಲಭವಾಗಿ ಪಾವತಿಸುತ್ತಿದ್ದಾರೆ.”',
    transcriptEn: 'Basavaraj shares how eliminating local money lenders helped his grocery store stock seasonal FMCG items in bulk, increasing gross margins by 18%.',
    transcriptKn: 'ಸ್ಥಳೀಯ ಲೇವಾದೇವಿದಾರರ ದುಬಾರಿ ಬಡ್ಡಿಯನ್ನು ತಪ್ಪಿಸಿ, ನೇರ ಬಂಡವಾಳದ ಮೂಲಕ ದಿನಸಿ ಅಂಗಡಿಯನ್ನು ಆಧುನೀಕರಿಸಿ ಲಾಭ ಹೆಚ್ಚಿಸಿಕೊಂಡ ಬಗೆಯನ್ನು ಬಸವರಾಜ್ ವಿವರಿಸುತ್ತಾರೆ.',
    categoryEn: 'Retail & Commerce',
    categoryKn: 'ದಿನಸಿ & ಸಣ್ಣ ವ್ಯಾಪಾರ',
    tagEn: 'Retail Enterprise',
    tagKn: 'ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಗತಿ',
    thumbnailBg: 'from-amber-950 via-slate-900 to-orange-950',
    icon: Store
  },
  {
    id: 'vid-kavitha',
    type: 'video',
    nameEn: 'Smt. Kavitha Revanna',
    nameKn: 'ಶ್ರೀಮತಿ ಕವಿತಾ ರೇವಣ್ಣ',
    villageEn: 'Ramanagara Silk Cluster',
    villageKn: 'ರಾಮನಗರ ರೇಷ್ಮೆ ಕ್ಲಸ್ಟರ್',
    district: 'Ramanagara',
    schemeEn: 'Powerloom Artisan Credit',
    schemeKn: 'ನೇಯ್ಗೆ & ಕೈಮಗ್ಗ ಕುಶಲಕರ್ಮಿ ಸಾಲ',
    amount: '₹1,50,000',
    metricEn: 'Direct yarn procurement saved 14% raw material cost',
    metricKn: 'ನೇರ ರೇಷ್ಮೆ ನೂಲು ಖರೀದಿಯಿಂದ ೧೪% ಉಳಿತಾಯ',
    duration: '2:10 min',
    quoteEn: '“We eliminated predatory loan sharks. With GGY’s 14% reducing rate, we bought pure mulberry silk yarn directly from the Ramanagara Silk Exchange for the wedding season.”',
    quoteKn: '“ಖಾಸಗಿ ಲೇವಾದೇವಿದಾರರ ಹಾವಳಿ ತಪ್ಪಿತು. ಜಿಜಿವೈ ಸಾಲದಿಂದ ನೇರವಾಗಿ ರಾಮನಗರ ರೇಷ್ಮೆ ಮಾರುಕಟ್ಟೆಯಿಂದಲೇ ನೂಲು ಖರೀದಿಸಿ ಮದುವೆ ಸೀಸನ್‌ಗೆ ಸೀರೆಗಳನ್ನು ತಯಾರಿಸಿದ್ದೇವೆ.”',
    transcriptEn: 'Kavitha demonstrates how modern motorized jacquard looms doubled weaving speed while keeping debt service predictable with zero foreclosure penalty.',
    transcriptKn: 'ಕವಿತಾರವರು ಮಗ್ಗದ ಆಧುನೀಕರಣದಿಂದ ನೇಯ್ಗೆ ವೇಗ ದುಪ್ಪಟ್ಟಾಗಿದ್ದು, ಯಾವುದೇ ಮುಂಗಡ ರದ್ದು ಶುಲ್ಕವಿಲ್ಲದೆ ನೆಮ್ಮದಿಯಿಂದ ವ್ಯಾಪಾರ ಮಾಡುತ್ತಿರುವುದಾಗಿ ತಿಳಿಸುತ್ತಾರೆ.',
    categoryEn: 'Handloom & Textile',
    categoryKn: 'ನೇಯ್ಗೆ & ಜವಳಿ',
    tagEn: 'Artisan & Weaving',
    tagKn: 'ಕುಶಲಕರ್ಮಿ ಸಬಲೀಕರಣ',
    thumbnailBg: 'from-purple-950 via-slate-900 to-emerald-950',
    icon: Shirt
  },
  {
    id: 'photo-radha',
    type: 'photo',
    nameEn: 'Smt. Radha M. & Group',
    nameKn: 'ಶ್ರೀಮತಿ ರಾಧಾ ಎಂ. ಮತ್ತು ತಂಡ',
    villageEn: 'Maddur Rural Sector',
    villageKn: 'ಮದ್ದೂರು ಗ್ರಾಮೀಣ ವಲಯ',
    district: 'Mandya',
    schemeEn: 'Micro-Horticulture & Drip Credit',
    schemeKn: 'ಕಿರು ತೋಟಗಾರಿಕೆ & ಹನಿ ನೀರಾವರಿ ಸಾಲ',
    amount: '₹60,000',
    metricEn: 'Water conservation increased vegetable yield by 40%',
    metricKn: 'ಹನಿ ನೀರಾವರಿಯಿಂದ ತರಕಾರಿ ಇಳುವರಿ ೪೦% ಹೆಚ್ಚಳ',
    quoteEn: '“The field officer visited our farm, geotagged our land, and disbursed the micro-irrigation funds directly into our vendor account in 48 hours.”',
    quoteKn: '“ಕ್ಷೇತ್ರಾಧಿಕಾರಿ ನಮ್ಮ ಜಮೀನಿಗೆ ಭೇಟಿ ನೀಡಿ ಪರಿಶೀಲಿಸಿದ ೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಉಪಕರಣಗಳ ವೆಂಡರ್ ಖಾತೆಗೆ ಹಣ ವರ್ಗಾವಣೆಯಾಯಿತು.”',
    transcriptEn: 'Field Photo-Essay: Verification of micro-drip pipes and organic manure inputs across 2.5 acres of tender coconut and marigold cultivation.',
    transcriptKn: 'ಕ್ಷೇತ್ರ ಪರಿಶೀಲನಾ ವರದಿ: ತೆಂಗು ಮತ್ತು ಸೇವಂತಿಗೆ ಹೂವಿನ ಕೃಷಿಗೆ ಹನಿ ನೀರಾವರಿ ಪೈಪ್ ಅಳವಡಿಕೆ ಪರಿಶೀಲನೆ.',
    categoryEn: 'Agri-Allied',
    categoryKn: 'ಕೃಷಿ & ತೋಟಗಾರಿಕೆ',
    tagEn: 'Drip Irrigation',
    tagKn: 'ಹನಿ ನೀರಾವರಿ',
    thumbnailBg: 'from-emerald-900 via-teal-950 to-slate-950',
    icon: Sprout
  },
  {
    id: 'shg-shakti',
    type: 'shg',
    nameEn: 'Shakti Mahila Swasahaya Sangha',
    nameKn: 'ಶಕ್ತಿ ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘ (೧೦ ಸದಸ್ಯರು)',
    villageEn: 'Magadi Rural Circle',
    villageKn: 'ಮಾಗಡಿ ಗ್ರಾಮೀಣ ವಲಯ',
    district: 'Ramanagara',
    schemeEn: 'Joint Liability Group (JLG) Micro-Credit',
    schemeKn: 'ಸ್ವಸಹಾಯ ಗುಂಪು (JLG) ಕಿರು ಸಾಲ',
    amount: '₹2,00,000',
    metricEn: '100% on-time weekly repayments via dynamic QR',
    metricKn: 'ಡೈನಾಮಿಕ್ ಕ್ಯೂಆರ್ ಮೂಲಕ ೧೦೦% ಸಕಾಲಿಕ ಮರುಪಾವತಿ',
    quoteEn: '“We meet every Tuesday at 10 AM. GGY’s Field Officer collects our installment with a digital receipt sent directly to our phones within 3 seconds.”',
    quoteKn: '“ಪ್ರತಿ ಮಂಗಳವಾರ ನಮ್ಮ ಸಂಘದ ಸಭೆ ನಡೆಯುತ್ತದೆ. ಕ್ಷೇತ್ರಾಧಿಕಾರಿ ಡಿಜಿಟಲ್ ರಶೀದಿಯೊಂದಿಗೆ ಕಂತು ಸ್ವೀಕರಿಸುತ್ತಾರೆ, ತಕ್ಷಣ ಮೊಬೈಲ್‌ಗೆ ಸಂದೇಶ ಬರುತ್ತದೆ.”',
    transcriptEn: 'Community SHG Spotlight: 10 women entrepreneurs running tailoring units, agarbatti rolling, and spice packaging collaboratively servicing their group loan.',
    transcriptKn: 'ಸಂಘದ ಪ್ರಗತಿ ಚಿತ್ರಣ: ಟೈಲರಿಂಗ್, ಅಗರಬತ್ತಿ ಮತ್ತು ಮಸಾಲೆ ಪುಡಿ ಪ್ಯಾಕಿಂಗ್ ಘಟಕಗಳನ್ನು ನಡೆಸುತ್ತಿರುವ ೧೦ ಗ್ರಾಮೀಣ ಮಹಿಳೆಯರ ಸಹಭಾಗಿತ್ವ.',
    categoryEn: 'Women SHG',
    categoryKn: 'ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘ',
    tagEn: 'Joint Liability Group',
    tagKn: 'ಸಹಭಾಗಿತ್ವ ಸಾಲ',
    thumbnailBg: 'from-orange-950 via-rose-950 to-slate-950',
    icon: Users2
  },
  {
    id: 'photo-manjunath',
    type: 'photo',
    nameEn: 'Sri Manjunath Acharya',
    nameKn: 'ಶ್ರೀ ಮಂಜುನಾಥ ಆಚಾರ್ಯ',
    villageEn: 'Kanakapura Handicraft Belt',
    villageKn: 'ಕನಕಪುರ ಕರಕುಶಲ ವಲಯ',
    district: 'Ramanagara',
    schemeEn: 'Wooden Toy Artisan Micro-Loan',
    schemeKn: 'ಚನ್ನಪಟ್ಟಣ ಮರದ ಆಟಿಕೆ ಕುಶಲಕರ್ಮಿ ಸಾಲ',
    amount: '₹75,000',
    metricEn: 'Lathe machine tooling upgrade tripled export output',
    metricKn: 'ಲೇತ್ ಯಂತ್ರ ಸುಧಾರಣೆಯಿಂದ ರಫ್ತು ಉತ್ಪಾದನೆ ಮೂರು ಪಟ್ಟು ಏರಿಕೆ',
    quoteEn: '“Natural vegetable lacquer colors and seasoned wood purchases require advance cash. GGY gave us seasonal working capital at fair rates.”',
    quoteKn: '“ಸಾವಯವ ಬಣ್ಣಗಳು ಮತ್ತು ನೈಸರ್ಗಿಕ ಮರ ಖರೀದಿಗೆ ಮುಂಗಡ ಹಣ ಬೇಕಿತ್ತು. ಜಿಜಿವೈ ನ್ಯಾಯಸಮ್ಮತ ಬಡ್ಡಿದರದಲ್ಲಿ ಸಕಾಲಿಕ ಸಾಲ ನೀಡಿದೆ.”',
    transcriptEn: 'Field Inspection Log: Verification of eco-friendly toy manufacturing units, lacquer coloring process, and GI-tagged Channapatna woodcraft items.',
    transcriptKn: 'ಕ್ಷೇತ್ರ ಪರಿಶೀಲನಾ ಟಿಪ್ಪಣಿ: ಜಿಐ ಮಾನ್ಯತೆಯುಳ್ಳ ಚನ್ನಪಟ್ಟಣ ಮರದ ಆಟಿಕೆಗಳ ನೈಸರ್ಗಿಕ ಬಣ್ಣ ತಯಾರಿಕಾ ಘಟಕದ ಪರಿಶೀಲನೆ.',
    categoryEn: 'Artisan & Craft',
    categoryKn: 'ಕರಕುಶಲ & ಆಟಿಕೆ',
    tagEn: 'GI Woodcraft',
    tagKn: 'ಪ್ರಾಚೀನ ಕರಕುಶಲತೆ',
    thumbnailBg: 'from-amber-950 via-yellow-950 to-slate-950',
    icon: Sparkles
  }
];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'photo' | 'shg'>('all');
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStory(null);
      }
    };
    if (selectedStory) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedStory]);

  const filteredStories = GALLERY_STORIES.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const labels = {
    en: {
      badge: 'Field Reality & Borrower Media',
      title: 'Voices of Rural Transformation',
      subtitle: 'Unscripted video testimonials, photo-essays, and community meetings showcasing how honest doorstep credit powers rural enterprise across Bharat.',
      allTab: 'All Stories (6)',
      videoTab: 'Video Testimonials',
      photoTab: 'Village Photo-Essays',
      shgTab: 'Women SHG Meets',
      watchVideo: 'Watch Video Story',
      viewPhoto: 'Inspect Field Log',
      verifiedBorrower: 'Verified Borrower',
      sanctionedAmount: 'Sanctioned Loan',
      audioSimNotice: 'Audio-Visual Simulation Active',
      playingAudio: 'Simulated field narration playing in Kannada & English',
      pausedAudio: 'Playback paused. Click to resume narration.',
      storySummary: 'Story Summary & Field Officer Notes',
      closeModal: 'Close Story',
      connectAdvisor: 'Enquire About Similar Loan',
      impactStatsTitle: 'Tangible Ground Impact Across Grassroots Households',
      stat1Val: '99.4%',
      stat1Lbl: 'On-Time Doorstep Repayment',
      stat2Val: '100%',
      stat2Lbl: 'Zero Hidden Pre-Closure Penalties',
      stat3Val: '15 Min',
      stat3Lbl: 'Digital In-Principle Sanction',
      stat4Val: '₹12+ Cr',
      stat4Lbl: 'Working Capital Disbursed',
      ctaTitle: 'Ready to expand your rural business or dairy farm?',
      ctaSubtitle: 'Our authorized Field Officers provide doorstep biometric verification and transparent EMI repayment.',
      ctaButton: 'Chat with Field Officer on WhatsApp'
    },
    kn: {
      badge: 'ಗ್ರಾಮೀಣ ನೈಜತೆ & ಮಾಧ್ಯಮ ಗ್ಯಾಲರಿ',
      title: 'ಗ್ರಾಮೀಣ ಆರ್ಥಿಕ ಪರಿವರ್ತನೆಯ ಯಶೋಗಾಥೆಗಳು',
      subtitle: 'ಪ್ರಾಮಾಣಿಕ ಮನೆಬಾಗಿಲ ಸಾಲ ಸೌಲಭ್ಯದಿಂದ ಆರ್ಥಿಕ ಸ್ವಾವಲಂಬನೆ ಸಾಧಿಸಿದ ರೈತರು, ಮಹಿಳೆಯರು ಮತ್ತು ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳ ನೈಜ ವಿಡಿಯೋ ಸಂದರ್ಶನಗಳು ಮತ್ತು ಛಾಯಾಚಿತ್ರ ಕಥೆಗಳು.',
      allTab: 'ಎಲ್ಲಾ ಕಥೆಗಳು (೬)',
      videoTab: 'ವಿಡಿಯೋ ಸಂದರ್ಶನಗಳು',
      photoTab: 'ಗ್ರಾಮೀಣ ಛಾಯಾಚಿತ್ರ ಕಥೆಗಳು',
      shgTab: 'ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘಗಳು',
      watchVideo: 'ವಿಡಿಯೋ ವೀಕ್ಷಿಸಿ',
      viewPhoto: 'ಪರಿಶೀಲನಾ ವರದಿ ನೋಡಿ',
      verifiedBorrower: 'ದೃಢೀಕೃತ ಗ್ರಾಹಕರು',
      sanctionedAmount: 'ಮಂಜೂರಾದ ಸಾಲ',
      audioSimNotice: 'ದೃಶ್ಯ-ಶ್ರವ್ಯ ವಿವರಣೆ ಲೈವ್ ಆಗಿದೆ',
      playingAudio: 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕ್ಷೇತ್ರ ವಿವರಣೆ ಕೇಳಿಸುತ್ತಿದೆ',
      pausedAudio: 'ವಿವರಣೆಯನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ. ಮುಂದುವರಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ.',
      storySummary: 'ಕಥೆಯ ಮುಖ್ಯಾಂಶಗಳು & ಕ್ಷೇತ್ರಾಧಿಕಾರಿ ಟಿಪ್ಪಣಿ',
      closeModal: 'ಮುಚ್ಚಿ',
      connectAdvisor: 'ಇದೇ ರೀತಿಯ ಸಾಲಕ್ಕಾಗಿ ವಿಚಾರಿಸಿ',
      impactStatsTitle: 'ನೆಲಮಟ್ಟದ ನೈಜ ಬದಲಾವಣೆಯ ಸಂಕೇತ',
      stat1Val: '೯೯.೪%',
      stat1Lbl: 'ಸಕಾಲಿಕ ಮನೆಬಾಗಿಲ ಮರುಪಾವತಿ',
      stat2Val: '೧೦೦%',
      stat2Lbl: 'ಯಾವುದೇ ಮುಂಗಡ ರದ್ದು ಶುಲ್ಕವಿಲ್ಲ',
      stat3Val: '೧೫ ನಿಮಿಷ',
      stat3Lbl: 'ಡಿಜಿಟಲ್ ಪ್ರಾಥಮಿಕ ಮಂಜೂರಾತಿ',
      stat4Val: '₹೧೨+ ಕೋಟಿ',
      stat4Lbl: 'ವಿತರಿಸಲಾದ ನೇರ ಬಂಡವಾಳ',
      ctaTitle: 'ನಿಮ್ಮ ಹೈನುಗಾರಿಕೆ ಅಥವಾ ಸಣ್ಣ ವ್ಯಾಪಾರವನ್ನು ವಿಸ್ತರಿಸಲು ಬಯಸುವಿರಾ?',
      ctaSubtitle: 'ನಮ್ಮ ತರಬೇತಿ ಪಡೆದ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಗಳು ಮನೆಬಾಗಿಲಿಗೆ ಬಂದು ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ ನಡೆಸಿ ಸುಲಭ ಕಂತಿನ ಸಾಲ ಒದಗಿಸುತ್ತಾರೆ.',
      ctaButton: 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕ್ಷೇತ್ರಾಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ'
    }
  };

  const t = labels[lang];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      <PublicHeader />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#062e1c] via-[#064e3b] to-[#022c22] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300/90 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-amber-300 font-bold">Media &amp; Field Stories</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            {t.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>

          {/* Interactive Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/80">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              {t.allTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('video')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
                activeFilter === 'video'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t.videoTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('photo')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
                activeFilter === 'photo'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t.photoTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('shg')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
                activeFilter === 'shg'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>{t.shgTab}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map((story) => {
            const Icon = story.icon;
            const isVideo = story.type === 'video';

            return (
              <article
                key={story.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Visual Media Card Header */}
                <div
                  onClick={() => {
                    setSelectedStory(story);
                    setIsVideoPlaying(true);
                  }}
                  className={`relative aspect-video bg-gradient-to-br ${story.thumbnailBg} flex items-center justify-center cursor-pointer overflow-hidden select-none`}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>

                  {/* Corner Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                      <Icon className="w-3 h-3 text-orange-400" />
                      <span>{lang === 'kn' ? story.tagKn : story.tagEn}</span>
                    </span>
                  </div>

                  {/* Duration or Format Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-emerald-300 font-mono backdrop-blur-md border border-white/10">
                      {isVideo ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>{story.duration}</span>
                        </>
                      ) : (
                        <span>Photo-Essay</span>
                      )}
                    </span>
                  </div>

                  {/* Central Play/Expand Trigger */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition-all shadow-lg">
                    {isVideo ? (
                      <Play className="w-6 h-6 ml-0.5 fill-current" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Bottom Bar inside Thumbnail */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-[11px] font-medium">
                    <span className="font-semibold">{story.district}</span>
                    <span className="text-orange-400 font-bold font-mono">{story.amount}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-orange-600 font-bold mb-1">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'kn' ? story.schemeKn : story.schemeEn}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {lang === 'kn' ? story.nameKn : story.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {lang === 'kn' ? story.villageKn : story.villageEn}, {story.district}
                    </p>

                    <blockquote className="mt-3 text-xs text-slate-600 italic border-l-2 border-orange-500/80 pl-3 leading-relaxed">
                      {lang === 'kn' ? story.quoteKn : story.quoteEn}
                    </blockquote>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                      {lang === 'kn' ? story.metricKn : story.metricEn}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStory(story);
                        setIsVideoPlaying(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      <span>{isVideo ? t.watchVideo : t.viewPhoto}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Impact Metric Strip */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Grassroots Impact
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.impactStatsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/70">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{t.stat1Val}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.stat1Lbl}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/70">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{t.stat2Val}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.stat2Lbl}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/70">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{t.stat3Val}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.stat3Lbl}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/70">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{t.stat4Val}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.stat4Lbl}</p>
            </div>
          </div>
        </section>

        {/* WhatsApp Advisory Call to Action */}
        <section className="mt-12 bg-gradient-to-r from-[#064e3b] via-[#062e1c] to-[#022c22] rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-800">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
              {t.ctaSubtitle}
            </p>
          </div>
          <a
            href={`https://wa.me/919845123450?text=${encodeURIComponent('Namaskara GGY Finance, I watched your field story gallery and want details on Dairy and Micro-Lending loans.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow-lg transition-all shrink-0 min-h-[46px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.ctaButton}</span>
          </a>
        </section>
      </main>

      {/* ======================================================== */}
      {/* INTERACTIVE MODAL MEDIA PLAYER SIMULATOR */}
      {/* ======================================================== */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedStory.type === 'video' ? 'Interactive Video Case Study' : 'Field Inspection Photo-Essay'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {lang === 'kn' ? selectedStory.nameKn : selectedStory.nameEn} ({selectedStory.district})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                aria-label={t.closeModal}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen Simulation */}
            <div className="relative aspect-video bg-black flex flex-col justify-between p-4 overflow-hidden select-none shrink-0">
              <div className="flex items-center justify-between text-xs text-white/90 z-10">
                <div className="inline-flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 font-medium">
                  <GGYBrandMark size="sm" />
                  <span>GGY Ground Reality Case Study • {selectedStory.district}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                  aria-label="Toggle Mute"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>

              {/* Central Player Status Overlay */}
              <div className="text-center z-10 my-auto">
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-16 h-16 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white mx-auto flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105"
                >
                  <Play className={`w-7 h-7 ml-0.5 fill-current ${isVideoPlaying ? 'opacity-80' : 'opacity-100'}`} />
                </button>
                <p className="mt-3 text-xs text-white/90 font-medium drop-shadow-md">
                  {isVideoPlaying ? t.playingAudio : t.pausedAudio}
                </p>
              </div>

              {/* Bottom Video Progress Scrub Bar & Controls */}
              <div className="z-10 space-y-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full bg-orange-500 rounded-full transition-all duration-300 ${isVideoPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`}></div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/80 font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="hover:text-white font-bold cursor-pointer"
                    >
                      {isVideoPlaying ? 'Pause' : 'Play'}
                    </button>
                    <span className="text-[11px] text-slate-400">01:18 / {selectedStory.duration || '02:30'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    {t.audioSimNotice}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Information & Transcript Section */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      {lang === 'kn' ? selectedStory.nameKn : selectedStory.nameEn}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {t.verifiedBorrower}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {lang === 'kn' ? selectedStory.villageKn : selectedStory.villageEn}, {selectedStory.district} • {lang === 'kn' ? selectedStory.schemeKn : selectedStory.schemeEn}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.sanctionedAmount}</span>
                  <span className="text-base font-black text-orange-600 font-mono">{selectedStory.amount}</span>
                </div>
              </div>

              {/* Borrower Quote */}
              <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-xs text-slate-800 leading-relaxed italic">
                {lang === 'kn' ? selectedStory.quoteKn : selectedStory.quoteEn}
              </div>

              {/* Story Transcript */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t.storySummary}
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {lang === 'kn' ? selectedStory.transcriptKn : selectedStory.transcriptEn}
                </p>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-all text-center cursor-pointer min-h-[44px]"
                >
                  {t.closeModal}
                </button>
                <a
                  href={`https://wa.me/919845123450?text=${encodeURIComponent(`Namaskara, I watched the case study of ${selectedStory.nameEn} and want loan details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black transition-all text-center shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.connectAdvisor}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
