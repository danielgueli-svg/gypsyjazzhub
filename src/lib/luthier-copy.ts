export type LuthierPageCopy = {
  kicker: string;
  title: string;
  lead: string;
  craft: string;
  invite: string;
  listLead: string;
  contribute: string;
};

/** English is the source. Other locales follow these sentences. */
const EN: LuthierPageCopy = {
  kicker: "Community",
  title: "Luthiers",
  lead: "The instrument makers behind the manouche scene. Here you will find the ateliers that build Selmer-Maccaferri-style guitars and other gypsy jazz instruments — from one-person ateliers to well-known names. Double bass makers, violin makers and makers of other instruments belong here too.",
  craft: "What a luthier makes is more than an instrument. It is craft: choosing the wood, bending the top, finding the sound. Each guitar is a conversation between maker and wood.",
  invite: "Most luthiers welcome contact. Do not hesitate to email or call — they like it when players think along. Have an idea about a model, a wood, or a change? Bring it. That is what they stand for.",
  listLead: "Names, websites, emails and phone numbers are below. Open a maker’s page for photos, models and waiting times.",
  contribute: "Add a luthier if you know one, or ask a question about a maker. Keep it short: name, place, website or email, and a line about what they build. No ads, no factory brands — only real luthiers and their ateliers.",
};

const NL: LuthierPageCopy = {
  kicker: "Community",
  title: "Luthiers",
  lead: "De instrumentmakers achter de manouche-scene. Hier vind je de ateliers die gitaren in Selmer-Maccaferri-stijl bouwen en andere gypsy-jazzinstrumenten — van eenmansateliers tot bekende namen. Contrabasbouwers, vioolmakers en makers van andere instrumenten horen hier ook.",
  craft: "Wat een luthier maakt is meer dan een instrument. Het is ambacht: het hout kiezen, het bovenblad buigen, de klank vinden. Elke gitaar is een gesprek tussen bouwer en hout.",
  invite: "De meeste luthiers staan open voor contact. Mail of bel gerust — ze vinden het fijn als spelers meedenken. Een idee over een model, een hout of een verandering? Breng het in. Daar staan ze voor.",
  listLead: "Namen, websites, emails en telefoonnummers staan hieronder. Open de pagina van een maker voor foto’s, modellen en wachttijden.",
  contribute: "Voeg een luthier toe als je er een kent, of stel een vraag over een maker. Kort: naam, plaats, website of email, en een regel over wat ze bouwen. Geen advertenties, geen fabrieksmerken — alleen echte luthiers en hun ateliers.",
};

const FR: LuthierPageCopy = {
  kicker: "Communauté",
  title: "Luthiers",
  lead: "Les facteurs d’instruments de la scène manouche. Ici les ateliers qui construisent des guitares style Selmer-Maccaferri et d’autres instruments gypsy jazz — de l’atelier d’une personne aux noms connus. Facteurs de contrebasse, de violon et d’autres instruments sont ici aussi.",
  craft: "Ce qu’un luthier fait est plus qu’un instrument. C’est le métier : choisir le bois, cintrer la table, trouver le son. Chaque guitare est une conversation entre le facteur et le bois.",
  invite: "La plupart des luthiers accueillent le contact. N’hésitez pas à écrire ou à appeler — ils aiment que les musiciens pensent avec eux. Une idée de modèle, de bois, de changement ? Apportez-la. C’est ce qu’ils défendent.",
  listLead: "Noms, sites, emails et téléphones ci-dessous. Ouvrez la page d’un facteur pour les photos, les modèles et les délais.",
  contribute: "Ajoutez un luthier si vous en connaissez un, ou posez une question. Court : nom, lieu, site ou email, et une ligne sur ce qu’ils construisent. Pas de pub, pas de marques d’usine — seulement de vrais luthiers et leurs ateliers.",
};

