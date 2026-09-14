/** Story, houses, later chapters and footer — follow the language switch. */

export type HistoryBlock = { title: string; body: string[] };
export type HistoryHouse = { name: string; label: string };
export type HistoryFooter = {
  archiveKicker: string;
  archiveTitle: string;
  archiveBody: string;
  moreHistory: string;
  festivalArtists: string;
  addToHouse: string;
  addToThisHouse: string;
  addMemory: string;
  suggestPhoto: string;
};

const FOOTER_EN: HistoryFooter = {
  archiveKicker: "Archive",
  archiveTitle: "The country archive",
  archiveBody:
    "The essay stays here. The long lists — family houses, older orchestras, past chairs — live in the archive, one country at a time. Pick a country. Signed-in members can add a name; it waits on the owner desk.",
  moreHistory: "Want more history? Go to",
  festivalArtists: "Festival artists",
  addToHouse: "Add to a house",
  addToThisHouse: "Add to this house",
  addMemory: "Add a name, a memory or a date.",
  suggestPhoto: "Suggest a photograph",
};

export const HISTORY_FOOTER: Record<string, HistoryFooter> = {
  en: FOOTER_EN,
  nl: {
    archiveKicker: "Archief",
    archiveTitle: "Het landenarchief",
    archiveBody:
      "Het verhaal blijft hier. De lange lijsten — familiehuizen, oudere orkesten, stoelen van vroeger — staan in het archief, land voor land. Kies een land. Wie is ingelogd kan een naam toevoegen; die wacht op het owner-bureau.",
    moreHistory: "Meer geschiedenis? Ga naar",
    festivalArtists: "Festivalartiesten",
    addToHouse: "Aan een huis toevoegen",
    addToThisHouse: "Aan dit huis toevoegen",
    addMemory: "Voeg een naam, een herinnering of een datum toe.",
    suggestPhoto: "Een foto voorstellen",
  },
  fr: {
    archiveKicker: "Archives",
    archiveTitle: "L’archive des pays",
    archiveBody:
      "L’essai reste ici. Les longues listes — maisons de famille, orchestres plus anciens, chaises d’avant — vivent dans l’archive, pays par pays. Choisis un pays. Les membres connectés peuvent ajouter un nom ; il attend au bureau du propriétaire.",
    moreHistory: "Plus d’histoire ? Va sur",
    festivalArtists: "Artistes de festival",
    addToHouse: "Ajouter à une maison",
    addToThisHouse: "Ajouter à cette maison",
    addMemory: "Ajouter un nom, un souvenir ou une date.",
    suggestPhoto: "Proposer une photo",
  },
  de: {
    archiveKicker: "Archiv",
    archiveTitle: "Das Länderarchiv",
    archiveBody:
      "Der Essay bleibt hier. Die langen Listen — Familienhäuser, ältere Orchester, frühere Stühle — leben im Archiv, Land für Land. Wähle ein Land. Eingeloggte Mitglieder können einen Namen hinzufügen; er wartet am Owner-Tisch.",
    moreHistory: "Mehr Geschichte? Geh zu",
    festivalArtists: "Festival-Künstler",
    addToHouse: "Zu einem Haus hinzufügen",
    addToThisHouse: "Zu diesem Haus hinzufügen",
    addMemory: "Einen Namen, eine Erinnerung oder ein Datum hinzufügen.",
    suggestPhoto: "Ein Foto vorschlagen",
  },
  es: {
    archiveKicker: "Archivo",
    archiveTitle: "El archivo por país",
    archiveBody:
      "El ensayo se queda aquí. Las listas largas — casas de familia, orquestas antiguas, sillas de antes — viven en el archivo, país por país. Elige un país. Quien está dentro puede añadir un nombre; espera en el escritorio del dueño.",
    moreHistory: "¿Más historia? Ve a",
    festivalArtists: "Artistas de festival",
    addToHouse: "Añadir a una casa",
    addToThisHouse: "Añadir a esta casa",
    addMemory: "Añade un nombre, un recuerdo o una fecha.",
    suggestPhoto: "Proponer una foto",
  },
  pt: {
    archiveKicker: "Arquivo",
    archiveTitle: "O arquivo dos países",
    archiveBody:
      "O ensaio fica aqui. As listas longas — casas de família, orquestras antigas, cadeiras de outrora — vivem no arquivo, país a país. Escolhe um país. Quem está ligado pode acrescentar um nome; espera na secretária do dono.",
    moreHistory: "Mais história? Vai a",
    festivalArtists: "Artistas de festival",
    addToHouse: "Acrescentar a uma casa",
    addToThisHouse: "Acrescentar a esta casa",
    addMemory: "Acrescenta um nome, uma memória ou uma data.",
    suggestPhoto: "Sugerir uma fotografia",
  },
  it: {
    archiveKicker: "Archivio",
    archiveTitle: "L’archivio dei paesi",
    archiveBody:
      "Il saggio resta qui. Le liste lunghe — case di famiglia, orchestre più vecchie, sedie di un tempo — vivono nell’archivio, paese per paese. Scegli un paese. Chi è connesso può aggiungere un nome; aspetta sulla scrivania del proprietario.",
    moreHistory: "Più storia? Vai su",
    festivalArtists: "Artisti da festival",
    addToHouse: "Aggiungi a una casa",
    addToThisHouse: "Aggiungi a questa casa",
    addMemory: "Aggiungi un nome, un ricordo o una data.",
    suggestPhoto: "Proponi una fotografia",
  },
  hu: {
    archiveKicker: "Archívum",
    archiveTitle: "Az országarchívum",
    archiveBody:
      "A szöveg itt marad. A hosszú listák — családi házak, régebbi zenekarok, régi székek — az archívumban élnek, országonként. Válassz országot. Bejelentkezve nevet adhatsz hozzá; a tulajdonos asztalán vár.",
    moreHistory: "Több történelem? Irány",
    festivalArtists: "Fesztiválzenészek",
    addToHouse: "Hozzáadás egy házhoz",
    addToThisHouse: "Hozzáadás ehhez a házhoz",
    addMemory: "Adj hozzá egy nevet, emléket vagy dátumot.",
    suggestPhoto: "Fotójavaslat",
  },
  pl: {
    archiveKicker: "Archiwum",
    archiveTitle: "Archiwum krajów",
    archiveBody:
      "Esej zostaje tutaj. Długie listy — domy rodzin, starsze orkiestry, dawne krzesła — żyją w archiwum, kraj po kraju. Wybierz kraj. Zalogowani mogą dodać imię; czeka na biurku właściciela.",
    moreHistory: "Więcej historii? Idź do",
    festivalArtists: "Artyści festiwalowi",
    addToHouse: "Dodaj do domu",
    addToThisHouse: "Dodaj do tego domu",
    addMemory: "Dodaj imię, wspomnienie albo datę.",
    suggestPhoto: "Zaproponuj zdjęcie",
  },
  cs: {
    archiveKicker: "Archiv",
    archiveTitle: "Archiv zemí",
    archiveBody:
      "Esej zůstává tady. Dlouhé seznamy — rodinné domy, starší orchestry, dřívější židle — žijí v archivu, země po zemi. Vyber zemi. Přihlášení mohou přidat jméno; čeká na stole vlastníka.",
    moreHistory: "Víc historie? Jdi na",
    festivalArtists: "Festivaloví umělci",
    addToHouse: "Přidat k domu",
    addToThisHouse: "Přidat k tomuto domu",
    addMemory: "Přidej jméno, vzpomínku nebo datum.",
    suggestPhoto: "Navrhnout fotografii",
  },
  ro: {
    archiveKicker: "Arhivă",
    archiveTitle: "Arhiva țărilor",
    archiveBody:
      "Eseul rămâne aici. Listele lungi — case de familie, orchestre mai vechi, scaune de odinioară — trăiesc în arhivă, țară cu țară. Alege o țară. Cine e conectat poate adăuga un nume; așteaptă la biroul proprietarului.",
    moreHistory: "Mai multă istorie? Mergi la",
    festivalArtists: "Artiști de festival",
    addToHouse: "Adaugă la o casă",
    addToThisHouse: "Adaugă la casa asta",
    addMemory: "Adaugă un nume, o amintire sau o dată.",
    suggestPhoto: "Propune o fotografie",
  },
  sr: {
    archiveKicker: "Arhiva",
    archiveTitle: "Arhiva zemalja",
    archiveBody:
      "Esej ostaje ovde. Dugačke liste — porodične kuće, stariji orkestri, nekadašnje stolice — žive u arhivi, zemlja po zemlja. Izaberi zemlju. Ko je ulogovan može dodati ime; čeka na stolu vlasnika.",
    moreHistory: "Više istorije? Idi na",
    festivalArtists: "Festival umetnici",
    addToHouse: "Dodaj kući",
    addToThisHouse: "Dodaj ovoj kući",
    addMemory: "Dodaj ime, sećanje ili datum.",
    suggestPhoto: "Predloži fotografiju",
  },
  hr: {
    archiveKicker: "Arhiva",
    archiveTitle: "Arhiva zemalja",
    archiveBody:
      "Esej ostaje ovdje. Duge liste — obiteljske kuće, stariji orkestri, nekadašnje stolice — žive u arhivi, zemlja po zemlja. Odaberi zemlju. Tko je prijavljen može dodati ime; čeka na stolu vlasnika.",
    moreHistory: "Više povijesti? Idi na",
    festivalArtists: "Festival umjetnici",
    addToHouse: "Dodaj kući",
    addToThisHouse: "Dodaj ovoj kući",
    addMemory: "Dodaj ime, sjećanje ili datum.",
    suggestPhoto: "Predloži fotografiju",
  },
  ru: {
    archiveKicker: "Архив",
    archiveTitle: "Архив стран",
    archiveBody:
      "Эссе остаётся здесь. Длинные списки — семейные дома, старые оркестры, прежние стулья — живут в архиве, страна за страной. Выбери страну. Вошедшие могут добавить имя; оно ждёт на столе владельца.",
    moreHistory: "Больше истории? Перейди на",
    festivalArtists: "Фестивальные артисты",
    addToHouse: "Добавить к дому",
    addToThisHouse: "Добавить к этому дому",
    addMemory: "Добавь имя, воспоминание или дату.",
    suggestPhoto: "Предложить фотографию",
  },
  ja: {
    archiveKicker: "アーカイブ",
    archiveTitle: "国別アーカイブ",
    archiveBody:
      "本文はここに残る。長い名簿 — 家系、古い楽団、かつての椅子 — は国ごとのアーカイブにある。国を選ぶ。ログインした会員は名前を足せる。オーナーの机で待つ。",
    moreHistory: "もっと歴史は",
    festivalArtists: "フェスティバルの演奏者",
    addToHouse: "家に足す",
    addToThisHouse: "この家に足す",
    addMemory: "名前、記憶、日付を足す。",
    suggestPhoto: "写真を提案",
  },
  ko: {
    archiveKicker: "아카이브",
    archiveTitle: "나라별 아카이브",
    archiveBody:
      "글은 여기에 남는다. 긴 명단 — 가문, 옛 오케스트라, 지난 자리 — 는 나라별 아카이브에 있다. 나라를 고른다. 로그인한 회원은 이름을 더할 수 있고, 주인 책상에서 기다린다.",
    moreHistory: "역사가 더 필요하면",
    festivalArtists: "페스티벌 연주자",
    addToHouse: "집에 더하기",
    addToThisHouse: "이 집에 더하기",
    addMemory: "이름, 기억, 날짜를 더하세요.",
    suggestPhoto: "사진 제안",
  },
  zh: {
    archiveKicker: "档案",
    archiveTitle: "各国档案",
    archiveBody:
      "正文留在这里。长名单——家族、旧乐团、从前的席位——在档案里，一国一国。选一个国家。登录会员可以加一个名字，它会在主理人桌上等候。",
    moreHistory: "还要更多历史？前往",
    festivalArtists: "音乐节乐手",
    addToHouse: "加到一家",
    addToThisHouse: "加到这家",
    addMemory: "加一个名字、一段记忆或一个日期。",
    suggestPhoto: "建议一张照片",
  },
  "zh-tw": {
    archiveKicker: "檔案",
    archiveTitle: "各國檔案",
    archiveBody:
      "正文留在這裡。長名單——家族、舊樂團、從前的席位——在檔案裡，一國一國。選一個國家。登入會員可以加一個名字，它會在主理人桌上等候。",
    moreHistory: "還要更多歷史？前往",
    festivalArtists: "音樂節樂手",
    addToHouse: "加到一家",
    addToThisHouse: "加到這家",
    addMemory: "加一個名字、一段記憶或一個日期。",
    suggestPhoto: "建議一張照片",
  },
  id: {
    archiveKicker: "Arsip",
    archiveTitle: "Arsip negara",
    archiveBody:
      "Esai tetap di sini. Daftar panjang — rumah keluarga, orkes lama, kursi dulu — hidup di arsip, negara demi negara. Pilih negara. Member yang masuk dapat menambah nama; menunggu di meja pemilik.",
    moreHistory: "Mau lebih banyak sejarah? Pergi ke",
    festivalArtists: "Artis festival",
    addToHouse: "Tambah ke rumah",
    addToThisHouse: "Tambah ke rumah ini",
    addMemory: "Tambah nama, kenangan, atau tanggal.",
    suggestPhoto: "Usulkan foto",
  },
  th: {
    archiveKicker: "คลัง",
    archiveTitle: "คลังตามประเทศ",
    archiveBody:
      "บทความอยู่ที่นี่ รายชื่อยาว — บ้านตระกูล วงเก่า ที่นั่งเมื่อก่อน — อยู่ในคลัง ประเทศต่อประเทศ เลือกประเทศ สมาชิกที่เข้าสู่ระบบเพิ่มชื่อได้ มันรอที่โต๊ะเจ้าของ",
    moreHistory: "อยากได้อีกประวัติ? ไปที่",
    festivalArtists: "ศิลปินเทศกาล",
    addToHouse: "เพิ่มเข้าบ้าน",
    addToThisHouse: "เพิ่มเข้าบ้านนี้",
    addMemory: "เพิ่มชื่อ ความทรงจำ หรือวันที่",
    suggestPhoto: "เสนอภาพ",
  },
  he: {
    archiveKicker: "ארכיון",
    archiveTitle: "ארכיון המדינות",
    archiveBody:
      "המסה נשארת כאן. הרשימות הארוכות — בתי משפחה, תזמורות ישנות, כיסאות של פעם — חיות בארכיון, מדינה מדינה. בחר מדינה. חברים מחוברים יכולים להוסיף שם; הוא ממתין על שולחן הבעלים.",
    moreHistory: "עוד היסטוריה? לכו אל",
    festivalArtists: "אמני פסטיבל",
    addToHouse: "הוסף לבית",
    addToThisHouse: "הוסף לבית הזה",
    addMemory: "הוסף שם, זיכרון או תאריך.",
    suggestPhoto: "הצע תצלום",
  },
};

