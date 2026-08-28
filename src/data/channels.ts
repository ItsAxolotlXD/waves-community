import rawChannels from "./channels.json";
import { Channel as AppChannel, ProgramScheduleItem } from "../types";

export interface Channel {
  id: string;
  name: string;
  url: string;
  group: string;
  logoText: string;
  logoBg: string;
  userAgent?: string;
  isRadio?: boolean;
  logoImg?: string;
  channelNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  logo?: string;
  channels: Channel[];
}

const getLogoText = (name: string): string => {
  let clean = name;
  if (clean.includes(" - ")) {
    clean = clean.split(" - ")[1];
  } else {
    clean = clean.replace(/TRUYỀN HÌNH\s+/i, "");
    clean = clean.replace(/Truyền hình\s+/i, "");
  }
  if (clean.includes(" (")) {
    clean = clean.split(" (")[0];
  }
  return clean.trim();
};

const getGradient = (group: string, name: string): string => {
  const lowerG = group.toLowerCase();
  const lowerN = name.toLowerCase();
  if (lowerG.includes("vtv")) {
    if (lowerN.includes("1")) return "bg-gradient-to-br from-red-600 to-red-800";
    if (lowerN.includes("2")) return "bg-gradient-to-br from-purple-600 to-purple-800";
    if (lowerN.includes("3")) return "bg-gradient-to-br from-blue-600 to-blue-800";
    if (lowerN.includes("4")) return "bg-gradient-to-br from-teal-600 to-teal-800";
    if (lowerN.includes("5")) return "bg-gradient-to-br from-emerald-600 to-emerald-800";
    return "bg-gradient-to-br from-red-500 to-orange-600";
  }
  if (lowerG.includes("vtvcab")) {
    return "bg-gradient-to-br from-fuchsia-600 to-pink-700";
  }
  if (lowerG.includes("htv")) {
    return "bg-gradient-to-br from-blue-600 to-indigo-800";
  }
  if (lowerG.includes("sctv")) {
    return "bg-gradient-to-br from-rose-600 to-blue-800";
  }
  if (lowerG.includes("radio")) {
    return "bg-gradient-to-br from-red-500 to-pink-600";
  }
  if (lowerG.includes("quốc tế") || lowerG.includes("world")) {
    return "bg-gradient-to-br from-neutral-800 to-stone-900";
  }
  return "bg-gradient-to-br from-teal-500 to-cyan-700";
};

// Map raw channels list to legacy channel structure
export const processedChannels: Channel[] = rawChannels.map((ch: any) => {
  const isRadio = ch.group === "Radio" || !!ch.isRadio;
  return {
    id: ch.id,
    name: ch.name,
    url: ch.url,
    group: ch.group,
    logoText: getLogoText(ch.name),
    logoBg: getGradient(ch.group, ch.name),
    isRadio: isRadio,
    logoImg: ch.logo
  };
});

// Category template definitions
const categoryTemplates = [
  { id: "vtv", name: "Kênh VTV", description: "Các kênh sóng truyền hình quốc gia VTV", logo: "https://static.wikia.nocookie.net/logos/images/1/13/VTV_logo_%28b%E1%BA%A3n_2%29.png/revision/latest/scale-to-width-down/1000?cb=20240103140637&path-prefix=vi" },
  { id: "vtvcab", name: "Kênh VTVcab", description: "Kênh giải trí thể thao, phim ảnh tổng hợp đặc sắc", logo: "https://static.wikia.nocookie.net/logos/images/4/45/VTVcab_logo.png/revision/latest/scale-to-width-down/1000?cb=20230331092733&path-prefix=vi" },
  { id: "htv", name: "Kênh HTV", description: "Các kênh sóng truyền hình Đài Thành phố Hồ Chí Minh", logo: "https://static.wikia.nocookie.net/logos/images/d/dd/HTV_logo_2012_%281%29.png/revision/latest/scale-to-width-down/1000?cb=20231118121202&path-prefix=vi" },
  { id: "sctv", name: "Kênh SCTV", description: "Các kênh giải trí, khoa học và phim truyện SCTV cáp", logo: "https://static.wikia.nocookie.net/logos/images/1/15/SCTV.png/revision/latest/scale-to-width-down/1000?cb=20230624130447&path-prefix=vi" },
  { id: "thiet-yeu", name: "Kênh thiết yếu", description: "Truyền hình thiết yếu quốc gia", logo: "https://em-content.zobj.net/source/microsoft/379/check-mark-button_2705.png" },
  { id: "dia-phuong", name: "Kênh địa phương", description: "Truyền hình địa phương, liên tỉnh bản quyền", logo: "https://vectorflags.s3.amazonaws.com/flags/vn-wave-01.png" },
  { id: "quoc-te", name: "Kênh quốc tế", description: "Kênh tin tức thời sự thế giới, phim hoạt hình nổi tiếng nước ngoài", logo: "https://em-content.zobj.net/source/microsoft/379/globe-with-meridians_1f310.png" },
  { id: "phat-thanh-radio", name: "Kênh phát thanh", description: "Các đài phát thanh VOV, VOH, FM Giao thông đặc sắc" }
];