const DE: LuthierPageCopy = {
  kicker: "Community",
  title: "Gitarrenbauer",
  lead: "Die Instrumentenbauer hinter der Manouche-Szene. Hier die Ateliers, die Gitarren im Selmer-Maccaferri-Stil und andere Gypsy-Jazz-Instrumente bauen — von Ein-Personen-Ateliers bis zu bekannten Namen. Kontrabassbauer, Geigenbauer und andere Macher gehören auch hierher.",
  craft: "Was ein Luthier macht, ist mehr als ein Instrument. Es ist Handwerk: das Holz wählen, die Decke biegen, den Klang finden. Jede Gitarre ist ein Gespräch zwischen Bauer und Holz.",
  invite: "Die meisten Gitarrenbauer heißen Kontakt willkommen. Schreiben oder anrufen — sie mögen es, wenn Spieler mitdenken. Eine Idee zu einem Modell, einem Holz, einer Änderung? Bringt sie mit. Dafür stehen sie.",
  listLead: "Namen, Websites, E-Mails und Telefonnummern unten. Eine Seite öffnen für Fotos, Modelle und Wartezeiten.",
  contribute: "Einen Gitarrenbauer hinzufügen, wenn ihr einen kennt, oder eine Frage stellen. Kurz: Name, Ort, Website oder E-Mail, und eine Zeile, was sie bauen. Keine Werbung, keine Fabrikmarken — nur echte Luthiers und ihre Ateliers.",
};

const IT: LuthierPageCopy = {
  kicker: "Comunità",
  title: "Liutai",
  lead: "I costruttori dietro la scena manouche. Qui le botteghe che fanno chitarre in stile Selmer-Maccaferri e altri strumenti gypsy jazz — da botteghe di una persona ai nomi noti. Liutai di contrabbasso, di violino e di altri strumenti stanno qui anche.",
  craft: "Quello che un liutaio fa è più di uno strumento. È mestiere: scegliere il legno, piegare la tavola, trovare il suono. Ogni chitarra è una conversazione tra costruttore e legno.",
  invite: "La maggior parte dei liutai accoglie il contatto. Scrivete o chiamate — gli piace quando i musicisti pensano con loro. Un’idea su un modello, un legno, un cambiamento? Portatela. È quello per cui stanno.",
  listLead: "Nomi, siti, email e telefoni qui sotto. Aprite la pagina di un costruttore per foto, modelli e tempi di attesa.",
  contribute: "Aggiungete un liutaio se ne conoscete uno, o fate una domanda. Breve: nome, luogo, sito o email, e una riga su cosa costruiscono. Niente pubblicità, niente marche di fabbrica — solo liutai veri e le loro botteghe.",
};

const ES: LuthierPageCopy = {
  kicker: "Comunidad",
  title: "Luthiers",
  lead: "Los constructores detrás de la escena manouche. Aquí los talleres que hacen guitarras estilo Selmer-Maccaferri y otros instrumentos gypsy jazz — de talleres de una persona a nombres conocidos. Luthiers de contrabajo, de violín y de otros instrumentos también están aquí.",
  craft: "Lo que hace un luthier es más que un instrumento. Es oficio: elegir la madera, curvar la tapa, encontrar el sonido. Cada guitarra es una conversación entre constructor y madera.",
  invite: "La mayoría de los luthiers dan la bienvenida al contacto. Escribid o llamad — les gusta que los músicos piensen con ellos. ¿Una idea de modelo, de madera, de cambio? Traedla. Eso es lo que defienden.",
  listLead: "Nombres, webs, emails y teléfonos abajo. Abrid la página de un constructor para fotos, modelos y tiempos de espera.",
  contribute: "Añadid un luthier si conocéis uno, o haced una pregunta. Corto: nombre, lugar, web o email, y una línea sobre lo que construyen. Sin anuncios, sin marcas de fábrica — solo luthiers de verdad y sus talleres.",
};

