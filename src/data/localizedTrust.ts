import { defaultLocale, type LocaleCode } from "@/i18n/locales";
import type { BrandSlug } from "@/data/brandLogoSpecs";

export type LocalizedBrand = {
  slug: BrandSlug;
  alt: string;
  width?: number;
};

export type LocalizedReview = {
  brand: BrandSlug;
  name: string;
  orgLine: string;
  quote: string;
};

export type TrustPack = {
  brands: LocalizedBrand[];
  reviews: LocalizedReview[];
};

function brand(slug: BrandSlug, alt?: string, width = 126): LocalizedBrand {
  return { slug, alt: alt ?? slug, width };
}

const brandLogoFileOverrides: Partial<Record<BrandSlug, string>> = {
  xpeng: "peng",
  "li-auto": "Li_Auto",
};

const availableLocalBrandLogos = new Set<string>([
  "Li_Auto",
  "amazon",
  "apple",
  "dji",
  "google",
  "lark",
  "meta",
  "microsoft",
  "netflix",
  "nio",
  "peng",
  "tesla",
  "wechat",
  "xiaomi",
]);

export function getBrandLogoSrc(slug: BrandSlug) {
  const fileName = brandLogoFileOverrides[slug] ?? slug;
  return `/images/brand-logos/${availableLocalBrandLogos.has(fileName) ? fileName : "dji"}.svg`;
}

const zhCnPack: TrustPack = {
  brands: [
    { slug: "dji", alt: "DJI", width: 96 },
    { slug: "nio", alt: "NIO", width: 96 },
    { slug: "lark", alt: "Lark", width: 108 },
    { slug: "xpeng", alt: "小鹏", width: 110 },
    { slug: "wechat", alt: "微信", width: 120 },
    { slug: "xiaomi", alt: "小米", width: 108 },
    { slug: "li-auto", alt: "理想汽车", width: 118 },
  ],
  reviews: [
    {
      brand: "dji",
      name: "Michael Chen",
      orgLine: "DJI · Global Programs",
      quote:
        "我们欧洲区的同事来中国参展和驻场几周，最担心的是日常用的协作和通讯习惯被打断。CrowVPN 连上后，和总部同步看海外后台、收验证码都顺畅很多。",
    },
    {
      brand: "nio",
      name: "Sarah Li",
      orgLine: "NIO · Communications",
      quote:
        "和北美、欧洲的同事开例会、在 Slack 里丢链接，以前经常遇到对方能打开、我这边预览失败。现在用 CrowVPN 做日常联络，语音画质稳定不少。",
    },
    {
      brand: "lark",
      name: "Alex Zhang",
      orgLine: "Lark · IT",
      quote:
        "写方案前要查境外媒体、监管公告和行业 PDF，很多链接在公司外网直接超时。CrowVPN 用来检索国外新闻和一手资料省事很多。",
    },
    {
      brand: "xpeng",
      name: "Chris Zhou",
      orgLine: "XPeng · Product",
      quote:
        "做用户访谈会刷 Instagram、Reddit 上的车友讨论，在国内时经常断断续续。用 CrowVPN 后信息流刷新正常多了。",
    },
  ],
};