function getSortName(name: string, id: string): string {
  if (id === "gia_lai") return "Truyền hình Đồng Tháp - THĐT A_gia_lai";
  if (id === "dong_thap_1") return "Truyền hình Đồng Tháp - THĐT B_dong_thap_1";
  if (id === "dong_thap_2") return "Truyền hình Đồng Tháp - THĐT C_dong_thap_2";
  if (id === "lao_cai") return "Truyền hình Lào Cai - THLC A_lao_cai";
  if (id === "lang_son") return "Truyền hình Lào Cai - THLC B_lang_son";
  if (id === "quang_ninh_1") return "Truyền hình Quảng Ngãi - QNgTV A1_quang_ninh_1";
  if (id === "quang_ninh_3") return "Truyền hình Quảng Ngãi - QNgTV A2_quang_ninh_3";
  if (id === "quang_ngai_1") return "Truyền hình Quảng Ngãi - QNgTV B1_quang_ngai_1";
  if (id === "quang_ngai_2") return "Truyền hình Quảng Ngãi - QNgTV B2_quang_ngai_2";
  if (id === "tay_ninh") return "Truyền hình Quảng Trị - QTTV A_tay_ninh";
  if (id === "son_la") return "Truyền hình Quảng Trị - QTTV B_son_la";
  if (id === "quang_tri") return "Truyền hình Quảng Trị - QTTV C_quang_tri";
  if (id === "tuyen_quang") return "Truyền hình Thái Nguyên - TN A_tuyen_quang";
  if (id === "thanh_hoa") return "Truyền hình Thái Nguyên - TN B_thanh_hoa";
  if (id === "thai_nguyen") return "Truyền hình Thái Nguyên - TN C_thai_nguyen";
  if (id === "ha_noi_1") return "Truyền hình Hà Nội - H1";
  if (id === "ha_noi_2") return "Truyền hình Hà Nội - H2";
  if (id === "hue") return "Truyền hình Hà Nội - H3_hue";
  return name;
}