export const HISTORY_HOUSES: Record<string, Record<string, HistoryHouse>> = {
  en: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: {
      name: "Germany",
      label: "German Sinti after the war — Schnuckenack, Häns’che, Titi.",
    },
    "low-countries": {
      name: "Low Countries",
      label: "The Netherlands and Belgium — the Rosenberg, Schäfer, Basily, Limberger and Ferret-Lafertin lines.",
    },
    midi: {
      name: "Midi and Alsace",
      label: "The southern French school, and the Alsatian Manouche guitar.",
    },
  },
  nl: {
    paris: { name: "Parijs", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: {
      name: "Duitsland",
      label: "Duitse Sinti na de oorlog — Schnuckenack, Häns’che, Titi.",
    },
    "low-countries": {
      name: "Lage Landen",
      label: "Nederland en België — de lijnen Rosenberg, Schäfer, Basily, Limberger en Ferret-Lafertin.",
    },
    midi: {
      name: "Midi en de Elzas",
      label: "De Zuid-Franse school, en de Elzasser Manouche-gitaar.",
    },
  },
  fr: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: {
      name: "Allemagne",
      label: "Sinti allemands après la guerre — Schnuckenack, Häns’che, Titi.",
    },
    "low-countries": {
      name: "Pays-Bas et Belgique",
      label: "Les Pays-Bas et la Belgique — les lignées Rosenberg, Schäfer, Basily, Limberger et Ferret-Lafertin.",
    },
    midi: {
      name: "Midi et Alsace",
      label: "L’école du sud de la France, et la guitare manouche alsacienne.",
    },
  },
  de: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: {
      name: "Deutschland",
      label: "Deutsche Sinti nach dem Krieg — Schnuckenack, Häns’che, Titi.",
    },
    "low-countries": {
      name: "Niederlande und Belgien",
      label: "Niederlande und Belgien — die Linien Rosenberg, Schäfer, Basily, Limberger und Ferret-Lafertin.",
    },
    midi: {
      name: "Midi und Elsass",
      label: "Die südfranzösische Schule und die elsässische Manouche-Gitarre.",
    },
  },
  es: {
    paris: { name: "París", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: {
      name: "Alemania",
      label: "Sinti alemanes después de la guerra — Schnuckenack, Häns’che, Titi.",
    },
    "low-countries": {
      name: "Países Bajos y Bélgica",
      label: "Países Bajos y Bélgica — las líneas Rosenberg, Schäfer, Basily, Limberger y Ferret-Lafertin.",
    },
    midi: {
      name: "Midi y Alsacia",
      label: "La escuela del sur de Francia y la guitarra manouche alsaciana.",
    },
  },
  pt: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Alemanha", label: "Sinti alemães depois da guerra — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Países Baixos e Bélgica",
      label: "Países Baixos e Bélgica — as linhas Rosenberg, Schäfer, Basily, Limberger e Ferret-Lafertin.",
    },
    midi: { name: "Midi e Alsácia", label: "A escola do sul de França e a guitarra manouche alsaciana." },
  },
  it: {
    paris: { name: "Parigi", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Germania", label: "Sinti tedeschi dopo la guerra — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Paesi Bassi e Belgio",
      label: "Paesi Bassi e Belgio — le linee Rosenberg, Schäfer, Basily, Limberger e Ferret-Lafertin.",
    },
    midi: { name: "Midi e Alsazia", label: "La scuola del sud della Francia e la chitarra manouche alsaziana." },
  },
  hu: {
    paris: { name: "Párizs", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Németország", label: "Német sintik a háború után — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Németalföld",
      label: "Hollandia és Belgium — Rosenberg, Schäfer, Basily, Limberger és Ferret-Lafertin vonalak.",
    },
    midi: { name: "Midi és Elzász", label: "A dél-francia iskola és az elzászi manouche gitár." },
  },
  pl: {
    paris: { name: "Paryż", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Niemcy", label: "Niemieccy Sinti po wojnie — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Niderlandy i Belgia",
      label: "Niderlandy i Belgia — linie Rosenberg, Schäfer, Basily, Limberger i Ferret-Lafertin.",
    },
    midi: { name: "Midi i Alzacja", label: "Szkoła południowej Francji i alzacka gitara manouche." },
  },
  cs: {
    paris: { name: "Paříž", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Německo", label: "Němečtí Sinti po válce — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Nizozemí a Belgie",
      label: "Nizozemsko a Belgie — linie Rosenberg, Schäfer, Basily, Limberger a Ferret-Lafertin.",
    },
    midi: { name: "Midi a Alsasko", label: "Jihofrancouzská škola a alsaská manouche kytara." },
  },
  ro: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Germania", label: "Sinti germani după război — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Țările de Jos și Belgia",
      label: "Țările de Jos și Belgia — liniile Rosenberg, Schäfer, Basily, Limberger și Ferret-Lafertin.",
    },
    midi: { name: "Midi și Alsacia", label: "Școala din sudul Franței și chitara manouche alsaciană." },
  },
  sr: {
    paris: { name: "Pariz", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Nemačka", label: "Nemački Sinti posle rata — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Niske Zemlje",
      label: "Holandija i Belgija — linije Rosenberg, Schäfer, Basily, Limberger i Ferret-Lafertin.",
    },
    midi: { name: "Midi i Alsace", label: "Južnofrancuska škola i alsace manouche gitara." },
  },
  hr: {
    paris: { name: "Pariz", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Njemačka", label: "Njemački Sinti poslije rata — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Niske Zemlje",
      label: "Nizozemska i Belgija — linije Rosenberg, Schäfer, Basily, Limberger i Ferret-Lafertin.",
    },
    midi: { name: "Midi i Alsace", label: "Južnofrancuska škola i alsace manouche gitara." },
  },
  ru: {
    paris: { name: "Париж", label: "" },
    forbach: { name: "Форбах", label: "" },
    germany: { name: "Германия", label: "Немецкие синти после войны — Шнукенак, Хенше, Тити." },
    "low-countries": {
      name: "Нидерланды и Бельгия",
      label: "Нидерланды и Бельгия — линии Розенберг, Шефер, Базили, Лимбергер и Ферре-Лафертен.",
    },
    midi: { name: "Миди и Эльзас", label: "Южнофранцузская школа и эльзасская гитара мануш." },
  },
  ja: {
    paris: { name: "パリ", label: "" },
    forbach: { name: "フォルバック", label: "" },
    germany: { name: "ドイツ", label: "戦後のドイツ・シンティ — シュヌケナック、ヘンシェ、ティティ。" },
    "low-countries": {
      name: "低地諸国",
      label: "オランダとベルギー — ローゼンベルク、シェーファー、バシリ、リンベルガー、フェレ＝ラフェルタンの系。",
    },
    midi: { name: "ミディとアルザス", label: "南仏の流派と、アルザスのマヌーシュ・ギター。" },
  },
  ko: {
    paris: { name: "파리", label: "" },
    forbach: { name: "포르바흐", label: "" },
    germany: { name: "독일", label: "전후 독일 신티 — 슈누케낙, 헨셰, 티티." },
    "low-countries": {
      name: "저지대",
      label: "네덜란드와 벨기에 — 로젠버그, 셰퍼, 바실리, 림베르거, 페레-라페르탱 가문.",
    },
    midi: { name: "미디와 알자스", label: "남프랑스 학파와 알자스 마누슈 기타." },
  },
  zh: {
    paris: { name: "巴黎", label: "" },
    forbach: { name: "福尔巴克", label: "" },
    germany: { name: "德国", label: "战后德国辛提——施努肯纳克、亨舍、蒂蒂。" },
    "low-countries": {
      name: "低地国家",
      label: "荷兰与比利时——罗森伯格、谢弗、巴西利、林贝格与费雷-拉费尔坦一系。",
    },
    midi: { name: "米迪与阿尔萨斯", label: "法国南部流派，以及阿尔萨斯马努什吉他。" },
  },
  "zh-tw": {
    paris: { name: "巴黎", label: "" },
    forbach: { name: "福爾巴克", label: "" },
    germany: { name: "德國", label: "戰後德國辛提——施努肯納克、亨舍、蒂蒂。" },
    "low-countries": {
      name: "低地國家",
      label: "荷蘭與比利時——羅森伯格、謝弗、巴西利、林貝格與費雷-拉費爾坦一系。",
    },
    midi: { name: "米迪與阿爾薩斯", label: "法國南部流派，以及阿爾薩斯馬努什吉他。" },
  },
  id: {
    paris: { name: "Paris", label: "" },
    forbach: { name: "Forbach", label: "" },
    germany: { name: "Jerman", label: "Sinti Jerman setelah perang — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "Negara-Negara Rendah",
      label: "Belanda dan Belgia — garis Rosenberg, Schäfer, Basily, Limberger dan Ferret-Lafertin.",
    },
    midi: { name: "Midi dan Alsace", label: "Aliran Prancis selatan, dan gitar Manouche Alsace." },
  },
  th: {
    paris: { name: "ปารีส", label: "" },
    forbach: { name: "ฟอร์บัค", label: "" },
    germany: { name: "เยอรมนี", label: "ซินติเยอรมันหลังสงคราม — Schnuckenack, Häns’che, Titi." },
    "low-countries": {
      name: "เนเธอร์แลนด์และเบลเยียม",
      label: "เนเธอร์แลนด์และเบลเยียม — สาย Rosenberg, Schäfer, Basily, Limberger และ Ferret-Lafertin.",
    },
    midi: { name: "มิดิและอัลซัส", label: "สำนักฝรั่งเศสใต้ และกีตาร์มานูชอัลซัส." },
  },
  he: {
    paris: { name: "פריז", label: "" },
    forbach: { name: "פורבאך", label: "" },
    germany: { name: "גרמניה", label: "סינטי גרמנים אחרי המלחמה — שנקנאק, הנשה, טיטי." },
    "low-countries": {
      name: "ארצות השפלה",
      label: "הולנד ובלגיה — קווי רוזנברג, שפר, באסילי, לימברגר ופרה-לפרטין.",
    },
    midi: { name: "מידי ואלזס", label: "אסכולת דרום צרפת וגיטרת המנוּש האלזסית." },
  },
};