const PT: LuthierPageCopy = {
  kicker: "Comunidade",
  title: "Luthiers",
  lead: "Os construtores por trás da cena manouche. Aqui as oficinas que fazem guitarras estilo Selmer-Maccaferri e outros instrumentos gypsy jazz — de oficinas de uma pessoa a nomes conhecidos. Luthiers de contrabaixo, de violino e de outros instrumentos também estão aqui.",
  craft: "O que um luthier faz é mais do que um instrumento. É ofício: escolher a madeira, curvar o tampo, encontrar o som. Cada guitarra é uma conversa entre construtor e madeira.",
  invite: "A maior parte dos luthiers aceita contacto. Escrevam ou liguem — gostam quando os músicos pensam com eles. Uma ideia de modelo, de madeira, de mudança? Tragam. É isso que defendem.",
  listLead: "Nomes, sites, emails e telefones abaixo. Abram a página de um construtor para fotos, modelos e tempos de espera.",
  contribute: "Adicionem um luthier se conhecerem um, ou façam uma pergunta. Curto: nome, lugar, site ou email, e uma linha sobre o que constroem. Sem anúncios, sem marcas de fábrica — só luthiers a sério e as suas oficinas.",
};

const HU: LuthierPageCopy = {
  kicker: "Közösség",
  title: "Gitárkészítők",
  lead: "A manouche-színtér hangszerkészítői. Itt az atelierek, amelyek Selmer-Maccaferri stílusú gitárokat és más gypsy jazz hangszereket építenek — egyfős atelierektől az ismert nevekig. Nagybőgő-, hegedű- és más készítők is ide tartoznak.",
  craft: "Amit a luthier csinál, több mint hangszer. Mesterség: a fát választani, a tetőt hajlítani, a hangot megtalálni. Minden gitár beszélgetés készítő és fa között.",
  invite: "A legtöbb készítő örül a kapcsolatnak. Írjatok vagy hívjatok — szeretik, ha a zenészek velük gondolkodnak. Ötlet modellre, fára, változásra? Hozzátok. Ezért állnak.",
  listLead: "Nevek, weblapok, emailek, telefonok lent. Nyissatok oldalt fotókhoz, modellekhez, várakozási időhöz.",
  contribute: "Adjatok hozzá készítőt, ha ismertek egyet, vagy kérdezzetek. Röviden: név, hely, weblap vagy email, és egy sor, mit építenek. Nincs hirdetés, nincs gyári márka — csak valódi luthierek és ateliereik.",
};

const RO: LuthierPageCopy = {
  kicker: "Comunitate",
  title: "Lutieri",
  lead: "Constructorii din spatele scenei manouche. Aici atelierele care fac chitare stil Selmer-Maccaferri și alte instrumente gypsy jazz — de la ateliere cu un om până la nume cunoscute. Lutieri de contrabas, de vioară și de alte instrumente sunt și ei aici.",
  craft: "Ce face un lutier e mai mult decât un instrument. E meserie: alegi lemnul, îndoi fața, găsești sunetul. Fiecare chitară e o conversație între constructor și lemn.",
  invite: "Cei mai mulți lutieri primesc contactul. Scrieți sau sunați — le place când muzicienii gândesc cu ei. O idee de model, de lemn, de schimbare? Aduceți-o. Pentru asta stau.",
  listLead: "Nume, site-uri, emailuri și telefoane mai jos. Deschideți pagina unui constructor pentru poze, modele și timpi de așteptare.",
  contribute: "Adăugați un lutier dacă cunoașteți unul, sau puneți o întrebare. Scurt: nume, loc, site sau email, și un rând despre ce construiesc. Fără reclame, fără mărci de fabrică — doar lutieri adevărați și atelierele lor.",
};

const PL: LuthierPageCopy = {
  kicker: "Społeczność",
  title: "Lutnicy",
  lead: "Budowniczowie instrumentów sceny manouche. Tutaj pracownie, które robią gitary w stylu Selmer-Maccaferri i inne instrumenty gypsy jazz — od jednoosobowych pracowni po znane nazwiska. Lutnicy kontrabasu, skrzypiec i innych instrumentów też tu są.",
  craft: "To, co robi lutnik, to więcej niż instrument. To rzemiosło: wybrać drewno, wygiąć płytę, znaleźć dźwięk. Każda gitara to rozmowa między mistrzem a drewnem.",
  invite: "Większość lutników chętnie przyjmuje kontakt. Piszcie lub dzwońcie — lubią, gdy muzycy myślą z nimi. Pomysł na model, drewno, zmianę? Przynieście. Za tym stoją.",
  listLead: "Nazwiska, strony, emaile i telefony poniżej. Otwórzcie stronę mistrza po zdjęcia, modele i czasy oczekiwania.",
  contribute: "Dodajcie lutnika, jeśli kogoś znacie, albo zadajcie pytanie. Krótko: imię, miejsce, strona lub email, i linia o tym, co budują. Bez reklam, bez marek fabrycznych — tylko prawdziwi lutnicy i ich pracownie.",
};

