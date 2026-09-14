export type LuthierPageCopy = {
  kicker: string;
  title: string;
  what: string;
  lead: string;
  craft: string;
  invite: string;
  listLead: string;
};

/** English is the source. Other locales follow this structure, not a rewrite. */
const EN: LuthierPageCopy = {
  kicker: "Community",
  title: "Luthiers",
  what: "A luthier is a craftsperson who builds and repairs string instruments by hand — guitars, violins, double basses. Not a factory. The atelier is the workshop.",
  lead: "The instrument makers behind the manouche scene. Workshops that build Selmer-Maccaferri style guitars.",
  craft: "What a luthier makes is more than an instrument. It is craft: choosing the wood, bending the top, hunting the right voice. Each guitar is a conversation between maker and wood.",
  invite: "Most luthiers are open to contact. Write or call — they like it when players think with them. An idea about a model, a wood, a change? Bring it in. That is the work.",
  listLead: "Names below, with website, email and phone. Open a page for photos, models and wait times.",
};

const NL: LuthierPageCopy = {
  kicker: "Community",
  title: "Luthiers",
  what: "Een luthier is een vakman die snaarinstrumenten met de hand bouwt en herstelt — gitaren, violen, contrabassen. Geen fabriek. Het atelier is de werkplaats.",
  lead: "De instrumentmakers achter de manouche-scene. Werkplaatsen die gitaren in Selmer-Maccaferri-stijl bouwen.",
  craft: "Wat een luthier maakt is meer dan een instrument. Het is ambacht: het hout kiezen, het bovenblad buigen, de juiste stem zoeken. Elke gitaar is een gesprek tussen bouwer en hout.",
  invite: "De meeste luthiers staan open voor contact. Schrijf of bel — ze vinden het fijn als spelers met hen meedenken. Een idee over een model, een hout, een verandering? Breng het in. Dat is het werk.",
  listLead: "Namen hieronder, met website, email en telefoon. Open een pagina voor foto’s, modellen en wachttijden.",
};

const FR: LuthierPageCopy = {
  kicker: "Communauté",
  title: "Luthiers",
  what: "Un luthier est un artisan qui construit et répare les instruments à cordes à la main — guitares, violons, contrebasses. Pas une usine. L’atelier est le lieu de travail.",
  lead: "Les facteurs d’instruments de la scène manouche. Des ateliers qui construisent des guitares style Selmer-Maccaferri.",
  craft: "Ce qu’un luthier fait est plus qu’un instrument. C’est le métier : choisir le bois, cintrer la table, chercher la voix juste. Chaque guitare est une conversation entre le facteur et le bois.",
  invite: "La plupart des luthiers sont ouverts au contact. Écrivez ou appelez — ils aiment que les musiciens pensent avec eux. Une idée de modèle, de bois, de changement ? Apportez-la. C’est le travail.",
  listLead: "Les noms ci-dessous, avec site, email et téléphone. Ouvrez une page pour les photos, les modèles et les délais.",
};

const DE: LuthierPageCopy = {
  kicker: "Community",
  title: "Gitarrenbauer",
  what: "Ein Luthier ist ein Handwerker, der Streich- und Zupfinstrumente von Hand baut und repariert — Gitarren, Geigen, Kontrabässe. Keine Fabrik. Das Atelier ist die Werkstatt.",
  lead: "Die Instrumentenbauer hinter der Manouche-Szene. Werkstätten, die Gitarren im Selmer-Maccaferri-Stil bauen.",
  craft: "Was ein Luthier macht, ist mehr als ein Instrument. Es ist Handwerk: das Holz wählen, die Decke biegen, die richtige Stimme suchen. Jede Gitarre ist ein Gespräch zwischen Bauer und Holz.",
  invite: "Die meisten Gitarrenbauer sind offen für Kontakt. Schreiben oder anrufen — sie mögen es, wenn Spieler mit ihnen denken. Eine Idee zu einem Modell, einem Holz, einer Änderung? Bringt sie mit. Das ist die Arbeit.",
  listLead: "Namen unten, mit Website, E-Mail und Telefon. Eine Seite öffnen für Fotos, Modelle und Wartezeiten.",
};