const trustPacks = {
  "zh-CN": zhCnPack,
  "zh-HK": {
    brands: [brand("cathay", "Cathay"), brand("hsbc", "HSBC"), brand("aia", "AIA"), brand("mtr", "MTR"), brand("hkex", "HKEX"), brand("wechat", "WeChat"), brand("dji", "DJI")],
    reviews: [
      { brand: "cathay", name: "Adrian Lau", orgLine: "Cathay · Operations", quote: "跨區同事臨時要看海外後台和航班協作工具時，CrowVPN 讓連線少了很多反覆切換，值班溝通更順。" },
      { brand: "hsbc", name: "Mandy Ho", orgLine: "HSBC · Client Service", quote: "跟不同市場客戶開會，最怕資料頁面卡住。CrowVPN 連上後，常用系統和會議連線穩定得多。" },
      { brand: "aia", name: "Kelvin Wong", orgLine: "AIA · Digital", quote: "出差時要即時回覆區域團隊，CrowVPN 幫我把酒店和公共 Wi‑Fi 的不確定性降下來。" },
      { brand: "mtr", name: "Ivy Chan", orgLine: "MTR · Project", quote: "海外供應商文件和視訊會議能順利打開，項目排期溝通少了不少等待時間。" },
    ],
  },
  en: {
    brands: [brand("apple", "Apple"), brand("microsoft", "Microsoft", 142), brand("google", "Google"), brand("amazon", "Amazon"), brand("netflix", "Netflix"), brand("tesla", "Tesla"), brand("meta", "Meta")],
    reviews: [
      { brand: "apple", name: "Emily Carter", orgLine: "Apple · Product Ops", quote: "When I travel between offices, CrowVPN keeps design files, calls, and internal dashboards reachable without making every hotel network feel like a new project." },
      { brand: "microsoft", name: "Daniel Brooks", orgLine: "Microsoft · Cloud", quote: "Cross-region collaboration is less fragile now. I can join meetings, review docs, and keep support channels open from airports and client sites." },
      { brand: "google", name: "Maya Patel", orgLine: "Google · Research", quote: "I use CrowVPN when I need consistent access to research references and global services. The connection feels predictable enough for everyday work." },
      { brand: "amazon", name: "Chris Miller", orgLine: "Amazon · Logistics", quote: "Vendor portals and regional dashboards load more consistently on the road, which saves time when schedules are already tight." },
    ],
  },
  cs: {
    brands: [brand("skoda", "Škoda"), brand("avast", "Avast"), brand("seznam", "Seznam"), brand("kiwi", "Kiwi.com"), brand("alza", "Alza"), brand("prusa", "Prusa"), brand("rohlik", "Rohlik")],
    reviews: [
      { brand: "skoda", name: "Petr Novák", orgLine: "Škoda · Engineering", quote: "Při cestách mezi závody potřebuji stabilní přístup k dokumentům a videohovorům. CrowVPN mi šetří čas i nervy." },
      { brand: "avast", name: "Lucie Svobodová", orgLine: "Avast · Security", quote: "Na veřejných sítích oceňuji hlavně předvídatelné připojení a jasný stav ochrany." },
      { brand: "kiwi", name: "Jan Dvořák", orgLine: "Kiwi.com · Travel Ops", quote: "Když řešíme partnery v různých regionech, CrowVPN pomáhá držet nástroje dostupné i na letišti." },
      { brand: "seznam", name: "Tereza Malá", orgLine: "Seznam · Media", quote: "Zahraniční zdroje a redakční systémy se načítají spolehlivěji, i když pracuji mimo kancelář." },
    ],
  },
  de: {
    brands: [brand("siemens", "Siemens"), brand("sap", "SAP"), brand("bosch", "Bosch"), brand("bmw", "BMW"), brand("mercedes", "Mercedes"), brand("lufthansa", "Lufthansa"), brand("telekom", "Telekom")],
    reviews: [
      { brand: "sap", name: "Anna Weber", orgLine: "SAP · Consulting", quote: "Bei Kundenterminen im Ausland bleiben Dashboards, Calls und Support-Kanäle mit CrowVPN deutlich verlässlicher erreichbar." },
      { brand: "bosch", name: "Jonas Fischer", orgLine: "Bosch · Operations", quote: "Für Lieferantenportale und technische Unterlagen unterwegs ist eine stabile Verbindung entscheidend. CrowVPN macht das unkompliziert." },
      { brand: "bmw", name: "Marie Schneider", orgLine: "BMW · Mobility", quote: "Im Hotel-WLAN oder am Flughafen muss ich nicht mehr lange testen, welche Verbindung heute funktioniert." },
      { brand: "siemens", name: "Lukas Bauer", orgLine: "Siemens · Projects", quote: "Internationale Projektabstimmungen laufen ruhiger, weil Dokumente und Meetings weniger oft abbrechen." },
    ],
  },
  es: {
    brands: [brand("zara", "Zara"), brand("santander", "Santander"), brand("telefonica", "Telefónica"), brand("seat", "SEAT"), brand("mango", "Mango"), brand("bbva", "BBVA"), brand("iberdrola", "Iberdrola")],
    reviews: [
      { brand: "telefonica", name: "Laura García", orgLine: "Telefónica · Network", quote: "Cuando viajo por trabajo, CrowVPN mantiene accesibles las herramientas regionales y las videollamadas con menos interrupciones." },
      { brand: "zara", name: "Diego Martín", orgLine: "Zara · Retail Ops", quote: "Los paneles de tiendas y proveedores cargan mejor desde redes de hotel o aeropuertos." },
      { brand: "santander", name: "Carmen Ruiz", orgLine: "Santander · Client Team", quote: "Para revisar documentos y coordinar equipos fuera de España, la conexión resulta mucho más predecible." },
      { brand: "bbva", name: "Pablo Torres", orgLine: "BBVA · Digital", quote: "Me ayuda a trabajar con servicios internacionales sin perder tiempo cambiando de red." },
    ],
  },
  "es-419": {
    brands: [brand("mercadolibre", "Mercado Libre", 152), brand("nubank", "Nubank"), brand("rappi", "Rappi"), brand("globant", "Globant"), brand("banco-galicia", "Galicia"), brand("latam", "LATAM"), brand("cemex", "CEMEX")],
    reviews: [
      { brand: "mercadolibre", name: "Camila Rojas", orgLine: "Mercado Libre · Marketplace", quote: "Entre México, Colombia y Argentina usamos muchas herramientas regionales. CrowVPN ayuda a mantener todo accesible sin tanta fricción." },
      { brand: "nubank", name: "Bruno Almeida", orgLine: "Nubank · Support", quote: "En viajes, las redes públicas suelen ser inestables. Con CrowVPN puedo revisar paneles y responder al equipo con más confianza." },
      { brand: "rappi", name: "Sofía Medina", orgLine: "Rappi · Growth", quote: "Para campañas con equipos en varios países, la conexión estable evita perder tiempo justo antes de publicar." },
      { brand: "globant", name: "Mateo Silva", orgLine: "Globant · Delivery", quote: "Las reuniones y repositorios internacionales funcionan de forma más consistente cuando trabajo fuera de casa." },
    ],
  },
  fr: {
    brands: [brand("renault", "Renault"), brand("airbus", "Airbus"), brand("orange", "Orange"), brand("decathlon", "Decathlon"), brand("carrefour", "Carrefour"), brand("loreal", "L'Oréal"), brand("axa", "AXA")],
    reviews: [
      { brand: "airbus", name: "Julien Moreau", orgLine: "Airbus · Programmes", quote: "En déplacement, CrowVPN garde nos espaces de travail et appels accessibles, même sur des réseaux d’hôtel très variables." },
      { brand: "orange", name: "Claire Bernard", orgLine: "Orange · Support", quote: "La connexion est simple à expliquer aux collègues et le statut de protection est clair." },
      { brand: "decathlon", name: "Nicolas Petit", orgLine: "Decathlon · Retail", quote: "Pour consulter fournisseurs, documents et outils pays, je gagne du temps au quotidien." },
      { brand: "renault", name: "Élodie Martin", orgLine: "Renault · Mobility", quote: "Les réunions internationales sont plus stables lorsque je travaille depuis des réseaux publics." },
    ],
  },
  lt: {
    brands: [brand("vinted", "Vinted"), brand("nord-security", "Nord Security", 152), brand("tesonet", "Tesonet"), brand("telia", "Telia"), brand("ignitis", "Ignitis"), brand("booking", "Booking.com"), brand("spotify", "Spotify")],
    reviews: [
      { brand: "vinted", name: "Ieva Kazlauskaitė", orgLine: "Vinted · Marketplace", quote: "Dirbant kelionėse svarbiausia, kad įrankiai atsidarytų iš karto. CrowVPN padeda išlaikyti stabilų ryšį." },
      { brand: "nord-security", name: "Mantas Petrauskas", orgLine: "Nord Security · Ops", quote: "Viešuose tinkluose aiškus apsaugos statusas ir patikimas prisijungimas yra didelis privalumas." },
      { brand: "telia", name: "Austėja Balčiūnė", orgLine: "Telia · Support", quote: "Klientų sistemų ir susitikimų pasiekiamumas kelionėse tapo daug ramesnis." },
      { brand: "ignitis", name: "Tomas Jankauskas", orgLine: "Ignitis · Projects", quote: "Tarptautinių tiekėjų dokumentai įsikelia greičiau, kai prisijungiu per CrowVPN." },
    ],
  },
  ja: {
    brands: [brand("rakuten", "Rakuten"), brand("toyota", "Toyota"), brand("sony", "Sony"), brand("nintendo", "Nintendo"), brand("uniqlo", "UNIQLO"), brand("softbank", "SoftBank"), brand("mercari", "Mercari")],
    reviews: [
      { brand: "rakuten", name: "佐藤 美咲", orgLine: "Rakuten · Commerce", quote: "海外出張中でも管理画面や会議ツールに安定して接続できるので、移動中の確認作業が楽になりました。" },
      { brand: "toyota", name: "田中 蓮", orgLine: "Toyota · Mobility", quote: "ホテルや空港の Wi‑Fi でも、必要な資料と連絡ツールにすぐアクセスできます。" },
      { brand: "sony", name: "中村 葵", orgLine: "Sony · Media", quote: "海外サービスの確認や素材共有が以前よりスムーズで、作業の中断が減りました。" },
      { brand: "nintendo", name: "高橋 優", orgLine: "Nintendo · Product", quote: "チームとの時差連絡でも、接続が安定しているだけで安心感が違います。" },
    ],
  },
  ko: {
    brands: [brand("naver", "NAVER"), brand("samsung", "Samsung"), brand("hyundai", "Hyundai"), brand("kakao", "Kakao"), brand("lg", "LG"), brand("coupang", "Coupang"), brand("spotify", "Spotify")],
    reviews: [
      { brand: "naver", name: "민지 김", orgLine: "NAVER · Platform", quote: "해외 일정 중에도 협업 도구와 자료 페이지가 안정적으로 열려서 업무 흐름이 끊기지 않습니다." },
      { brand: "samsung", name: "준호 박", orgLine: "Samsung · Mobile", quote: "공항이나 호텔 네트워크에서도 CrowVPN을 켜면 회의와 문서 확인이 훨씬 수월합니다." },
      { brand: "kakao", name: "서연 이", orgLine: "Kakao · Service", quote: "지역별 서비스 확인과 해외 파트너 커뮤니케이션에 안정적인 연결이 큰 도움이 됩니다." },
      { brand: "hyundai", name: "도윤 최", orgLine: "Hyundai · Operations", quote: "출장 중 공급사 포털과 영상 회의 접속이 더 예측 가능해졌습니다." },
    ],
  },
  it: {
    brands: [brand("ferrari", "Ferrari"), brand("gucci", "Gucci"), brand("eni", "Eni"), brand("ferrero", "Ferrero"), brand("prada", "Prada"), brand("olivetti", "Olivetti"), brand("loreal", "L'Oréal")],
    reviews: [
      { brand: "gucci", name: "Giulia Rossi", orgLine: "Gucci · Retail", quote: "Durante trasferte e fiere, CrowVPN mantiene accessibili dashboard, social e strumenti di lavoro senza continue interruzioni." },
      { brand: "ferrari", name: "Marco Bianchi", orgLine: "Ferrari · Events", quote: "Per coordinare team e fornitori internazionali, una connessione prevedibile fa davvero la differenza." },
      { brand: "eni", name: "Elena Ricci", orgLine: "Eni · Projects", quote: "Da reti pubbliche riesco a consultare documenti e sistemi regionali con più tranquillità." },
      { brand: "ferrero", name: "Luca Romano", orgLine: "Ferrero · Supply", quote: "I portali dei partner e le videochiamate funzionano meglio quando sono fuori ufficio." },
    ],
  },
  pl: {
    brands: [brand("allegro", "Allegro"), brand("cd-projekt", "CD PROJEKT", 152), brand("inpost", "InPost"), brand("pkn-orlen", "ORLEN"), brand("reserved", "Reserved"), brand("pekao", "Pekao"), brand("spotify", "Spotify")],
    reviews: [
      { brand: "allegro", name: "Anna Kowalska", orgLine: "Allegro · Marketplace", quote: "W podróży CrowVPN pomaga utrzymać dostęp do paneli, rozmów i dokumentów bez ciągłego przełączania sieci." },
      { brand: "cd-projekt", name: "Piotr Zieliński", orgLine: "CD PROJEKT · Production", quote: "Przy współpracy z zespołami z innych krajów stabilne połączenie oszczędza dużo czasu." },
      { brand: "inpost", name: "Marta Wiśniewska", orgLine: "InPost · Ops", quote: "Portale partnerów i narzędzia monitoringu działają przewidywalniej poza biurem." },
      { brand: "reserved", name: "Kamil Wójcik", orgLine: "Reserved · Retail", quote: "W hotelowym Wi‑Fi mogę szybciej sprawdzić materiały kampanii i odpowiedzieć zespołowi." },
    ],
  },
  nl: {
    brands: [brand("philips", "Philips"), brand("asml", "ASML"), brand("booking", "Booking.com", 152), brand("adyen", "Adyen"), brand("ing", "ING"), brand("heineken", "Heineken"), brand("ikea", "IKEA")],
    reviews: [
      { brand: "booking", name: "Sanne de Vries", orgLine: "Booking.com · Travel", quote: "Wanneer ik wissel tussen hotels en kantoren, houdt CrowVPN partnertools en gesprekken bereikbaar zonder dat het netwerk de hoofdtaak wordt." },
      { brand: "asml", name: "Daan Jansen", orgLine: "ASML · Engineering", quote: "Internationale projectdocumenten en vergaderingen zijn betrouwbaarder bereikbaar wanneer ik onderweg ben." },
      { brand: "adyen", name: "Eva Smit", orgLine: "Adyen · Support", quote: "Openbare wifi voelt minder onvoorspelbaar, vooral wanneer urgente klantdashboards meteen moeten laden." },
      { brand: "philips", name: "Noah Bakker", orgLine: "Philips · Product", quote: "Het is eenvoudig genoeg voor dagelijks gebruik en stabiel genoeg voor samenwerking over landsgrenzen heen." },
    ],
  },
  pt: {
    brands: [brand("farfetch", "Farfetch"), brand("edp", "EDP"), brand("galp", "Galp"), brand("sonae", "Sonae"), brand("nubank", "Nubank"), brand("mercadolibre", "Mercado Livre", 152), brand("spotify", "Spotify")],
    reviews: [
      { brand: "farfetch", name: "Inês Costa", orgLine: "Farfetch · Retail Tech", quote: "Em viagens, CrowVPN mantém dashboards, reuniões e ferramentas internacionais acessíveis com menos interrupções." },
      { brand: "edp", name: "Miguel Ferreira", orgLine: "EDP · Projects", quote: "Em redes públicas, ter uma ligação estável e protegida ajuda muito no trabalho diário." },
      { brand: "galp", name: "Beatriz Santos", orgLine: "Galp · Operations", quote: "Os portais de parceiros e documentos regionais carregam melhor quando estou fora do escritório." },
      { brand: "nubank", name: "Rafael Lima", orgLine: "Nubank · Support", quote: "Para equipas distribuídas, CrowVPN reduz a fricção de acesso a serviços globais." },
    ],
  },
  sv: {
    brands: [brand("spotify", "Spotify"), brand("volvo", "Volvo"), brand("ikea", "IKEA"), brand("ericsson", "Ericsson"), brand("klarna", "Klarna"), brand("hm", "H&M"), brand("telia", "Telia")],
    reviews: [
      { brand: "spotify", name: "Elsa Andersson", orgLine: "Spotify · Content", quote: "När jag jobbar från flygplatser och hotell håller CrowVPN mina verktyg och möten mer stabila." },
      { brand: "volvo", name: "Oskar Nilsson", orgLine: "Volvo · Mobility", quote: "Internationella leverantörsportaler och dokument går snabbare att nå under resor." },
      { brand: "klarna", name: "Maja Eriksson", orgLine: "Klarna · Support", quote: "Offentliga nät känns mindre osäkra när anslutningen är tydlig och konsekvent." },
      { brand: "ericsson", name: "Liam Karlsson", orgLine: "Ericsson · Networks", quote: "För globala teammöten räcker det långt att anslutningen bara fungerar utan extra felsökning." },
    ],
  },
} satisfies Partial<Record<LocaleCode, TrustPack>>;

const englishBrands = trustPacks.en.brands;
const zhBrands = zhCnPack.brands;

function withBrandSet(pack: TrustPack, brands: LocalizedBrand[]): TrustPack {
  return {
    brands,
    reviews: pack.reviews.map((review, index) => ({
      ...review,
      brand: brands[index % brands.length]!.slug,
    })),
  };
}

export function getTrustPack(locale: LocaleCode): TrustPack {
  if (locale === defaultLocale) return zhCnPack;

  const pack = trustPacks[locale] ?? trustPacks.en;
  return withBrandSet(pack, locale === "zh-HK" ? zhBrands : englishBrands);
}
