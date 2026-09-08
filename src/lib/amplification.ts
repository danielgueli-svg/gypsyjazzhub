export type AmpProduct = {
  name: string;
  maker: string;
  kind: "pickup" | "amp" | "mic" | "preamp";
  for: string;
  site: string;
  note: string;
};

export type PiezoBrand = {
  name: string;
  site: string;
  note: string;
};

export const AMP_TIPS = [
  {
    title: "Acoustic first",
    body: "Gypsy jazz is an acoustic music. The amp is there so the back of the room can hear the same guitar you hear in your lap. If it sounds good unplugged, you are halfway. Do not fight a bad setup with EQ.",
  },
  {
    title: "Guitar — the Selmer voice",
    body: "Petite bouche on stage usually means a magnetic pickup in the Stimer tradition (on the top or in the soundhole), not an undersaddle. That is the sound you hear on the old records when they went electric. Blend a small condenser if the room is kind. Cut a little around 250–400 Hz if it booms; leave the bite.",
  },
  {
    title: "Piezo",
    body: "A piezo under the saddle or on the bridge plate is loud and feedback-resistant, but it can sound quacky and thin on a Selmer. If that is what is in the guitar, do not throw it away — put a ToneDexter (or a good acoustic preamp) in front of the amp and train a WaveMap of the real guitar with a mic. Then the piezo is only the trigger. K&K, LR Baggs, Fishman, Shadow, Headway, Highlander, KNA, McIntyre, Ehrlund, Schertler, Mi-Si, Realist (bass) — the brands sit under this topic. Magnetic Stimer-style is still the classic manouche sound; piezo is the other road.",
  },
  {
    title: "Violin",
    body: "A clip microphone or a good contact (Schertler, DPA) keeps the bow. A guitar amp with a violin in front of it howls. Face slightly off-axis from the cab. Less gain than you think.",
  },
  {
    title: "Double bass",
    body: "A Realist or K&K on the bridge, sometimes a mic on the side. David Gage in New York is the shop behind the Realist. The job is the pump and the low G, not a disco sub. Roll off the very bottom so the guitar still has air. I play bass — this is the bit I care about.",
  },
  {
    title: "Clarinet and saxophone",
    body: "A quiet clip-on (DPA 4099 has a clarinet clip) into the same Acus or AER as the guitars. The reed is colour, not a PA. Never a horn stack in a café. Sit in after the theme; one chorus, then air.",
  },
  {
    title: "Vocals",
    body: "One handheld or a small condenser into the band combo — not a vocal stack. The pompe has to stay louder than the PA. Ask the host for the key before the downbeat.",
  },
  {
    title: "Accordion",
    body: "The box is already loud. In a café you often need no amp. If you do, a clip-on or a small condenser into the band combo — never a keyboard stack. Drop out for the guitar chorus so you are not both in the midrange.",
  },
  {
    title: "Harmonica",
    body: "Cup a handheld into the same combo as a singer, or play acoustic. A blues-harp stack fights the pompe. Chromatic for the Django book; diatonic if you know which harp the key wants.",
  },
  {
    title: "Jams and small rooms",
    body: "One small acoustic combo for the whole band is often enough. Acus, AER, Henriksen, Schertler — the ones built for strings. Point it at the players, not at the bar. If everyone brings a 100-watt guitar stack, nobody hears Django.",
  },
  {
    title: "Feedback",
    body: "Stand a little off-axis. Notch, don’t scoop. A soundhole cover helps a magnetic pickup on a loud stage. If it still sings, turn down — the music is acoustic.",
  },
];