export const CATEGORIES: Category[] = categoryTemplates.map(tpl => {
  let matchedChannels: Channel[] = [];
  
  if (tpl.id === "vtv") {
    matchedChannels = processedChannels.filter(c => c.group === "VTV" && c.id !== "vtv5_tn" && c.id !== "vtv5_tnb");
  } else if (tpl.id === "vtvcab") {
    matchedChannels = processedChannels.filter(c => c.group === "VTVcab");
  } else if (tpl.id === "htv") {
    matchedChannels = processedChannels.filter(c => c.group === "HTV" || c.group === "HTVC");
  } else if (tpl.id === "sctv") {
    matchedChannels = processedChannels.filter(c => c.group === "SCTV");
  } else if (tpl.id === "thiet-yeu") {
    matchedChannels = processedChannels.filter(c => c.id === "antv_thiet_yeu" || c.id === "qpvn_thiet_yeu" || c.group === "Thiết yếu");
  } else if (tpl.id === "dia-phuong") {
    matchedChannels = processedChannels.filter(c => c.group === "Địa phương");
  } else if (tpl.id === "quoc-te") {
    matchedChannels = processedChannels.filter(c => c.group === "Quốc tế" || c.group === "World");
  } else if (tpl.id === "phat-thanh-radio") {
    matchedChannels = processedChannels.filter(c => c.isRadio);
  } else if (tpl.id === "thu-nghiem") {
    matchedChannels = processedChannels.filter(c => c.group === "Thử nghiệm");
  }

  const formattedChannels = matchedChannels.map(ch => {
    let cleanName = ch.name;
    const nameUpper = cleanName.toUpperCase();
    if (!nameUpper.endsWith("HD") && !nameUpper.includes(" HD") && !ch.isRadio && tpl.id !== "thu-nghiem") {
      cleanName = `${cleanName.trim()} HD`;
    }
    return { ...ch, name: cleanName };
  });

  if (tpl.id === "dia-phuong" || tpl.id === "thiet-yeu") {
    formattedChannels.sort((a, b) => getSortName(a.name, a.id).localeCompare(getSortName(b.name, b.id), "vi"));
  }

  return {
    ...tpl,
    channels: formattedChannels
  };
});

const SPECIAL_VTV_NUMBERS: Record<string, string> = {
  vtv1: "001",
  vtv2: "002",
  vtv3: "003",
  vtv4: "004",
  vtv5: "005",
  vtv6: "006",
  vtv7: "007",
  vtv8: "008",
  vtv9: "009",
  vtv10: "010",
  vtv5_tnb: "011",
  vtv5_tn: "012",
};

let nextNum = 13;
CATEGORIES.forEach(category => {
  category.channels.forEach(ch => {
    if (SPECIAL_VTV_NUMBERS[ch.id]) {
      ch.channelNumber = SPECIAL_VTV_NUMBERS[ch.id];
    } else {
      ch.channelNumber = String(nextNum).padStart(3, '0');
      nextNum++;
    }
  });
});

processedChannels.forEach(ch => {
  if (SPECIAL_VTV_NUMBERS[ch.id]) {
    ch.channelNumber = SPECIAL_VTV_NUMBERS[ch.id];
  } else {
    const matched = CATEGORIES.flatMap(cat => cat.channels).find(c => c.id === ch.id);
    if (matched && matched.channelNumber) {
      ch.channelNumber = matched.channelNumber;
    } else {
      ch.channelNumber = String(nextNum).padStart(3, '0');
      nextNum++;
    }
  }
});

// Full Application Channels Data (Typed as AppChannel)
export const CHANNELS_DATA: AppChannel[] = rawChannels.map((ch: any, idx: number) => {
  const isRadio = ch.group === "Radio" || !!ch.isRadio;
  const isVTV = ch.group === "VTV";
  const quality = isRadio ? "SD" : isVTV ? "HD" : "HD";
  const slug = ch.id.replace(/_/g, "-");

  const samplePrograms = [
    { title: "Thời sự trực tiếp & Điểm tin trong ngày", desc: "Bản tin thời sự cập nhật tin tức kinh tế, chính trị xã hội và quốc tế mới nhất." },
    { title: "Chuyển động 24h & Nhịp sống số", desc: "Tin tức đa chiều, phóng sự điều tra và đời sống xã hội nóng hổi." },
    { title: "Phim truyện đặc sắc & Điện ảnh cuối tuần", desc: "Phát sóng các tác phẩm điện ảnh và truyền hình tiêu biểu." },
    { title: "Khám phá thế giới & Khoa giáo", desc: "Chương trình tài liệu khoa học tự nhiên và công nghệ ứng dụng." },
    { title: "Giai điệu kết nối & Tạp kỹ", desc: "Không gian âm nhạc nghệ thuật và talkshow văn hóa đặc biệt." }
  ];
  const prog = samplePrograms[idx % samplePrograms.length];

  return {
    id: ch.id,
    name: ch.name,
    shortName: ch.name.split(" - ")[0] || ch.name,
    slug: slug,
    logo: ch.logo || "https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest?cb=20260825072411",
    category: ch.group || "Kênh thiết yếu",
    quality: quality as any,
    streamUrl: ch.url,
    backupStreamUrl: ch.url,
    isLive: true,
    viewers: Math.floor(1200 + (idx * 317) % 8500),
    currentProgram: {
      title: prog.title,
      startTime: "19:00",
      endTime: "21:00",
      progress: ((idx * 17) % 80) + 10,
      description: prog.desc
    },
    nextProgram: {
      title: "Chương trình chuyên đề tổng hợp tiếp theo",
      startTime: "21:00"
    },
    description: `Kênh phát sóng ${ch.name} thuộc nhóm ${ch.group}, truyền dẫn tín hiệu chất lượng cao trên hạ tầng Waves Community.`,
    resolution: isRadio ? "Audio Only" : "1920x1080",
    bitrate: isRadio ? "128 kbps" : "5.0 Mbps",
    satelliteFrequency: "Vinasat-1 / Vinasat-2 (11.549 MHz)",
    dvbT2Channel: `Kênh ${24 + (idx % 30)} DVB-T2`,
    officialWebsite: "https://vtv.vn",
    tags: [ch.group, isRadio ? "Radio" : "Truyền hình", "Live", quality],
    bannerImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80"
  };
});

