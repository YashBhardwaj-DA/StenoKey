/* ============================================================
   StenoKey — Module Data
   Each module mirrors a stage of classic typing-school drills
   (home row → reach keys → words → capitals → punctuation →
   full sentences → paragraphs), rebuilt with original lines.
   ============================================================ */

const MODULES = [
  {
    id: "home-row",
    title: "Home Row",
    level: 1,
    levelLabel: "Foundation",
    description: "Anchor your fingers on A S D F · J K L ; before reaching anywhere else.",
    lines: [
      "asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;",
      "fdsa ;lkj fdsa ;lkj fdsa ;lkj fdsa ;lkj fdsa ;lkj",
      "aass ddff jjkk ll;; aass ddff jjkk ll;; aass ddff",
      "ad sk fl ja ;d ka sl fj ad sk fl ja ;d ka sl fj ad",
      "a sad lad; a salad; a flask; ask a lad; a sad fall"
    ]
  },
  {
    id: "reach-keys",
    title: "Reach Keys",
    level: 1,
    levelLabel: "Foundation",
    description: "Stretch out one row at a time — top row, then bottom row — without losing your anchor.",
    lines: [
      "qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop",
      "zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./",
      "we go to type; you are quite ready; we try it now",
      "gftf hjyj gftf hjyj gftf hjyj gftf hjyj gftf hjyj",
      "az xc vm ,. az xc vm ,. az xc vm ,. az xc vm ,. az"
    ]
  },
  {
    id: "common-words",
    title: "Common Words",
    level: 2,
    levelLabel: "Building",
    description: "High-frequency words typed five lines each, the way every typing course builds muscle memory.",
    lines: [
      "the of and to in is you that it he was for on are",
      "as with his they at be this have from or had by hot",
      "word but not what all were when your can said there",
      "use each which she how their will other about out",
      "many then them these so some her would make like"
    ]
  },
  {
    id: "short-sentences",
    title: "Short Sentences",
    level: 2,
    levelLabel: "Building",
    description: "Whole sentences now — focus on flow between words, not just single keys.",
    lines: [
      "Honesty is the best policy.",
      "A drop in the ocean still counts.",
      "No office can run without a good typist.",
      "Practice daily and your speed will follow.",
      "Slow is smooth, and smooth is fast."
    ]
  },
  {
    id: "capitals-punctuation",
    title: "Capitals & Punctuation",
    level: 3,
    levelLabel: "Sharpening",
    description: "Shift, comma, period, and semicolon — the marks that separate clean copy from rough drafts.",
    lines: [
      "New Delhi is the capital city; Mumbai is the coast.",
      "Please, send the file today; the client is waiting.",
      "Canada, Brazil, and Russia are large by land area.",
      "She asked, \"Is the report ready?\" He said, \"Almost.\"",
      "Monday, Tuesday, Wednesday; check each one twice."
    ]
  },
  {
    id: "numbers-symbols",
    title: "Numbers & Symbols",
    level: 3,
    levelLabel: "Sharpening",
    description: "Steno work is full of figures, rupee signs, and shorthand symbols — drill them on purpose.",
    lines: [
      "Invoice #4021 totals Rs. 18,500 due by 30/06/2026.",
      "Room 12B is booked from 9:00 AM to 5:30 PM daily.",
      "The figures were 45%, 67%, and 89% across 3 years.",
      "Call (011) 4652-843 or extension 209 for support.",
      "Section 7.2 references clauses 1(a), 1(b), and 2(c)."
    ]
  },
  {
    id: "tricky-pairs",
    title: "Tricky Pairs",
    level: 4,
    levelLabel: "Precision",
    description: "Letter pairs that trip up fast typists — same-finger reaches and easily swapped letters.",
    lines: [
      "minimum jujitsu unique nylon pumpkin onion morning",
      "perpetual lullaby kayak tattoo passport possess add",
      "necessary committee occurrence accommodate embarrass",
      "rhythm tsunami quay receipt subtle gnome knowledge",
      "judgment liaison maneuver bureaucracy questionnaire"
    ]
  },
  {
    id: "shorthand-style",
    title: "Shorthand-Style Lines",
    level: 4,
    levelLabel: "Precision",
    description: "Dense, semicolon-joined clauses — closer to dictation notes than ordinary prose.",
    lines: [
      "He has the figures; she has the file; send both now.",
      "Note the date; confirm the venue; circulate the memo.",
      "Draft the minutes; attach the annexure; mail the set.",
      "Verify the totals; flag the gaps; resubmit by evening.",
      "Open the docket; staple the pages; log the timestamp."
    ]
  },
  {
    id: "paragraphs",
    title: "Full Paragraphs",
    level: 5,
    levelLabel: "Endurance",
    description: "Sustained, unbroken prose to test pacing and accuracy over a longer stretch — true dictation speed.",
    lines: [
      "A capable stenographer is judged less by raw speed and more by the steadiness of that speed across a long passage. Anyone can sprint through a single sentence; the real test begins on the third paragraph, when the hands grow tired and the mind starts to wander toward the next task waiting on the desk.",
      "Touch typing rewards patience before it rewards speed. The fingers must first learn the distance to every key without the eyes confirming it, and only after that memory is settled does it make sense to chase a higher words-per-minute count. Rushing this order produces fast typists who type fast and wrong in equal measure.",
      "Court reporters, legal stenographers, and transcriptionists all share one habit: they read ahead of where their fingers are typing. The eyes process a phrase, the mind holds it briefly, and the hands catch up a beat later. Building that lag on purpose, in practice, is what eventually makes live dictation feel calm instead of frantic.",
      "Good posture is not a footnote to good typing; it is a precondition for it. Shoulders relaxed, wrists hovering rather than resting, the screen at eye level — small adjustments like these are what let a stenographer sit through a six-hour hearing without their accuracy collapsing in the final hour.",
      "Every profession built around the keyboard eventually asks the same question: how much of this can become automatic? The answer is almost all of it, provided the early repetitions are slow, deliberate, and correct. Speed that arrives honestly, one accurate line at a time, is the only speed that survives pressure."
    ]
  }
];

// Rotating tips shown beneath the typing field.
const TIPS = [
  "Keep your wrists level and eyes on the screen, not the keyboard.",
  "Rest your fingers on the home row (A S D F · J K L ;) between words.",
  "After an error, fix it immediately — don't let mistakes pile up.",
  "Use the correct finger for every key, even if it feels slower at first.",
  "Sit with your back straight and elbows close to your body.",
  "Breathe normally — holding your breath tightens your shoulders and hands.",
  "Accuracy first, speed second. A clean 40 WPM beats a messy 70.",
  "Glance ahead at the next few words instead of typing one at a time.",
  "Use your pinky for Shift, comma, and semicolon — don't skip it.",
  "Short, frequent practice sessions beat one long, tiring one.",
  "If a drill feels too easy, jump straight to a harder module — nothing is locked.",
  "Let your fingers float just above the keys instead of pressing down hard."
];