const IT: LuthierPageCopy = {
  kicker: "Comunità",
  title: "Liutai",
  what: "Un liutaio è un artigiano che costruisce e ripara strumenti a corda a mano — chitarre, violini, contrabbassi. Non una fabbrica. L’atelier è la bottega.",
  lead: "I costruttori dietro la scena manouche. Botteghe che fanno chitarre in stile Selmer-Maccaferri.",
  craft: "Quello che un liutaio fa è più di uno strumento. È mestiere: scegliere il legno, piegare la tavola, cercare la voce giusta. Ogni chitarra è una conversazione tra costruttore e legno.",
  invite: "La maggior parte dei liutai è aperta al contatto. Scrivete o chiamate — gli piace quando i musicisti pensano con loro. Un’idea su un modello, un legno, un cambiamento? Portatela. È il lavoro.",
  listLead: "Nomi qui sotto, con sito, email e telefono. Aprite una pagina per foto, modelli e tempi di attesa.",
};

const ES: LuthierPageCopy = {
  kicker: "Comunidad",
  title: "Luthiers",
  what: "Un luthier es un artesano que construye y repara instrumentos de cuerda a mano — guitarras, violines, contrabajos. No es una fábrica. El atelier es el taller.",
  lead: "Los constructores detrás de la escena manouche. Talleres que hacen guitarras estilo Selmer-Maccaferri.",
  craft: "Lo que hace un luthier es más que un instrumento. Es oficio: elegir la madera, curvar la tapa, buscar la voz justa. Cada guitarra es una conversación entre constructor y madera.",
  invite: "La mayoría de los luthiers están abiertos al contacto. Escribir o llamar — les gusta que los músicos piensen con ellos. ¿Una idea de modelo, de madera, de cambio? Traedla. Ese es el trabajo.",
  listLead: "Nombres abajo, con web, email y teléfono. Abrid una página para fotos, modelos y tiempos de espera.",
};

const PT: LuthierPageCopy = {
  kicker: "Comunidade",
  title: "Luthiers",
  what: "Um luthier é um artesão que constrói e repara instrumentos de corda à mão — guitarras, violinos, contrabaixos. Não é uma fábrica. O atelier é a oficina.",
  lead: "Os construtores por trás da cena manouche. Oficinas que fazem guitarras estilo Selmer-Maccaferri.",
  craft: "O que um luthier faz é mais do que um instrumento. É ofício: escolher a madeira, curvar o tampo, procurar a voz certa. Cada guitarra é uma conversa entre construtor e madeira.",
  invite: "A maior parte dos luthiers está aberta ao contacto. Escrevam ou liguem — gostam quando os músicos pensam com eles. Uma ideia de modelo, de madeira, de mudança? Tragam. É o trabalho.",
  listLead: "Nomes abaixo, com site, email e telefone. Abram uma página para fotos, modelos e tempos de espera.",
};

const HU: LuthierPageCopy = {
  kicker: "Közösség",
  title: "Gitárkészítők",
  what: "A luthier kézzel épít és javít húros hangszereket — gitár, hegedű, nagybőgő. Nem gyár. Az atelier a műhely.",
  lead: "A manouche-színtér hangszerkészítői. Műhelyek, amelyek Selmer-Maccaferri stílusú gitárokat építenek.",
  craft: "Amit a luthier csinál, több mint hangszer. Mesterség: a fát választani, a tetőt hajlítani, a hangot keresni. Minden gitár beszélgetés készítő és fa között.",
  invite: "A legtöbb készítő nyitott a kapcsolatra. Írjatok vagy hívjatok — szeretik, ha a zenészek velük gondolkodnak. Ötlet modellre, fára, változásra? Hozzátok. Ez a munka.",
  listLead: "Nevek lent, weblappal, emaillel, telefonnal. Nyissatok oldalt fotókhoz, modellekhez, várakozási időhöz.",
};