const CS: LuthierPageCopy = {
  kicker: "Komunita",
  title: "Nástrojaři",
  lead: "Stavitelé nástrojů manouche scény. Tady ateliéry, které staví kytary ve stylu Selmer-Maccaferri a další gypsy jazz nástroje — od jednomístných ateliérů po známá jména. Stavitelé kontrabasu, houslí a dalších nástrojů sem patří taky.",
  craft: "Co luthier dělá, je víc než nástroj. Je to řemeslo: vybrat dřevo, ohnout desku, najít zvuk. Každá kytara je rozhovor mezi stavitelem a dřevem.",
  invite: "Většina stavitelů vítá kontakt. Pište nebo volejte — mají rádi, když hráči myslí s nimi. Nápad na model, dřevo, změnu? Přineste ho. Za tím stojí.",
  listLead: "Jména, weby, emaily a telefony níže. Otevřete stránku stavitele pro fotky, modely a čekací doby.",
  contribute: "Přidejte nástrojaře, pokud nějakého znáte, nebo se zeptejte. Krátce: jméno, místo, web nebo email, a řádek, co staví. Žádné reklamy, žádné tovární značky — jen skuteční luthiers a jejich ateliéry.",
};

const SR: LuthierPageCopy = {
  kicker: "Zajednica",
  title: "Graditelji",
  lead: "Graditelji instrumenata manouche scene. Ovde ateljei koji prave gitare u stilu Selmer-Maccaferri i druge gypsy jazz instrumente — od ateljea jednog čoveka do poznatih imena. Graditelji kontrabasa, violine i drugih instrumenata su ovde takođe.",
  craft: "Ono što luthier radi je više od instrumenta. Zanat: izabrati drvo, saviti ploču, naći zvuk. Svaka gitara je razgovor između majstora i drveta.",
  invite: "Većina majstora prima kontakt. Pišite ili zovite — vole kad svirači misle sa njima. Ideja o modelu, drvetu, promeni? Donestite. Zato stoje.",
  listLead: "Imena, sajtovi, emailovi i telefoni ispod. Otvorite stranicu majstora za fotografije, modele i vreme čekanja.",
  contribute: "Dodajte majstora ako nekog znate, ili postavite pitanje. Kratko: ime, mesto, sajt ili email, i red o tome šta grade. Bez reklama, bez fabričkih brendova — samo pravi lutieri i njihovi ateljei.",
};

const HR: LuthierPageCopy = {
  kicker: "Zajednica",
  title: "Graditelji",
  lead: "Graditelji instrumenata manouche scene. Ovdje ateljei koji rade gitare u stilu Selmer-Maccaferri i druge gypsy jazz instrumente — od ateljea jedne osobe do poznatih imena. Graditelji kontrabasa, violine i drugih instrumenata su ovdje također.",
  craft: "Ono što luthier radi je više od instrumenta. Zanat: odabrati drvo, saviti ploču, naći zvuk. Svaka gitara je razgovor između majstora i drveta.",
  invite: "Većina majstora prima kontakt. Pišite ili zovite — vole kad glazbenici misle s njima. Ideja o modelu, drvetu, promjeni? Donestite. Zato stoje.",
  listLead: "Imena, stranice, emailovi i telefoni ispod. Otvorite stranicu majstora za fotografije, modele i vrijeme čekanja.",
  contribute: "Dodajte majstora ako nekog znate, ili postavite pitanje. Kratko: ime, mjesto, stranica ili email, i red o tome što grade. Bez reklama, bez tvorničkih brandova — samo pravi lutieri i njihovi ateljei.",
};

