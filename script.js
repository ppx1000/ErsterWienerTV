const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const jumpButtons = document.querySelectorAll("[data-jump]");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const filterButtons = document.querySelectorAll("[data-filter]");
const scheduleRows = document.querySelectorAll("[data-schedule] .schedule-row");
const scheduleNote = document.querySelector("[data-schedule-note]");
const scheduleEmpty = document.querySelector("[data-day-empty]");
const contactButtons = document.querySelectorAll("[data-contact-picker] button");
const mailLink = document.querySelector("[data-mail-link]");
const faqItems = document.querySelectorAll("[data-faq] .faq-item");
const ageRange = document.querySelector("[data-age-range]");
const ageOutput = document.querySelector("[data-age-output]");
const goalButtons = document.querySelectorAll("[data-goal]");
const finderTitle = document.querySelector("[data-finder-title]");
const finderCopy = document.querySelector("[data-finder-copy]");
const finderMail = document.querySelector("[data-finder-mail]");
const apparatusButtons = document.querySelectorAll("[data-apparatus-key]");
const apparatusTitle = document.querySelector("[data-apparatus-title]");
const apparatusCopy = document.querySelector("[data-apparatus-copy]");
const motionSymbol = document.querySelector("[data-motion-symbol]");
const apparatusImage = document.querySelector("[data-apparatus-image]");
const timelineButtons = document.querySelectorAll("[data-year]");
const timelineYear = document.querySelector("[data-timeline-year]");
const timelineTitle = document.querySelector("[data-timeline-title]");
const timelineCopy = document.querySelector("[data-timeline-copy]");

document.body.classList.add("js-enabled");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: "smooth" });
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.tab;

    tabButtons.forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === next);
    });
  });
});

const selectScheduleDay = (button) => {
  const day = button.dataset.filter;
  let visibleCount = 0;

  filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  scheduleRows.forEach((row) => {
    const isVisible = row.dataset.day === day;
    row.classList.toggle("is-hidden", !isVisible);
    row.classList.remove("is-selected");
    if (isVisible) visibleCount += 1;
  });

  scheduleEmpty?.classList.toggle("is-hidden", visibleCount > 0);

  if (scheduleNote) {
    scheduleNote.textContent = `${button.textContent} ausgewählt: Wähle eine Stunde, um Details zu sehen.`;
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => selectScheduleDay(button));
});

if (filterButtons.length > 0) {
  selectScheduleDay(document.querySelector("[data-filter].is-active") ?? filterButtons[0]);
}

scheduleRows.forEach((row) => {
  row.addEventListener("click", () => {
    scheduleRows.forEach((item) => item.classList.remove("is-selected"));
    row.classList.add("is-selected");
    if (scheduleNote) {
      scheduleNote.textContent = row.dataset.note ?? "Details zu dieser Stunde.";
    }
  });
});