const RO: LuthierPageCopy = {
  kicker: "Comunitate",
  title: "Lutieri",
  what: "Un lutier construiește și repară instrumente cu coarde de mână — chitare, viori, contrabasuri. Nu o fabrică. Atelierul e locul de lucru.",
  lead: "Constructorii din spatele scenei manouche. Ateliere care fac chitare stil Selmer-Maccaferri.",
  craft: "Ce face un lutier e mai mult decât un instrument. E meserie: alegi lemnul, îndoi fața, cauți vocea potrivită. Fiecare chitară e o conversație între constructor și lemn.",
  invite: "Cei mai mulți lutieri sunt deschiși la contact. Scrieți sau sunați — le place când muzicienii gândesc cu ei. O idee de model, de lemn, de schimbare? Aduceți-o. Asta e munca.",
  listLead: "Numele mai jos, cu site, email și telefon. Deschideți o pagină pentru poze, modele și timpi de așteptare.",
};

const PL: LuthierPageCopy = {
  kicker: "Społeczność",
  title: "Lutnicy",
  what: "Lutnik to rzemieślnik, który ręcznie buduje i naprawia instrumenty strunowe — gitary, skrzypce, kontrabasy. Nie fabryka. Atelier to warsztat.",
  lead: "Budowniczowie instrumentów sceny manouche. Warsztaty, które robią gitary w stylu Selmer-Maccaferri.",
  craft: "To, co robi lutnik, to więcej niż instrument. To rzemiosło: wybrać drewno, wygiąć płytę, szukać właściwego głosu. Każda gitara to rozmowa między mistrzem a drewnem.",
  invite: "Większość lutników jest otwarta na kontakt. Piszcie lub dzwońcie — lubią, gdy muzycy myślą z nimi. Pomysł na model, drewno, zmianę? Przynieście. To jest praca.",
  listLead: "Nazwiska poniżej, ze stroną, emailem i telefonem. Otwórzcie stronę po zdjęcia, modele i czasy oczekiwania.",
};

const CS: LuthierPageCopy = {
  kicker: "Komunita",
  title: "Nástrojaři",
  what: "Luthier ručně staví a opravuje strunné nástroje — kytary, housle, kontrabasy. Ne továrna. Ateliér je dílna.",
  lead: "Stavitelé nástrojů manouche scény. Dílny, které staví kytary ve stylu Selmer-Maccaferri.",
  craft: "Co luthier dělá, je víc než nástroj. Je to řemeslo: vybrat dřevo, ohnout desku, hledat správný hlas. Každá kytara je rozhovor mezi stavitelem a dřevem.",
  invite: "Většina stavitelů je otevřená kontaktu. Pište nebo volejte — mají rádi, když hráči myslí s nimi. Nápad na model, dřevo, změnu? Přineste ho. To je práce.",
  listLead: "Jména níže, s webem, emailem a telefonem. Otevřete stránku pro fotky, modely a čekací doby.",
};

const SR: LuthierPageCopy = {
  kicker: "Zajednica",
  title: "Graditelji",
  what: "Luthier ručno gradi i popravlja žičane instrumente — gitare, violine, kontrabase. Nije fabrika. Atelje je radionica.",
  lead: "Graditelji instrumenata manouche scene. Radionice koje prave gitare u stilu Selmer-Maccaferri.",
  craft: "Ono što luthier radi je više od instrumenta. Zanat: izabrati drvo, saviti ploču, tražiti pravi glas. Svaka gitara je razgovor između majstora i drveta.",
  invite: "Većina majstora je otvorena za kontakt. Pišite ili zovite — vole kad svirači misle sa njima. Ideja o modelu, drvetu, promeni? Donestite. To je posao.",
  listLead: "Imena ispod, sa sajtom, emailom i telefonom. Otvorite stranicu za fotografije, modele i vreme čekanja.",
};

