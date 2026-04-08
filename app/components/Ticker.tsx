export default function Ticker() {
  const items = [
    "Na Hook (feat. Costa & Marley)",
    "Kachal Kasi (feat. Smokio)",
    "Bashawa",
    "ගෑනු නැකත (Gaanu Nakatha)",
    "තේරෙයි කල් යයි (Theruyi Kal Yayi) (feat. Lil Rome Asha)",
    "Paramanu (පරමාණු)",
    "මදේ හිස් ඩිස් (Made His Dis)",
    "Visakuru Charitha (feat. S.H.A.G.I & Safa)",
    "දේවත්වෙන් (Dewathwen)",
    "Fake Chandi",
    "Mama Mama Maai",
    "දහම (Dahama)",
    "Yakkunge Vimane",
    "Ahasa Gugura",
  ];

  const repeated = [...items, ...items];

  return (
    <div className="bg-crimson overflow-hidden py-3 relative z-10">
      <div className="marquee-inner">
        {repeated.map((item, i) => (
          <span key={i} className="font-oswald text-xs tracking-[0.2em] uppercase text-white/90 flex items-center">
            {item}
            <span className="mx-8 text-white/30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}