const updateMailLink = (group) => {
  if (!mailLink) return;

  const isWaitlistGroup = ["Kleinkinderturnstunde", "Kinderturnen", "Jugendturnen"].includes(group);
  const subject = `${isWaitlistGroup ? "Wartelisten-Anfrage" : "Anfrage"} ${group}`;
  const body = [
    "Liebes EWTV-Team,",
    "",
    isWaitlistGroup
      ? "ich möchte mich bzw. mein Kind gerne auf die Warteliste setzen lassen."
      : "ich interessiere mich für das Erwachsenentraining und möchte gerne weitere Informationen erhalten.",
    "",
    "Name:",
    "Alter:",
    `Gewünschte Gruppe: ${group}`,
    "Mögliche Trainingstage:",
    "Telefonnummer:",
    "",
    "Vielen Dank!"
  ].join("\r\n");

  mailLink.href = `mailto:office@ewtv.at?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

contactButtons.forEach((button) => {
  button.addEventListener("click", () => {
    contactButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateMailLink(button.dataset.subject ?? "Turnstunde");
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");

    faqItems.forEach((faq) => {
      faq.classList.remove("is-open");
      faq.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  });
});

const finderCopyByGroup = {
  "Kleinkinderturnstunde": "Für 4-6 Jahre: spielerischer Einstieg, Koordination und erste Turngrundlagen.",
  Kinderturnen: "Für 6-9 Jahre: klare Grundlagen, Bewegungssicherheit und Freude am Turnen.",
  Jugendturnen: "Für 10-14 Jahre: mehr Technik, Kraft und selbstständiges Training in der Gruppe.",
  Wettkampfturnen: "Für 8-14 Jahre: Die Auswahl für diese Gruppe trifft das Trainerteam nach Beobachtung im laufenden Training. Ein Wechsel erfolgt auf Empfehlung.",
  Erwachsene: "Ab 15 Jahren: Kraft, Mobilität und turnerische Basics ohne Leistungsdruck. Diese Gruppe ist aktuell nicht voll."
};

const getFinderGroup = () => {
  const age = Number(ageRange?.value ?? 8);
  const activeGoal = document.querySelector("[data-goal].is-active")?.dataset.goal ?? "spielerisch";

  if (activeGoal === "wettkampf" && age >= 8 && age <= 14) return "Wettkampfturnen";
  if (age <= 5) return "Kleinkinderturnstunde";
  if (age >= 6 && age <= 9) return "Kinderturnen";
  if (age >= 10 && age <= 14) return "Jugendturnen";
  return "Erwachsene";
};

const updateFinder = () => {
  if (!ageRange || !ageOutput || !finderTitle || !finderCopy || !finderMail) return;

  const age = Number(ageRange.value);
  const group = getFinderGroup();
  ageOutput.textContent = age === 1 ? "1 Jahr" : `${age} Jahre`;
  finderTitle.textContent = group;
  finderCopy.textContent = finderCopyByGroup[group];
  finderMail.hidden = group === "Wettkampfturnen";
  finderMail.style.display = group === "Wettkampfturnen" ? "none" : "";
  finderMail.textContent =
    group === "Erwachsene"
      ? "Erwachsenentraining anfragen"
      : group === "Wettkampfturnen"
        ? "Trainerteam kontaktieren"
        : "Diese Warteliste anfragen";
  const isFinderWaitlistGroup = ["Kleinkinderturnstunde", "Kinderturnen", "Jugendturnen"].includes(group);
  finderMail.href = `mailto:office@ewtv.at?subject=${encodeURIComponent(`${isFinderWaitlistGroup ? "Wartelisten-Anfrage" : "Anfrage"} ${group}`)}`;
};

ageRange?.addEventListener("input", updateFinder);
goalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goalButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateFinder();
  });
});
updateFinder();

const apparatusContent = {
  boden: {
    symbol: "B",
    title: "Boden",
    image: "assets/apparatus-boden.jpg?v=3",
    alt: "Stilisierte Turnszene am Gerät Boden",
    copy: "Rollen, Stützen, Körperspannung und sichere Landungen bilden die Basis für vieles, was später an Geräten gebraucht wird."
  },
  reck: {
    symbol: "R",
    title: "Reck",
    image: "assets/apparatus-reck.jpg?v=3",
    alt: "Stilisierte Turnszene am Reck",
    copy: "Am Reck geht es um Griffkraft, Körperspannung und kontrolliertes Schwingen. Saubere Grundlagen machen hier den Unterschied."
  },
  barren: {
    symbol: "Ba",
    title: "Barren",
    image: "assets/apparatus-barren.jpg?v=3",
    alt: "Stilisierte Turnszene am Barren",
    copy: "Stützen, Schwingen und Halten verbinden Kraft mit Technik. Der Barren zeigt schnell, wie wichtig stabile Grundlagen sind."
  },
  balken: {
    symbol: "Bl",
    title: "Balken",
    image: "assets/apparatus-balken.jpg?v=3",
    alt: "Stilisierte Turnszene am Balken",
    copy: "Am Balken stehen Gleichgewicht, Körperspannung und konzentrierte Bewegungen im Mittelpunkt. Kleine Schritte werden hier sehr bewusst trainiert."
  },
  sprung: {
    symbol: "S",
    title: "Sprung",
    image: "assets/apparatus-sprung.jpg?v=3",
    alt: "Stilisierte Turnszene am Sprung",
    copy: "Anlauf, Abdruck und Landung werden Schritt für Schritt aufgebaut. Sicherheit und Rhythmus stehen immer vor Tempo."
  },
  minitramp: {
    symbol: "M",
    title: "Minitramp",
    image: "assets/apparatus-minitramp.jpg?v=3",
    alt: "Stilisierte Turnszene am Minitramp",
    copy: "Beim Minitramp zählen Spannung, Absprung und eine kontrollierte Landung. Es bringt Dynamik ins Training, bleibt aber klar angeleitet."
  }
};

apparatusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = apparatusContent[button.dataset.apparatusKey];
    if (!item || !apparatusTitle || !apparatusCopy || !motionSymbol) return;

    apparatusButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    if (apparatusImage) {
      apparatusImage.src = item.image;
      apparatusImage.alt = item.alt;
    }
    motionSymbol.textContent = item.symbol;
    apparatusTitle.textContent = item.title;
    apparatusCopy.textContent = item.copy;
    motionSymbol.style.animation = "none";
    requestAnimationFrame(() => {
      motionSymbol.style.animation = "";
    });
  });
});

const timelineContent = {
  tradition: {
    year: "Tradition",
    title: "Ein Verein mit Haltung",
    copy: "Turnen bedeutet Gemeinschaft, Verlässlichkeit und die Freude daran, sich Schritt für Schritt weiterzuentwickeln."
  },
  training: {
    year: "Training",
    title: "Struktur für jede Stunde",
    copy: "Gute Turnstunden brauchen klare Abläufe: ankommen, aufwärmen, üben, sichern, abschließen. Genau das macht Fortschritt sichtbar."
  },
  heute: {
    year: "Heute",
    title: "Wartelisten mit Überblick",
    copy: "Weil die Kinder- und Jugendgruppen voll sind, hilft eine klare Vormerkung. So bleiben Gruppen stabil und neue Plätze können passend vergeben werden."
  }
};

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = timelineContent[button.dataset.year];
    if (!item || !timelineYear || !timelineTitle || !timelineCopy) return;

    timelineButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    timelineYear.textContent = item.year;
    timelineTitle.textContent = item.title;
    timelineCopy.textContent = item.copy;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

const revealVisibleItems = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      item.classList.add("is-visible");
      revealObserver.unobserve(item);
    }
  });
};

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

requestAnimationFrame(revealVisibleItems);
window.addEventListener("scroll", revealVisibleItems, { passive: true });