// Program Schedules for LiveTV
export const SCHEDULE_DATA: Record<string, ProgramScheduleItem[]> = {
  vtv1: [
    { id: 'vtv1-1', channelId: 'vtv1', startTime: '06:00', endTime: '07:00', title: 'Chào buổi sáng', category: 'Thời sự', description: 'Điểm tin trong nước và quốc tế đầu ngày', isLive: false },
    { id: 'vtv1-2', channelId: 'vtv1', startTime: '11:30', endTime: '12:00', title: 'Thời sự trưa', category: 'Thời sự', description: 'Cập nhật tin tức buổi trưa trên mọi miền tổ quốc', isLive: false },
    { id: 'vtv1-3', channelId: 'vtv1', startTime: '19:00', endTime: '20:00', title: 'Thời sự 19h', category: 'Chính luận', description: 'Bản tin thời sự trọng điểm quốc gia', isLive: true },
    { id: 'vtv1-4', channelId: 'vtv1', startTime: '20:05', endTime: '20:45', title: 'Phim truyện giờ vàng', category: 'Phim truyền hình', description: 'Bộ phim truyền hình Việt Nam phát sóng giờ vàng', isLive: false },
    { id: 'vtv1-5', channelId: 'vtv1', startTime: '22:00', endTime: '22:30', title: 'Vấn đề hôm nay', category: 'Phân tích', description: 'Tọa đàm chuyên sâu các sự kiện nổi bật trong ngày', isLive: false }
  ],
  vtv3: [
    { id: 'vtv3-1', channelId: 'vtv3', startTime: '07:00', endTime: '08:00', title: 'Cà phê sáng với VTV3', category: 'Giải trí', description: 'Trò chuyện phong cách sống và nghệ thuật', isLive: false },
    { id: 'vtv3-2', channelId: 'vtv3', startTime: '12:00', endTime: '13:00', title: 'Đường lên đỉnh Olympia', category: 'Trò chơi truyền hình', description: 'Sân chơi trí tuệ học đường', isLive: false },
    { id: 'vtv3-3', channelId: 'vtv3', startTime: '20:00', endTime: '21:30', title: 'Cuộc hẹn cuối tuần', category: 'Gameshow', description: 'Show truyền hình giải trí đặc sắc cuối tuần', isLive: true }
  ],
  vn_today: [
    { id: 'vn-today-1', channelId: 'vn_today', startTime: '18:00', endTime: '19:00', title: 'Vietnam Panorama', category: 'Đối ngoại', description: 'Bức tranh toàn cảnh Việt Nam đa sắc', isLive: false },
    { id: 'vn-today-2', channelId: 'vn_today', startTime: '20:00', endTime: '21:00', title: 'VIETNAM TODAY LIVE', category: 'Tin tức Quốc tế', description: 'Bản tin đối ngoại trực tiếp trường quay AR 4K', isLive: true }
  ]
};