const RU: LuthierPageCopy = {
  kicker: "Сообщество",
  title: "Мастера",
  lead: "Мастера инструментов мануш-сцены. Здесь ателье, которые делают гитары в стиле Selmer-Maccaferri и другие инструменты gypsy jazz — от ателье на одного до известных имён. Мастера контрабаса, скрипки и других инструментов тоже здесь.",
  craft: "То, что делает лютье, больше чем инструмент. Это ремесло: выбрать дерево, выгнуть деку, найти звук. Каждая гитара — разговор между мастером и деревом.",
  invite: "Большинство мастеров открыты к контакту. Пишите или звоните — им нравится, когда музыканты думают вместе с ними. Идея модели, дерева, изменения? Приносите. За этим они стоят.",
  listLead: "Имена, сайты, почта и телефоны ниже. Откройте страницу мастера для фото, моделей и сроков ожидания.",
  contribute: "Добавьте мастера, если знаете кого-то, или задайте вопрос. Коротко: имя, место, сайт или почта, и строка о том, что они строят. Без рекламы, без заводских марок — только настоящие лютье и их ателье.",
};

const JA: LuthierPageCopy = {
  kicker: "コミュニティ",
  title: "ルシアー",
  lead: "マヌーシュ・シーンの楽器職人。Selmer-Maccaferri スタイルのギターと、そのほかのジプシージャズ楽器を作る工房です。一人の工房からよく知られた名前まで。コントラバス、ヴァイオリン、ほかの楽器の作り手もここに入ります。",
  craft: "ルシアーが作るものは楽器以上です。職人仕事です。木を選び、表板を曲げ、音を見つける。一挺のギターは作り手と木の会話です。",
  invite: "ほとんどのルシアーは連絡を歓迎します。書いて、電話して。奏者が一緒に考えるのを好みます。モデル、木材、変更の案があれば、持ってきてください。それが彼らの仕事です。",
  listLead: "下に名前、サイト、メール、電話。写真、モデル、待ち時間は各ページで。",
  contribute: "知っているルシアーを追加するか、作り手について質問してください。短く：名前、場所、サイトかメール、何を作るか一行。広告なし、工場ブランドなし — 本物のルシアーと工房だけ。",
};

const KO: LuthierPageCopy = {
  kicker: "커뮤니티",
  title: "루티에",
  lead: "마누슈 신의 악기 제작자들. Selmer-Maccaferri 스타일 기타와 다른 집시 재즈 악기를 만드는 공방입니다. 한 사람 공방에서 잘 알려진 이름까지. 더블베이스, 바이올린, 다른 악기 제작자도 여기 있습니다.",
  craft: "루티에가 만드는 것은 악기 이상입니다. 장인 일: 나무를 고르고, 앞판을 굽히고, 소리를 찾습니다. 기타 한 대는 제작자와 나무의 대화입니다.",
  invite: "대부분의 루티에는 연락을 반깁니다. 메일이나 전화 — 연주자가 함께 생각하는 걸 좋아합니다. 모델, 나무, 변경 아이디어가 있으면 가져오세요. 그게 그들이 서는 자리입니다.",
  listLead: "아래 이름, 사이트, 이메일, 전화. 사진, 모델, 대기 시간은 각 페이지에서.",
  contribute: "아는 루티에가 있으면 추가하거나, 제작자에게 질문하세요. 짧게: 이름, 장소, 사이트나 이메일, 무엇을 만드는지 한 줄. 광고 없음, 공장 브랜드 없음 — 진짜 루티에와 공방만.",
};

const ZH: LuthierPageCopy = {
  kicker: "社区",
  title: "制琴师",
  lead: "马努什圈子背后的乐器工匠。做 Selmer-Maccaferri 风格吉他和其他吉普赛爵士乐器的工坊——从一个人的工坊到熟知的名字。低音提琴、小提琴和其他乐器的工匠也在这里。",
  craft: "制琴师做的不只是一件乐器。是手艺：选木头、弯面板、找到声音。每把吉他都是制琴人和木头的对话。",
  invite: "多数制琴师欢迎联系。写信或打电话——他们喜欢乐手一起想。模型、木材、改动的想法？带过来。他们为此而在。",
  listLead: "下面是名字、网站、邮箱和电话。点开页面看照片、型号和等待时间。",
  contribute: "认识制琴师就加上，或问一句。短：名字、地点、网站或邮箱，以及他们做什么。不要广告，不要工厂牌子——只要真正的制琴师和工坊。",
};