export const AMP_PRODUCTS: AmpProduct[] = [
  {
    name: "ToneDexter II",
    maker: "Audio Sprockets",
    kind: "preamp",
    for: "Guitar, violin, bass — piezo and magnetic",
    site: "https://audiosprockets.com/",
    note: "The box that makes a piezo sound like the guitar. You record a WaveMap with a mic once; after that the pickup on stage follows the acoustic voice. A lot of players on the circuit put this between the guitar and the Acus or AER.",
  },
  {
    name: "One ForStrings",
    maker: "Acus",
    kind: "amp",
    for: "Guitar, violin, bass",
    site: "https://www.acusound.com/",
    note: "The small Italian combo a lot of European manouche players actually carry. Built for strings, not for a Strat.",
  },
  {
    name: "Compact 60",
    maker: "AER",
    kind: "amp",
    for: "Guitar, violin, bass",
    site: "https://www.aer-amps.com/",
    note: "German acoustic workhorse. Clear, loud enough for a club, still polite in a jam.",
  },
  {
    name: "STAT series / amps",
    maker: "Schertler",
    kind: "amp",
    for: "Violin, guitar, bass",
    site: "https://www.schertler.com/",
    note: "Swiss contact pickups and amps. Strong on violin and on players who want the wood, not the magnet.",
  },
  {
    name: "The Bud",
    maker: "Henriksen",
    kind: "amp",
    for: "Guitar",
    site: "https://henriksenamplifiers.com/",
    note: "American jazz amp. Light, loud, used on the US Django circuit.",
  },
  {
    name: "4099 Instrument Mic",
    maker: "DPA",
    kind: "mic",
    for: "Violin, guitar, bass, clarinet",
    site: "https://www.dpamicrophones.com/",
    note: "Clip microphone. The closest thing to “the instrument in the room” when the PA is decent. Clarinet clip for the reed chair; voice can share a handheld into the same combo.",
  },
  {
    name: "String Instruments / The Realist",
    maker: "David Gage",
    kind: "pickup",
    for: "Double bass",
    site: "https://www.davidgage.com/",
    note: "New York bass shop behind the Realist pickup. Jazz setup, rentals, and the copper-head piezo a lot of festival bassists still use.",
  },
];

export const PIEZO_BRANDS: PiezoBrand[] = [
  {
    name: "K&K Sound",
    site: "https://kksound.com/",
    note: "Bridge-plate transducers. The piezo a lot of acoustic players actually like — Pure Mini, Twin Spot, bass bridges.",
  },
  {
    name: "LR Baggs",
    site: "https://www.lrbaggs.com/",
    note: "Element undersaddle, Anthem mic+piezo, Session DI. Very common factory install.",
  },
  {
    name: "Fishman",
    site: "https://www.fishman.com/",
    note: "Acoustic Matrix undersaddle, PowerTap, Aura imaging. The other factory standard next to Baggs.",
  },
  {
    name: "Shadow Electronics",
    site: "https://www.shadow-electronics.com/",
    note: "German piezos — SH 800, Nanoflex, soundboard transducers. Long history on European acoustics.",
  },
  {
    name: "Headway",
    site: "https://www.headwaymusicaudio.com/",
    note: "UK pickups and the EDB preamp. A lot of acoustic players live on this on the floor.",
  },
  {
    name: "Highlander",
    site: "https://www.highlanderpickups.com/",
    note: "IP-1 undersaddle. Simple, loud, used in many boutique acoustics.",
  },
  {
    name: "KNA Pickups",
    site: "https://www.knapickups.com/",
    note: "Portable piezos you can take on and off — guitar, violin, cello, mandolin.",
  },
  {
    name: "McIntyre Acoustic Pickups",
    site: "https://www.mcintyrepickups.com/",
    note: "Feather and Full Contact soundboard transducers. Sits on the top, not under the saddle.",
  },
  {
    name: "Ehrlund",
    site: "https://ehrlund.se/",
    note: "Swedish EAP condenser-style contact. Very natural on guitar and violin if the preamp is right.",
  },
  {
    name: "Schertler",
    site: "https://www.schertler.com/",
    note: "STAT and DYN contacts. Not a classic undersaddle — electrostatic / dynamic on the body.",
  },
  {
    name: "Mi-Si",
    site: "https://www.mi-si.com/",
    note: "Battery-free piezo systems. Charge in a minute, play for hours.",
  },
  {
    name: "Barcus-Berry",
    site: "https://barcusberry.com/",
    note: "The old name in piezo. Planar wave, Hot Dot, violin and bass contacts.",
  },
  {
    name: "The Realist",
    site: "https://www.realistacoustic.com/",
    note: "Bass. The copper-head piezo on the bridge foot that a lot of jazz bassists still use.",
  },
  {
    name: "Underwood",
    site: "https://www.underwoodpups.com/",
    note: "Bass piezo, often next to the Realist on festival stages.",
  },
  {
    name: "B-Band",
    site: "https://b-band.com/",
    note: "Electret film under the saddle / soundboard. Finnish school, still on a lot of older acoustics.",
  },
  {
    name: "Graph Tech Ghost",
    site: "https://graphtech.com/",
    note: "Piezo saddles (String Saver / Ghost). Each string a pickup — useful if you also MIDI.",
  },
  {
    name: "Artec",
    site: "https://www.artecsound.com/",
    note: "Undersaddle and soundboard piezos. Common, serviceable, budget-friendly.",
  },
  {
    name: "D-TAR",
    site: "https://www.seymourduncan.com/",
    note: "Duncan/Turner Acoustic Research. Wavelength and multi-source systems.",
  },
];