const HR: LuthierPageCopy = {
  kicker: "Zajednica",
  title: "Graditelji",
  what: "Luthier ručno gradi i popravlja žičane instrumente — gitare, violine, kontrabase. Nije tvornica. Atelje je radionica.",
  lead: "Graditelji instrumenata manouche scene. Radionice koje rade gitare u stilu Selmer-Maccaferri.",
  craft: "Ono što luthier radi je više od instrumenta. Zanat: odabrati drvo, saviti ploču, tražiti pravi glas. Svaka gitara je razgovor između majstora i drveta.",
  invite: "Većina majstora je otvorena za kontakt. Pišite ili zovite — vole kad glazbenici misle s njima. Ideja o modelu, drvetu, promjeni? Donestite. To je posao.",
  listLead: "Imena ispod, sa stranicom, emailom i telefonom. Otvorite stranicu za fotografije, modele i vrijeme čekanja.",
};

const RU: LuthierPageCopy = {
  kicker: "Сообщество",
  title: "Мастера",
  what: "Лютье — мастер, который вручную строит и чинит струнные инструменты: гитары, скрипки, контрабасы. Не завод. Ателье — это мастерская.",
  lead: "Мастера инструментов мануш-сцены. Мастерские, которые делают гитары в стиле Selmer-Maccaferri.",
  craft: "То, что делает лютье, больше чем инструмент. Это ремесло: выбрать дерево, выгнуть деку, искать нужный голос. Каждая гитара — разговор между мастером и деревом.",
  invite: "Большинство мастеров открыты к контакту. Пишите или звоните — им нравится, когда музыканты думают вместе с ними. Идея модели, дерева, изменения? Приносите. Это работа.",
  listLead: "Имена ниже — сайт, почта, телефон. Откройте страницу для фото, моделей и сроков ожидания.",
};

const JA: LuthierPageCopy = {
  kicker: "コミュニティ",
  title: "ルシアー",
  what: "ルシアーは弦楽器を手で作り、修理する職人です。ギター、ヴァイオリン、コントラバス。工場ではありません。アトリエは工房です。",
  lead: "マヌーシュ・シーンの楽器職人。Selmer-Maccaferri スタイルのギターを作る工房です。",
  craft: "ルシアーが作るものは楽器以上です。職人仕事です。木を選び、表板を曲げ、声を探す。一挺のギターは作り手と木の会話です。",
  invite: "ほとんどのルシアーは連絡を歓迎します。書いて、電話して。奏者が一緒に考えるのを好みます。モデル、木材、変更の案があれば、持ってきてください。それが仕事です。",
  listLead: "下に名前、サイト、メール、電話。写真、モデル、待ち時間は各ページで。",
};

const KO: LuthierPageCopy = {
  kicker: "커뮤니티",
  title: "루티에",
  what: "루티에는 현악기를 손으로 만들고 고치는 장인입니다. 기타, 바이올린, 더블베이스. 공장이 아닙니다. 아틀리에는 공방입니다.",
  lead: "마누슈 신의 악기 제작자들. Selmer-Maccaferri 스타일 기타를 만드는 공방입니다.",
  craft: "루티에가 만드는 것은 악기 이상입니다. 장인 일: 나무를 고르고, 앞판을 굽히고, 목소리를 찾습니다. 기타 한 대는 제작자와 나무의 대화입니다.",
  invite: "대부분의 루티에는 연락을 반깁니다. 메일이나 전화 — 연주자가 함께 생각하는 걸 좋아합니다. 모델, 나무, 변경 아이디어가 있으면 가져오세요. 그게 일입니다.",
  listLead: "아래 이름, 사이트, 이메일, 전화. 사진, 모델, 대기 시간은 각 페이지에서.",
};

const ZH: LuthierPageCopy = {
  kicker: "社区",
  title: "制琴师",
  what: "制琴师是亲手制作和修理弦乐器的工匠——吉他、小提琴、低音提琴。不是工厂。工作室是工坊。",
  lead: "马努什圈子背后的乐器工匠。做 Selmer-Maccaferri 风格吉他的工坊。",
  craft: "制琴师做的不只是一件乐器。是手艺：选木头、弯面板、找对的声音。每把吉他都是制琴人和木头的对话。",
  invite: "多数制琴师欢迎联系。写信或打电话——他们喜欢乐手一起想。模型、木材、改动的想法？带过来。这就是工作。",
  listLead: "下面是名字，有网站、邮箱和电话。点开页面看照片、型号和等待时间。",
};