const ZH_TW: LuthierPageCopy = {
  kicker: "社群",
  title: "製琴師",
  lead: "馬努什圈子背後的樂器工匠。做 Selmer-Maccaferri 風格吉他和其他吉普賽爵士樂器的工坊——從一個人的工坊到熟知的名字。低音提琴、小提琴和其他樂器的工匠也在這裡。",
  craft: "製琴師做的不只是一件樂器。是手藝：選木頭、彎面板、找到聲音。每把吉他都是製琴人和木頭的對話。",
  invite: "多數製琴師歡迎聯繫。寫信或打電話——他們喜歡樂手一起想。型號、木材、改動的想法？帶過來。他們為此而在。",
  listLead: "下面是名字、網站、信箱和電話。點開頁面看照片、型號和等待時間。",
  contribute: "認識製琴師就加上，或問一句。短：名字、地點、網站或信箱，以及他們做什麼。不要廣告，不要工廠牌子——只要真正的製琴師和工坊。",
};

const ID: LuthierPageCopy = {
  kicker: "Komunitas",
  title: "Luthier",
  lead: "Para pembuat instrumen di belakang scene manouche. Di sini atelier yang membuat gitar gaya Selmer-Maccaferri dan instrumen gypsy jazz lain — dari atelier satu orang sampai nama yang dikenal. Pembuat contrabass, biola, dan instrumen lain juga di sini.",
  craft: "Yang dibuat luthier lebih dari instrumen. Itu kerajinan: memilih kayu, menekuk tutup, menemukan suara. Setiap gitar adalah percakapan antara pembuat dan kayu.",
  invite: "Kebanyakan luthier menyambut kontak. Tulis atau telepon — mereka suka kalau pemain berpikir bersama. Ide model, kayu, perubahan? Bawa. Itu yang mereka bela.",
  listLead: "Nama, situs, email, dan telepon di bawah. Buka halaman pembuat untuk foto, model, dan waktu tunggu.",
  contribute: "Tambah luthier jika Anda kenal satu, atau tanya. Pendek: nama, tempat, situs atau email, dan satu baris tentang yang mereka buat. Tanpa iklan, tanpa merek pabrik — hanya luthier sungguhan dan atelier mereka.",
};

const TH: LuthierPageCopy = {
  kicker: "ชุมชน",
  title: "ช่างทำกีตาร์",
  lead: "ช่างทำเครื่องดนตรีเบื้องหลังซีนมานูช ที่นี่คือโรงงานที่ทำกีตาร์สไตล์ Selmer-Maccaferri และเครื่อง gypsy jazz อื่น — จากโรงงานคนเดียวถึงชื่อที่รู้จัก ช่างดับเบิลเบส ไวโอลิน และเครื่องอื่นก็อยู่ที่นี่",
  craft: "สิ่งที่ลูธิเยร์ทำมากกว่าเครื่องดนตรี คืองานฝีมือ เลือกไม้ ดัดหน้ากีตาร์ หาเสียง ทุกกีตาร์คือบทสนทนาระหว่างช่างกับไม้",
  invite: "ช่างส่วนใหญ่ยินดีให้ติดต่อ เขียนหรือโทร — พวกเขาชอบเมื่อผู้เล่นคิดด้วยกัน มีไอเดียรุ่น ไม้ หรือการปรับ นำมา นั่นคือสิ่งที่พวกเขายืนหยัด",
  listLead: "ชื่อ เว็บ อีเมล โทรศัพท์ด้านล่าง เปิดหน้าเพื่อดูรูป รุ่น และเวลารอ",
  contribute: "เพิ่มช่างถ้าคุณรู้จัก หรือถาม สั้น: ชื่อ สถานที่ เว็บหรืออีเมล และหนึ่งบรรทัดว่าสร้างอะไร ไม่มีโฆษณา ไม่มีแบรนด์โรงงาน — เฉพาะช่างจริงและโรงงานของพวกเขา",
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