/** Sections that were still English on every language. */
export const HISTORY_GAP_STORY: Record<string, Record<string, HistoryBlock>> = {
  nl: {
    "Origins and the long road": {
      title: "Oorsprong en de lange weg",
      body: [
        "Taal- en genetisch onderzoek wijst naar een herkomst in noordwest-India, meer dan duizend jaar geleden. Groepen trokken langzaam westwaarts door Perzië, Armenië en de Byzantijnse wereld, en bereikten de Balkan in de late middeleeuwen. Vanaf de vroege vijftiende eeuw verschijnen schriftelijke sporen in West-Europa. In 1417 wordt een groep in Hildesheim genoemd. In 1420 staan ze in Nederland en België. In 1427 komt een groter gezelschap bij Parijs aan. In de kronieken heetten deze reizigers vaak “Egyptenaren”. Onderling werden ze later Sinti in de Duitstalige landen en Manouche in Frankrijk.",
      ],
    },
    "Life in Western Europe": {
      title: "Leven in West-Europa",
      body: [
        "In de eeuwen daarna vestigden de Sinti een doorlopende aanwezigheid in Duitsland, Frankrijk, Nederland en België. Velen bleven rondtrekken, als ambachtslui, paardenhandelaren en muzikanten. Anderen vestigden zich en hielden sterke familienetwerken over de grenzen. Muziek stond centraal. Kleine strijkensembles — violen, later gitaren, en contrabas — speelden voor dans, kermis en privéfeesten. Het repertoire nam lokale kleuren op: Hongaars getinte toonladders, Franse musettewalsen, Duitse en Nederlandse volksliedjes. De kern bleef herkenbaar Sinti, van ouder op kind, op het gehoor.",
      ],
    },
    "What to call it": {
      title: "Hoe je het noemt",
      body: [
        "De families wachtten niet op een criticus die de muziek een naam gaf. Op platen ging het later gypsy jazz heten, of jazz manouche. Gypsy is het woord van buiten. Sinti, in de Duitstalige landen, en Manouche, in Frankrijk, zijn de woorden die veel families voor zichzelf gebruiken. Dit huis is geen Balkanbrass, geen flamenco, geen Hongaars restaurantorkest, ook als die kleuren door dezelfde handen gaan. Het is Sinti- en Manouche-muziek, in de jaren dertig gebouwd op ouder familiespel, en nog steeds bewoond.",
      ],
    },
    "The guitar and the pompe": {
      title: "De gitaar en de pompe",
      body: [
        "De stijl heeft een lichaam dat je vast kunt houden. Begin jaren dertig tekende Mario Maccaferri een stalen-snarengitaar voor de Selmer-winkel in Parijs: een cutaway, een binnenresonator, eerst een brede D-klankopening, later een kleinere ovaal. Maccaferri verliet de firma in 1933. Selmer hield het ovaal-model. Django speelde het. De gitaar was luid genoeg voor een danszaal zonder pickup. Spelers van deze muziek zoeken die vorm nog, of een eerlijke kopie.",
        "De rechterhand van de ritmegitaar is la pompe. Een downstroke die landt als een bassdrum, een lichte vangst als een snare, geen drummer nodig. Niemand leert het van een bladzijde. Je kijkt naar een oom tot de zaal vastzit, dan kunnen viool en leadgitaar de grond verlaten.",
      ],
    },
    "The war against the Sinti": {
      title: "De oorlog tegen de Sinti",
      body: [
        "De muziek kwam de jaren veertig niet ongedeerd door. In het Duitstalige Europa joeg de nazistaat op Sinti en Roma. Families werden geregistreerd, gedeporteerd en vermoord. In Auschwitz-Birkenau zat een familiekamp van ongeveer drieëntwintigduizend mensen; bijna niemand kwam thuis. Het dodental in Europa loopt in de honderdduizenden. Dit is geen voetnoot bij de platen. Daarom behandelden zoveel Duitse Sinti-spelers van de volgende generatie Django’s deuntjes als overleven, niet als nostalgie.",
        "Django bleef in bezet Frankrijk. Bekendheid, beschermers en geluk hielden hem in leven in een land dat Romani-mensen de dood in stuurde. Grappelli was in Londen. Het Quintette zoals het was, was voorbij.",
        "Franz “Schnuckenack” Reinhardt, een Duitse Sinti-violist en verwant van Django’s lijn, heeft hem nooit ontmoet. In 1938 werd zijn familie naar het oosten gedreven. Ze leefden in Częstochowa onder valse papieren, altijd in beweging. Hij ontkwam meer dan eens aan de kogel. Een jongere broer niet: Auschwitz. Na de oorlog zette Schnuckenack de muziek op Duitse podia, zodat een publiek dat haar had willen wissen haar moest horen.",
      ],
    },
    "The unrecorded": {
      title: "Wat nooit is opgenomen",
      body: [
        "Het meeste van deze muziek heeft nooit een microfoon gezien. Waso Grünholz is het bekende geval op deze pagina. Er waren anderen: een oom op ritme, een neef die een wals kende zonder titel, een zanger die de familiecirkel nooit verliet. Het archief is de familie. De platen zijn wat eruit lekte.",
        "Deze geschiedenis eindigt niet in het verleden. Ze gaat door telkens als een jonge speler een gitaar of viool oppakt en het ritme leert zoals het altijd is geleerd: op het gehoor, uit het hart, van de mensen die ervoor kwamen.",
      ],
    },
    Forbach: {
      title: "Forbach",
      body: [
        "Forbach is een stad in de Moezel, aan de Duitse grens. Veel van de Sinti-gitaar uit Oost-Frankrijk komt uit de families daar — Winterstein, Schmitt, Reinhardt, Mehrstein.",
        "Mensen zeggen Forbach-stijl als ze een zware pompe bedoelen: familieritme, lead erbovenop, geen café-pickupband. Hono Winterstein werd in 1962 in Forbach geboren. Hij speelde dat ritme voor Dorado Schmitt, Tchavolo Schmitt, en vanaf 2001 voor Biréli Lagrène, inclusief tours in de Verenigde Staten en Japan. Zijn broer Popots (Jean-Louis, geboren 1964) begon met Dorado in Metz in 1980. Popots’ zoon Benji speelt ritme. Brady, Hono’s neef, speelt lead in Hono’s trio.",
        "In 2018 begonnen Popots en Daniel Fioriti een jazz-manouchefestival in de Burghof in de stad. ’s Middags is het vrij. Avonden zijn met kaartje. Het is Forbachs eigen festival, geen klein Samois.",
        "Titi Winterstein, de Duitse violist (1956–2008), is dezelfde naam aan de andere kant van de grens. Häns’che Weiss nam hem op vijftienjarige leeftijd in het kwintet. Zijn neven Holzmanno en Ziroli speelden gitaar. De Duitse platen uit de jaren zeventig — Schnuckenack, Häns’che, Titi — horen bij dit verhaal. Forbach is het Frans-Moezelhuis van die Sinti-wereld.",
      ],
    },
  },
  fr: {
    "Origins and the long road": {
      title: "Origines et la longue route",
      body: [
        "La linguistique et la génétique indiquent une origine dans le nord-ouest de l’Inde, il y a plus de mille ans. Des groupes avancèrent vers l’ouest par la Perse, l’Arménie et le monde byzantin, et atteignirent les Balkans à la fin du Moyen Âge. Dès le début du XVe siècle, des traces écrites apparaissent en Europe de l’Ouest. En 1417 un groupe est nommé à Hildesheim. En 1420 on les inscrit aux Pays-Bas et en Belgique. En 1427 un cortège plus large arrive près de Paris. Les chroniques les appelaient souvent « Égyptiens ». Entre eux ils devinrent plus tard Sinti dans les pays germanophones et Manouches en France.",
      ],
    },
    "Life in Western Europe": {
      title: "La vie en Europe de l’Ouest",
      body: [
        "Au fil des siècles les Sinti établirent une présence continue en Allemagne, en France, aux Pays-Bas et en Belgique. Beaucoup restèrent mobiles, artisans, marchands de chevaux, musiciens. D’autres s’installèrent en gardant de forts réseaux familiaux par-delà les frontières. La musique était au centre. De petits ensembles à cordes — violons, plus tard guitares, et contrebasse — jouaient pour les danses, les foires, les réunions. Le répertoire prenait des couleurs locales : gammes à teinte hongroise, valses musette, airs allemands et néerlandais. Le cœur restait sinté, de parent à enfant, à l’oreille.",
      ],
    },
    "What to call it": {
      title: "Comment l’appeler",
      body: [
        "Les familles n’ont pas attendu un critique pour nommer la musique. Les disques ont dit plus tard gypsy jazz, ou jazz manouche. Gypsy est le mot du dehors. Sinti, dans les pays germanophones, et Manouche, en France, sont les mots que beaucoup de familles emploient pour elles-mêmes. Cette maison n’est pas le brass des Balkans, ni le flamenco, ni l’orchestre de restaurant hongrois, même quand ces couleurs passent par les mêmes mains. C’est une musique sinté et manouche, bâtie dans les années 1930 sur un jeu de famille plus ancien, et encore habitée.",
      ],
    },
    "The guitar and the pompe": {
      title: "La guitare et la pompe",
      body: [
        "Le style a un corps qu’on peut tenir. Au début des années 1930 Mario Maccaferri dessine une guitare à cordes acier pour Selmer à Paris : un cutaway, un résonateur interne, d’abord une large ouïe en D, plus tard un ovale plus petit. Maccaferri quitte la maison en 1933. Selmer garde le modèle à ouïe ovale. Django le joue. La guitare porte assez fort pour une salle de danse sans micro. Les joueurs de cette musique cherchent encore cette forme, ou une copie honnête.",
        "La main droite de la guitare rythme, c’est la pompe. Un downstroke qui tombe comme une grosse caisse, une reprise légère comme une caisse claire, pas besoin de batteur. Personne ne l’apprend sur une page. On regarde un oncle jusqu’à ce que la salle se verrouille, alors le violon et la guitare solo peuvent quitter le sol.",
      ],
    },
    "The war against the Sinti": {
      title: "La guerre contre les Sinti",
      body: [
        "La musique n’a pas traversé les années 1940 indemne. Dans l’Europe germanophone l’État nazi a chassé Sinti et Roms. Des familles ont été recensées, déportées, assassinées. À Auschwitz-Birkenau un camp familial a tenu environ vingt-trois mille personnes ; presque aucune n’est rentrée. Le total des morts en Europe se compte en centaines de milliers. Ce n’est pas une note en bas de page des disques. C’est pourquoi tant de Sinti allemands de la génération suivante ont tenu les airs de Django comme une survie, pas une nostalgie.",
        "Django est resté en France occupée. La célébrité, des protecteurs et la chance l’ont tenu en vie dans un pays qui envoyait les Romani à la mort. Grappelli était à Londres. Le Quintette tel qu’il était n’existait plus.",
        "Franz « Schnuckenack » Reinhardt, violoniste sinté allemand parent de la lignée de Django, ne l’a jamais rencontré. En 1938 sa famille a été poussée vers l’est. Ils ont vécu à Częstochowa sous un faux papier, toujours en mouvement. Il a échappé plus d’une fois aux balles. Un frère cadet non : Auschwitz. Après la guerre Schnuckenack a mis la musique sur les scènes allemandes pour qu’un public qui avait voulu l’effacer doive l’entendre.",
      ],
    },
    "The unrecorded": {
      title: "Ce qui n’a jamais été enregistré",
      body: [
        "La plus grande part de cette musique n’a jamais vu de micro. Waso Grünholz est le cas célèbre de cette page. Il y en a eu d’autres : un oncle à la pompe, un cousin qui savait une valse sans titre, un chanteur qui n’a jamais quitté le cercle. L’archive, c’est la famille. Les disques sont ce qui a fuité.",
        "Cette histoire ne s’arrête pas dans le passé. Elle continue chaque fois qu’un jeune prend une guitare ou un violon et apprend le rythme comme on l’a toujours appris : à l’oreille, par cœur, auprès de ceux qui sont venus avant.",
      ],
    },
    Forbach: {
      title: "Forbach",
      body: [
        "Forbach est une ville de Moselle, à la frontière allemande. Une grande part de la guitare sinté de l’est de la France vient des familles là-bas — Winterstein, Schmitt, Reinhardt, Mehrstein.",
        "On dit style Forbach pour une pompe lourde : rythme de famille, solo au-dessus, pas un orchestre de café. Hono Winterstein naît à Forbach en 1962. Il a tenu ce rythme pour Dorado Schmitt, Tchavolo Schmitt, et dès 2001 pour Biréli Lagrène, y compris aux États-Unis et au Japon. Son frère Popots (Jean-Louis, né en 1964) commence avec Dorado à Metz en 1980. Benji, le fils de Popots, joue le rythme. Brady, neveu de Hono, joue le solo dans le trio de Hono.",
        "En 2018 Popots et Daniel Fioriti lancent un festival de jazz manouche au Burghof. L’après-midi est libre. Les soirs sont payants. C’est le festival de Forbach, pas un petit Samois.",
        "Titi Winterstein, le violoniste allemand (1956–2008), porte le même nom de l’autre côté de la frontière. Häns’che Weiss le prend dans le quintette à quinze ans. Ses cousins Holzmanno et Ziroli jouent de la guitare. Les disques allemands des années 1970 — Schnuckenack, Häns’che, Titi — appartiennent à cette histoire. Forbach est la maison mosellane de ce monde sinté.",
      ],
    },
  },
  de: {
    "Origins and the long road": {
      title: "Ursprung und der lange Weg",
      body: [
        "Sprache und Genetik deuten auf einen Ursprung im nordwestlichen Indien vor mehr als tausend Jahren. Gruppen zogen langsam westwärts durch Persien, Armenien und die byzantinische Welt und erreichten den Balkan im späten Mittelalter. Ab dem frühen 15. Jahrhundert erscheinen schriftliche Spuren in Westeuropa. 1417 wird eine Gruppe in Hildesheim genannt. 1420 stehen sie in den Niederlanden und Belgien. 1427 kommt eine größere Gesellschaft bei Paris an. In den Chroniken hießen diese Reisenden oft „Ägypter“. Unter sich wurden sie später Sinti in den deutschsprachigen Ländern und Manouche in Frankreich.",
      ],
    },
    "Life in Western Europe": {
      title: "Leben in Westeuropa",
      body: [
        "Über die Jahrhunderte etablierten die Sinti eine durchgehende Präsenz in Deutschland, Frankreich, den Niederlanden und Belgien. Viele blieben unterwegs, als Handwerker, Pferdehändler und Musiker. Andere siedelten und hielten starke Familiennetze über die Grenzen. Musik stand im Zentrum. Kleine Streicherensembles — Geigen, später Gitarren, und Kontrabass — spielten zu Tanz, Jahrmarkt und privaten Feiern. Das Repertoire nahm lokale Farben auf: ungarisch gefärbte Tonleitern, französische Musettewalzer, deutsche und niederländische Weisen. Der Kern blieb erkennbar Sinti, von Eltern zu Kind, nach Gehör.",
      ],
    },
    "What to call it": {
      title: "Wie man es nennt",
      body: [
        "Die Familien warteten nicht auf einen Kritiker, der der Musik einen Namen gab. Auf Platten hieß es später Gypsy Jazz oder Jazz Manouche. Gypsy ist das Wort von außen. Sinti, in den deutschsprachigen Ländern, und Manouche, in Frankreich, sind die Wörter, die viele Familien für sich selbst brauchen. Dieses Haus ist kein Balkan-Brass, kein Flamenco, kein ungarisches Restaurantorchester, auch wenn diese Farben durch dieselben Hände gehen. Es ist Sinti- und Manouche-Musik, in den 1930ern auf älterem Familienspiel gebaut, und noch bewohnt.",
      ],
    },
    "The guitar and the pompe": {
      title: "Die Gitarre und die Pompe",
      body: [
        "Der Stil hat einen Körper, den man halten kann. Anfang der 1930er zeichnete Mario Maccaferri eine Stahlsaitengitarre für Selmer in Paris: Cutaway, Innenresonator, zuerst ein breites D-Schallloch, später ein kleineres Oval. Maccaferri verließ die Firma 1933. Selmer behielt das Oval-Modell. Django spielte es. Die Gitarre war laut genug für einen Tanzsaal ohne Pickup. Spieler dieser Musik suchen diese Form noch, oder eine ehrliche Kopie.",
        "Die rechte Hand der Rhythmusgitarre ist la pompe. Ein Downstroke wie eine Bassdrum, ein leichter Fang wie eine Snare, kein Schlagzeuger nötig. Niemand lernt es von einer Seite. Man schaut einem Onkel zu, bis der Raum einrastet, dann können Geige und Leadgitarre den Boden verlassen.",
      ],
    },
    "The war against the Sinti": {
      title: "Der Krieg gegen die Sinti",
      body: [
        "Die Musik kam unbeschadet nicht durch die 1940er. Im deutschsprachigen Europa jagte der NS-Staat Sinti und Roma. Familien wurden erfasst, deportiert und ermordet. In Auschwitz-Birkenau lag ein Familienlager mit etwa dreiundzwanzigtausend Menschen; fast niemand kam heim. Die Toten in Europa zählen nach Hunderttausenden. Das ist keine Fußnote zu den Platten. Deshalb behandelten so viele deutsche Sinti-Spieler der nächsten Generation Djangos Weisen als Überleben, nicht als Nostalgie.",
        "Django blieb im besetzten Frankreich. Ruhm, Gönner und Glück hielten ihn am Leben in einem Land, das Romani-Menschen in den Tod schickte. Grappelli war in London. Das Quintette, wie es gewesen war, war vorbei.",
        "Franz „Schnuckenack“ Reinhardt, ein deutscher Sinti-Geiger und verwandt mit Djangos Linie, hat ihn nie getroffen. 1938 wurde seine Familie nach Osten getrieben. Sie lebten in Częstochowa unter falschem Papier, immer in Bewegung. Er entkam mehr als einmal den Kugeln. Ein jüngerer Bruder nicht: Auschwitz. Nach dem Krieg setzte Schnuckenack die Musik auf deutsche Bühnen, damit ein Publikum, das sie hatte tilgen wollen, sie hören musste.",
      ],
    },
    "The unrecorded": {
      title: "Was nie aufgenommen wurde",
      body: [
        "Das meiste dieser Musik hat nie ein Mikrofon gesehen. Waso Grünholz ist der bekannte Fall auf dieser Seite. Es gab andere: ein Onkel am Rhythmus, ein Cousin, der einen Walzer ohne Titel kannte, ein Sänger, der den Familienkreis nie verließ. Das Archiv ist die Familie. Die Platten sind, was herauslief.",
        "Diese Geschichte endet nicht in der Vergangenheit. Sie geht weiter, jedes Mal wenn ein junger Spieler eine Gitarre oder Geige nimmt und den Rhythmus lernt, wie er immer gelernt wurde: nach Gehör, aus dem Herzen, von denen, die vorher kamen.",
      ],
    },
    Forbach: {
      title: "Forbach",
      body: [
        "Forbach ist eine Moselstadt an der deutschen Grenze. Viel der Sinti-Gitarre aus Ostfrankreich kommt aus den Familien dort — Winterstein, Schmitt, Reinhardt, Mehrstein.",
        "Man sagt Forbach-Stil, wenn eine schwere Pompe gemeint ist: Familienrhythmus, Lead obenauf, keine Café-Pickupband. Hono Winterstein wurde 1962 in Forbach geboren. Er spielte diesen Rhythmus für Dorado Schmitt, Tchavolo Schmitt und ab 2001 für Biréli Lagrène, auch in den Vereinigten Staaten und Japan. Sein Bruder Popots (Jean-Louis, geboren 1964) begann 1980 mit Dorado in Metz. Popots’ Sohn Benji spielt Rhythmus. Brady, Honos Neffe, spielt Lead in Honos Trio.",
        "2018 gründeten Popots und Daniel Fioriti ein Jazz-Manouche-Festival im Burghof der Stadt. Nachmittags frei. Abends mit Karte. Es ist Forbachs eigenes Festival, kein kleines Samois.",
        "Titi Winterstein, der deutsche Geiger (1956–2008), ist derselbe Name auf der anderen Seite der Grenze. Häns’che Weiss nahm ihn mit fünfzehn ins Quintett. Seine Cousins Holzmanno und Ziroli spielten Gitarre. Die deutschen Platten der 1970er — Schnuckenack, Häns’che, Titi — gehören zu dieser Geschichte. Forbach ist das französisch-moselländische Haus dieser Sinti-Welt.",
      ],
    },
  },
  es: {
    "Origins and the long road": {
      title: "Origen y el camino largo",
      body: [
        "La lingüística y la genética apuntan a un origen en el noroeste de la India hace más de mil años. Grupos avanzaron despacio hacia el oeste por Persia, Armenia y el mundo bizantino, y llegaron a los Balcanes a finales de la Edad Media. Desde principios del siglo XV aparecen rastros escritos en Europa occidental. En 1417 se nombra a un grupo en Hildesheim. En 1420 constan en los Países Bajos y Bélgica. En 1427 llega un cortejo más grande cerca de París. En las crónicas a estos viajeros se les llamaba a menudo «egipcios». Entre ellos pasaron a ser Sinti en los países de lengua alemana y Manouche en Francia.",
      ],
    },
    "Life in Western Europe": {
      title: "Vida en Europa occidental",
      body: [
        "A lo largo de los siglos los Sinti establecieron una presencia continua en Alemania, Francia, los Países Bajos y Bélgica. Muchos siguieron en movimiento, artesanos, tratantes de caballos y músicos. Otros se asentaron y guardaron redes familiares fuertes a través de las fronteras. La música era el centro. Pequeños conjuntos de cuerda — violines, más tarde guitarras, y contrabajo — tocaban para bailes, ferias y reuniones. El repertorio tomó colores locales: escalas de tinte húngaro, valses musette, aires alemanes y neerlandeses. El núcleo seguía siendo Sinti, de padre a hijo, de oído.",
      ],
    },
    "What to call it": {
      title: "Cómo llamarlo",
      body: [
        "Las familias no esperaron a un crítico para nombrar la música. En los discos pasó a decirse gypsy jazz, o jazz manouche. Gypsy es la palabra de fuera. Sinti, en los países de lengua alemana, y Manouche, en Francia, son las palabras que muchas familias usan para sí. Esta casa no es brass balcánico, ni flamenco, ni orquesta de restaurante húngaro, aunque esos colores pasen por las mismas manos. Es música Sinti y Manouche, construida en los años treinta sobre un toque de familia más antiguo, y todavía habitada.",
      ],
    },
    "The guitar and the pompe": {
      title: "La guitarra y la pompe",
      body: [
        "El estilo tiene un cuerpo que se puede sostener. A principios de los años treinta Mario Maccaferri dibujó una guitarra de cuerdas de acero para Selmer en París: cutaway, resonador interno, primero una boca ancha en D, luego un óvalo más pequeño. Maccaferri dejó la casa en 1933. Selmer guardó el modelo de boca oval. Django la tocó. La guitarra sonaba lo bastante para una sala de baile sin pastilla. Quien toca esta música sigue buscando esa forma, o una copia honesta.",
        "La mano derecha de la guitarra ritmo es la pompe. Un downstroke que cae como un bombo, un enganche ligero como una caja, sin batería. Nadie lo aprende de una página. Se mira a un tío hasta que la sala encaja; entonces el violín y la guitarra solista pueden dejar el suelo.",
      ],
    },
    "The war against the Sinti": {
      title: "La guerra contra los Sinti",
      body: [
        "La música no cruzó los años cuarenta ilesa. En la Europa de lengua alemana el Estado nazi persiguió a Sinti y Roma. Familias fueron registradas, deportadas y asesinadas. En Auschwitz-Birkenau un campo familiar reunió unos veintitrés mil; casi nadie volvió. El total de muertos en Europa se cuenta por cientos de miles. Esto no es una nota a pie de los discos. Por eso tantos Sinti alemanes de la generación siguiente trataron las piezas de Django como supervivencia, no como nostalgia.",
        "Django se quedó en la Francia ocupada. Fama, protectores y suerte lo mantuvieron vivo en un país que enviaba a los romaníes a la muerte. Grappelli estaba en Londres. El Quintette tal como era ya no existía.",
        "Franz «Schnuckenack» Reinhardt, violinista Sinti alemán pariente de la línea de Django, no lo conoció. En 1938 su familia fue empujada al este. Vivieron en Częstochowa con papeles falsos, siempre en movimiento. Escapó más de una vez a los disparos. Un hermano menor no: Auschwitz. Después de la guerra Schnuckenack puso la música en escenarios alemanes para que un público que había querido borrarla tuviera que oírla.",
      ],
    },
    "The unrecorded": {
      title: "Lo que nunca se grabó",
      body: [
        "La mayor parte de esta música nunca vio un micrófono. Waso Grünholz es el caso famoso de esta página. Hubo otros: un tío al ritmo, un primo que sabía un vals sin título, un cantante que nunca salió del círculo. El archivo es la familia. Los discos son lo que se filtró.",
        "Esta historia no termina en el pasado. Sigue cada vez que un joven coge una guitarra o un violín y aprende el ritmo como siempre se ha aprendido: de oído, de corazón, de quienes vinieron antes.",
      ],
    },
    Forbach: {
      title: "Forbach",
      body: [
        "Forbach es una ciudad de Mosela, en la frontera alemana. Gran parte de la guitarra Sinti del este de Francia sale de las familias de allí — Winterstein, Schmitt, Reinhardt, Mehrstein.",
        "Se dice estilo Forbach cuando se habla de una pompe pesada: ritmo de familia, solo encima, no una banda de café. Hono Winterstein nació en Forbach en 1962. Tocó ese ritmo para Dorado Schmitt, Tchavolo Schmitt y desde 2001 para Biréli Lagrène, también en Estados Unidos y Japón. Su hermano Popots (Jean-Louis, nacido en 1964) empezó con Dorado en Metz en 1980. El hijo de Popots, Benji, toca ritmo. Brady, sobrino de Hono, toca el solo en el trío de Hono.",
        "En 2018 Popots y Daniel Fioriti abrieron un festival de jazz manouche en el Burghof. Por la tarde es gratis. Por la noche hay entrada. Es el festival de Forbach, no un Samois pequeño.",
        "Titi Winterstein, el violinista alemán (1956–2008), es el mismo nombre al otro lado de la frontera. Häns’che Weiss lo metió en el quinteto a los quince. Sus primos Holzmanno y Ziroli tocaban guitarra. Los discos alemanes de los setenta — Schnuckenack, Häns’che, Titi — pertenecen a esta historia. Forbach es la casa moselana francesa de ese mundo Sinti.",
      ],
    },
  },
};