const ZH_TW: LuthierPageCopy = {
  kicker: "社群",
  title: "製琴師",
  what: "製琴師是親手製作與修理弦樂器的工匠——吉他、小提琴、低音提琴。不是工廠。工作室是工坊。",
  lead: "馬努什圈子背後的樂器工匠。做 Selmer-Maccaferri 風格吉他的工坊。",
  craft: "製琴師做的不只是一件樂器。是手藝：選木頭、彎面板、找對的聲音。每把吉他都是製琴人和木頭的對話。",
  invite: "多數製琴師歡迎聯繫。寫信或打電話——他們喜歡樂手一起想。型號、木材、改動的想法？帶過來。這就是工作。",
  listLead: "下面是名字，有網站、信箱和電話。點開頁面看照片、型號和等待時間。",
};

const ID: LuthierPageCopy = {
  kicker: "Komunitas",
  title: "Luthier",
  what: "Luthier adalah perajin yang membuat dan memperbaiki alat musik gesek dan petik dengan tangan — gitar, biola, bas ganda. Bukan pabrik. Atelier adalah bengkel kerja.",
  lead: "Para pembuat instrumen di belakang scene manouche. Bengkel yang membuat gitar gaya Selmer-Maccaferri.",
  craft: "Yang dibuat luthier lebih dari instrumen. Itu kerajinan: memilih kayu, menekuk tutup, mencari suara yang tepat. Setiap gitar adalah percakapan antara pembuat dan kayu.",
  invite: "Kebanyakan luthier terbuka untuk kontak. Tulis atau telepon — mereka suka kalau pemain berpikir bersama. Ide model, kayu, perubahan? Bawa. Itu pekerjaannya.",
  listLead: "Nama di bawah, dengan situs, email, dan telepon. Buka halaman untuk foto, model, dan waktu tunggu.",
};

const TH: LuthierPageCopy = {
  kicker: "ชุมชน",
  title: "ช่างทำกีตาร์",
  what: "ลูธิเยร์คือช่างที่สร้างและซ่อมเครื่องสายด้วยมือ — กีตาร์ ไวโอลิน ดับเบิลเบส ไม่ใช่โรงงาน ห้องทำงานคือโรงงานฝีมือ",
  lead: "ช่างทำเครื่องดนตรีเบื้องหลังซีนมานูช โรงงานที่ทำกีตาร์สไตล์ Selmer-Maccaferri",
  craft: "สิ่งที่ลูธิเยร์ทำมากกว่าเครื่องดนตรี คืองานฝีมือ เลือกไม้ ดัดหน้ากีตาร์ หาเสียงที่ถูก ทุกกีตาร์คือบทสนทนาระหว่างช่างกับไม้",
  invite: "ช่างส่วนใหญ่ยินดีให้ติดต่อ เขียนหรือโทร — พวกเขาชอบเมื่อผู้เล่นคิดด้วยกัน มีไอเดียรุ่น ไม้ หรือการปรับ นำมา นั่นคืองาน",
  listLead: "ชื่อด้านล่าง พร้อมเว็บ อีเมล โทรศัพท์ เปิดหน้าเพื่อดูรูป รุ่น และเวลารอ",
};

const BY_LOCALE: Record<string, LuthierPageCopy> = {
  en: EN,
  nl: NL,
  fr: FR,
  de: DE,
  it: IT,
  es: ES,
  pt: PT,
  hu: HU,
  ro: RO,
  pl: PL,
  cs: CS,
  sr: SR,
  hr: HR,
  ru: RU,
  ja: JA,
  ko: KO,
  zh: ZH,
  "zh-tw": ZH_TW,
  id: ID,
  th: TH,
  he: EN,
};

export function luthierPageCopy(locale: string): LuthierPageCopy {
  return BY_LOCALE[locale] ?? EN;
}
