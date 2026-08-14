import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import ricardoPortrait from "./assets/ricardo-beccari.png";

type Category =
  | "Todos"
  | "Aviação"
  | "Arquitetura"
  | "Publicidade"
  | "Gastronomia"
  | "Retratos";
const photos = Object.entries(
  import.meta.glob("./assets/photos/*", {
    eager: true,
    query: "?url",
    import: "default",
  }),
).map(([path, src]) => ({
  id: path.split("/").pop()!.split(".")[0],
  src: src as string,
}));
const categoryIds: Record<Exclude<Category, "Todos">, string[]> = {
  Aviação: [
    "08f91b",
    "83a21d",
    "349fd2",
    "4336fb",
    "eb8311",
    "4d6054",
    "70f3a6",
    "dc0a5e",
    "67759a",
    "662763",
    "0140fb",
    "abb47e",
    "25b0e4",
    "ec1ac9",
    "618644",
    "6a3ef4",
    "dffcdd",
    "a96e3e",
  ],
  Arquitetura: [
    "f5bf3d",
    "d52bce",
    "05087f",
    "47d684",
    "bf4b01",
    "1103c7",
    "8bd079",
    "5719ce",
    "f1eb77",
    "d0d5fe",
    "05d585",
    "471357",
    "e5f4ec",
    "108d56",
    "212ed7",
    "4dd974",
    "3891f8",
    "7b8c65",
    "446129",
    "0e32a9",
    "2d2a25",
    "9be1a8",
    "23d0ec",
    "56848e",
    "bf7062",
    "054fd8",
    "c92950",
    "30ee4b",
    "bcfaa3",
    "b120fc",
    "dfc9db",
  ],
  Publicidade: [
    "3500b6",
    "77e1d9",
    "6117bf",
    "00a284",
    "3ac629",
    "9fb85a",
    "17b19e",
    "cbe585",
    "ad92cf",
    "97389c",
    "204f89",
    "26b12b",
    "b4c559",
    "463a8b",
    "830e5f",
    "f33c98",
    "0d454e",
    "8bec79",
    "c79769",
  ],
  Gastronomia: [
    "14bdd1",
    "067845",
    "d5525d",
    "6c7770",
    "ee015c",
    "4b39e7",
    "9cf84f",
    "4d389b",
    "d0e24d",
    "868ad7",
    "e251da",
    "85522c",
    "633680",
    "10bd2b",
    "d48c77",
    "60ca14",
  ],
  Retratos: [
    "170188",
    "b0e714",
    "8e793f",
    "70c09c",
    "c73ee9",
    "6c6772",
    "9ac4e5",
    "9b2b37",
    "b9525c",
    "b3da73",
  ],
};
const categories = Object.keys(categoryIds) as Exclude<Category, "Todos">[];
const categoryOf = (id: string) =>
  categories.find((category) =>
    categoryIds[category].some((prefix) => id.startsWith(prefix)),
  ) ?? "Publicidade";
const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Instagram = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
  </svg>
);

function App() {
  const [active, setActive] = useState<Category>("Todos");
  const [selected, setSelected] = useState<(typeof photos)[number] | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(
    window.location.pathname.toLowerCase().includes("ricardo")
      ? "ricardo"
      : "home",
  );
  const [locale, setLocale] = useState<"pt" | "en">(() =>
    localStorage.getItem("beccari-locale") === "en" ? "en" : "pt",
  );
  const [activeBook, setActiveBook] = useState(0);
  const bookRail = useRef<HTMLDivElement>(null);
  const t = (pt: string, en: string) => (locale === "pt" ? pt : en);
  const visible = useMemo(
    () =>
      active === "Todos"
        ? photos
        : photos.filter((photo) => categoryOf(photo.id) === active),
    [active],
  );
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    document.body.classList.add("locked");
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("locked");
    };
  }, [selected]);
  useEffect(() => {
    const updateRoute = () =>
      setRoute(
        window.location.pathname.toLowerCase().includes("ricardo")
          ? "ricardo"
          : "home",
      );
    window.addEventListener("popstate", updateRoute);
    return () => window.removeEventListener("popstate", updateRoute);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    localStorage.setItem("beccari-locale", locale);
  }, [locale]);
  useEffect(() => {
    const rail = bookRail.current;
    const section = rail?.closest<HTMLElement>(".bio-work");
    if (!rail || !section) return;
    let frame = 0;
    const syncHorizontalScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const distance = section.offsetHeight - window.innerHeight;
        const progress = Math.max(
          0,
          Math.min(1, (window.scrollY - sectionTop) / distance),
        );
        rail.scrollLeft = progress * (rail.scrollWidth - rail.clientWidth);
      });
    };
    window.addEventListener("scroll", syncHorizontalScroll, { passive: true });
    window.addEventListener("resize", syncHorizontalScroll);
    syncHorizontalScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncHorizontalScroll);
      window.removeEventListener("resize", syncHorizontalScroll);
    };
  }, [route]);
  const languageButton = (
    <button
      className="language-toggle"
      type="button"
      onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
      aria-label={t(
        "Traduzir site para inglês",
        "Translate website to Portuguese",
      )}
    >
      <span className={locale === "pt" ? "selected" : ""}>PT</span>
      <i>/</i>
      <span className={locale === "en" ? "selected" : ""}>EN</span>
    </button>
  );
  const books = [
    {
      year: "2012",
      title: t("Na Trilha da “Fumaça”", "On the Trail of the Smoke Squadron"),
      role: t("Autor", "Author"),
      image: "349fd2",
      text: t(
        "Um livro de arte fotográfica com 176 imagens produzidas ao longo de oito anos acompanhando o Esquadrão de Demonstração Aérea. A obra atravessa voos sobre o Caribe, a Cordilheira dos Andes, os Estados Unidos, a Europa e a América do Sul.",
        "A photographic art book featuring 176 images created over eight years alongside the Brazilian Air Demonstration Squadron, crossing the Caribbean, the Andes, the United States, Europe and South America.",
      ),
    },
    {
      year: "2013",
      title: t("Brasil Visto de Cima", "Brazil From Above"),
      role: t("Coautor", "Co-author"),
      image: "56848e",
      text: t(
        "Participação de Ricardo Beccari em uma obra coletiva dedicada a apresentar o território brasileiro por uma perspectiva aérea, aproximando paisagem, escala e fotografia.",
        "Ricardo Beccari contributed to this collective work dedicated to presenting Brazil from an aerial perspective, bringing together landscape, scale and photography.",
      ),
    },
    {
      year: "2013",
      title: t("Técnicas de Fotografia", "Photography Techniques"),
      role: t("Coautor", "Co-author"),
      image: "6117bf",
      text: t(
        "Obra coletiva com participação de Beccari, reunindo experiências e conhecimentos ligados à prática fotográfica profissional.",
        "A collective work featuring Beccari’s contribution, bringing together experience and knowledge connected to professional photographic practice.",
      ),
    },
    {
      year: "2015",
      title: t("Museu, Asas de um Sonho", "Museum, Wings of a Dream"),
      role: t("Autor", "Author"),
      image: "08f91b",
      text: t(
        "Em 160 páginas e mais de 80 imagens, o livro conta a formação do museu de aviação, da chegada e restauração das aeronaves à exposição no hangar, acompanhado pelos relatos de João Francisco Amaro.",
        "Across 160 pages and more than 80 images, the book tells the story of the aviation museum, from the arrival and restoration of aircraft to their hangar exhibition, accompanied by accounts from João Francisco Amaro.",
      ),
    },
    {
      year: "2022",
      title: "AIRPLANES",
      role: t("Autor", "Author"),
      image: "4336fb",
      text: t(
        "Uma edição fotográfica dedicada à diversidade das máquinas voadoras: aeronaves vintage e clássicas, jatos executivos e comerciais, aviões militares e agrícolas e asas rotativas.",
        "A photographic edition devoted to the diversity of flying machines: vintage and classic aircraft, executive and commercial jets, military and agricultural airplanes, and rotorcraft.",
      ),
    },
    {
      year: "2024",
      title: "AIRPLANES II",
      role: t("Autor", "Author"),
      image: "618644",
      text: t(
        "A continuação do projeto autoral amplia a coleção de imagens de aeronaves de Ricardo Beccari e celebra a cultura e a história da aviação no Brasil e no mundo.",
        "The continuation of the authorial project expands Ricardo Beccari’s collection of aircraft images and celebrates aviation culture and history in Brazil and around the world.",
      ),
    },
  ];
  const updateActiveBook = () => {
    if (!bookRail.current) return;
    const center =
      bookRail.current.scrollLeft + bookRail.current.clientWidth / 2;
    const cards = [
      ...bookRail.current.querySelectorAll<HTMLElement>(".book-card"),
    ];
    const closest = cards.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) <
        best.distance
          ? {
              index,
              distance: Math.abs(
                card.offsetLeft + card.offsetWidth / 2 - center,
              ),
            }
          : best,
      { index: 0, distance: Infinity },
    );
    setActiveBook(closest.index);
  };
  const navigate = (page: "home" | "ricardo") => {
    window.history.pushState({}, "", page === "ricardo" ? "/ricardo" : "/");
    setRoute(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (route === "ricardo")
    return (
      <>
        <header className="site-header">
          <a
            className="brand"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
          >
            <strong>BECCARI</strong>
            <span>PHOTO</span>
          </a>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={t("Abrir menu", "Open menu")}
          >
            <span />
            <span />
          </button>
          <nav className={menuOpen ? "open" : ""}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("home");
              }}
            >
              {t("Trabalhos", "Work")}
            </a>
            <a className="current" href="/ricardo">
              {t("Sobre", "About")}
            </a>
            <a href="#bio-contato">{t("Contato", "Contact")}</a>
            {languageButton}
          </nav>
        </header>
        <main className="bio-page">
          <section className="bio-hero">
            <div className="bio-title">
              <p className="eyebrow">
                {t(
                  "Fotógrafo • Autor • Apresentador",
                  "Photographer • Author • Presenter",
                )}
              </p>
              <h1>
                Ricardo
                <br />
                <em>Beccari</em>
              </h1>
              <p className="bio-lead">
                {t(
                  "Um olhar construído entre a precisão da aviação e a sensibilidade de quem fotografa histórias há mais de quatro décadas.",
                  "A vision shaped by the precision of aviation and the sensitivity of someone who has photographed stories for over four decades.",
                )}
              </p>
            </div>
            <figure>
              <img
                src={ricardoPortrait}
                alt={t(
                  "Retrato do fotógrafo Ricardo Beccari",
                  "Portrait of photographer Ricardo Beccari",
                )}
              />
              <figcaption>
                {t("São Paulo, Brasil", "São Paulo, Brazil")}
              </figcaption>
            </figure>
          </section>
          <section className="bio-intro">
            <div className="section-heading">
              <div>
                <span>01</span>
                <h2>{t("Uma vida em imagens", "A life in images")}</h2>
              </div>
              <p>{t("Desde 1982", "Since 1982")}</p>
            </div>
            <div className="bio-intro-grid">
              <p className="bio-drop">
                {t(
                  "Nascido em São Paulo, Ricardo encontrou na fotografia uma forma de unir técnica, movimento e emoção.",
                  "Born in São Paulo, Ricardo found in photography a way to unite technique, movement and emotion.",
                )}
              </p>
              <div>
                <p>
                  {t(
                    "Fotógrafo profissional desde 1982, abriu seu primeiro estúdio em 1989 e construiu uma carreira que atravessa a fotografia publicitária, a arquitetura, a gastronomia, o retrato e, sobretudo, sua grande paixão: a aviação.",
                    "A professional photographer since 1982, he opened his first studio in 1989 and built a career spanning advertising, architecture, food, portraiture and, above all, his great passion: aviation.",
                  )}
                </p>
                <p>
                  {t(
                    "Radialista e apresentador dos programas Porta de Hangar e PH Radar, ampliou seu compromisso de contar histórias sobre o universo aeronáutico.",
                    "A radio host and presenter of Porta de Hangar and PH Radar, he expanded his commitment to telling stories about the world of aviation.",
                  )}
                </p>
              </div>
            </div>
          </section>
          <section className="bio-quote">
            <blockquote>
              {t(
                "Quatro décadas transformando técnica, movimento e emoção em imagem.",
                "Four decades transforming technique, movement and emotion into images.",
              )}
            </blockquote>
            <p>
              {t(
                "Uma trajetória dedicada à fotografia",
                "A lifetime dedicated to photography",
              )}
            </p>
          </section>
          <section className="bio-work">
            <div className="bio-work-sticky">
              <div className="section-heading light">
                <div>
                  <span>02</span>
                  <h2>{t("Obra publicada", "Published work")}</h2>
                </div>
              </div>
              <div className="book-progress" aria-hidden="true">
                <span
                  style={{
                    width: `${((activeBook + 1) / books.length) * 100}%`,
                  }}
                />
              </div>
              <div
                className="book-rail"
                ref={bookRail}
                onScroll={updateActiveBook}
                aria-label={t(
                  "Livros publicados por Ricardo Beccari",
                  "Books published by Ricardo Beccari",
                )}
              >
                {books.map((book, index) => {
                  const photo = photos.find((item) =>
                    item.id.startsWith(book.image),
                  );
                  return (
                    <article
                      className={`book-card ${activeBook === index ? "is-active" : ""}`}
                      key={book.year + book.title}
                    >
                      <div className="book-visual">
                        {photo && <img src={photo.src} alt="" loading="lazy" />}
                        <span>
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(books.length).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="book-content">
                        <div>
                          <time>{book.year}</time>
                          <span>{book.role}</span>
                        </div>
                        <h3>{book.title}</h3>
                        <p>{book.text}</p>
                      </div>
                    </article>
                  );
                })}
                <div className="book-end" aria-hidden="true">
                  {t("Fim da coleção", "End of collection")}
                </div>
              </div>
              <div className="book-counter" aria-live="polite">
                <p>
                  {String(activeBook + 1).padStart(2, "0")} /{" "}
                  {String(books.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </section>
          <section className="bio-recognition">
            <div className="section-heading">
              <div>
                <span>03</span>
                <h2>{t("Reconhecimento", "Recognition")}</h2>
              </div>
            </div>
            <div className="recognition-grid">
              <article>
                <p className="eyebrow">{t("Exposições", "Exhibitions")}</p>
                <ul>
                  <li>Banco Real — Centro Cultural Vergueiro</li>
                  <li>Sé Subway Station</li>
                  <li>Canon EAA — Oshkosh, 2008–2011</li>
                  <li>Adventure Sports Fair — Ibirapuera Biennial</li>
                  <li>Air to Air — EAB, 2012</li>
                  <li>
                    {t(
                      "São Paulo por Ricardo Beccari",
                      "São Paulo by Ricardo Beccari",
                    )}
                    , 2018
                  </li>
                </ul>
              </article>
              <article>
                <p className="eyebrow">
                  {t("Prêmios & honrarias", "Awards & honors")}
                </p>
                <ul>
                  <li>Aviation Week — Commercial Air to Air, USA</li>
                  <li>PDN Aviation Marketing, USA</li>
                  <li>
                    {t(
                      "Membro honorário #37 da Esquadrilha da Fumaça",
                      "Honorary member #37 of the Brazilian Smoke Squadron",
                    )}
                  </li>
                  <li>
                    {t(
                      "Colaborador Emérito do Exército Brasileiro",
                      "Emeritus Contributor to the Brazilian Army",
                    )}
                  </li>
                  <li>International Society for Aviation Photography</li>
                </ul>
              </article>
              <article>
                <p className="eyebrow">{t("Na mídia", "In the media")}</p>
                <ul>
                  <li>Programa do Jô — Globo</li>
                  <li>Visão Masculina — Gazeta</li>
                  <li>Receita pra Dois — Record News</li>
                  <li>Programa Darcio Arruda — TV+</li>
                  <li>Domingo Legal — SBT</li>
                </ul>
              </article>
            </div>
          </section>
          <section className="bio-gallery">
            <img
              src={photos.find((photo) => photo.id.startsWith("349fd2"))?.src}
              alt={t(
                "Aeronave fotografada por Ricardo Beccari",
                "Aircraft photographed by Ricardo Beccari",
              )}
            />
            <div>
              <p className="eyebrow">{t("Especialidade", "Specialty")}</p>
              <h2>
                {t("Aviação vista", "Aviation seen")}
                <br />
                <em>{t("de perto.", "up close.")}</em>
              </h2>
              <p>
                {t(
                  "Imagens feitas com conhecimento técnico, planejamento e intimidade com o voo.",
                  "Images created with technical knowledge, planning and an intimate understanding of flight.",
                )}
              </p>
              <a
                className="primary-cta"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("home");
                }}
              >
                {t("Ver portfólio", "View portfolio")} <Arrow />
              </a>
            </div>
          </section>
          <section className="contact" id="bio-contato">
            <p className="eyebrow">
              {t("Vamos criar juntos", "Let’s create together")}
            </p>
            <h2>
              {t("Conte sua", "Tell your")}
              <br />
              {t("história.", "story.")}
            </h2>
            <a
              className="contact-link"
              href="mailto:contato@beccariphoto.com.br"
            >
              contato@beccariphoto.com.br <Arrow />
            </a>
          </section>
        </main>
        <footer>
          <a
            className="brand"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
          >
            <strong>BECCARI</strong>
            <span>PHOTO</span>
          </a>
          <p>© {new Date().getFullYear()} Ricardo Beccari</p>
          <p className="copyright-notice">
            {t(
              "Uso restrito. É proibida a reprodução ou divulgação das imagens sem autorização prévia do autor.",
              "Restricted use. Reproduction or distribution of these images without the author's prior permission is prohibited.",
            )}
          </p>
          <a
            className="instagram"
            href="https://www.instagram.com/ricardobeccarifotografo/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram /> Instagram
          </a>
        </footer>
      </>
    );
  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label={t("Beccari Photo, início", "Beccari Photo, home")}
        >
          <strong>BECCARI</strong>
          <span>PHOTO</span>
        </a>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={t("Abrir menu", "Open menu")}
        >
          <span />
          <span />
        </button>
        <nav
          className={menuOpen ? "open" : ""}
          aria-label={t("Navegação principal", "Main navigation")}
        >
          <a href="#trabalhos" onClick={() => setMenuOpen(false)}>
            {t("Trabalhos", "Work")}
          </a>
          <a
            className="nav-cta"
            href="/ricardo"
            onClick={(e) => {
              e.preventDefault();
              navigate("ricardo");
            }}
          >
            {t("Conheça Beccari", "Meet Beccari")} <Arrow />
          </a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>
            {t("Contato", "Contact")}
          </a>
          {languageButton}
        </nav>
      </header>
      <main id="top">
        <section className="hero">
          <p className="eyebrow">
            {t(
              "Fotografia comercial & autoral",
              "Commercial & fine art photography",
            )}
          </p>
          <h1>
            {t("Histórias em", "Stories in")}
            <br />
            <em>{t("cada perspectiva.", "every perspective.")}</em>
          </h1>
          <div className="hero-meta">
            <p>
              {t(
                "Ricardo Beccari transforma movimento, espaço e matéria em imagens que permanecem.",
                "Ricardo Beccari transforms movement, space and matter into images that endure.",
              )}
            </p>
            <a href="#trabalhos">
              {t("Explorar trabalhos", "Explore the work")} <Arrow />
            </a>
          </div>
        </section>
        <section className="portfolio" id="trabalhos">
          <div className="section-heading">
            <div>
              <span>01</span>
              <h2>{t("Portfólio selecionado", "Selected portfolio")}</h2>
            </div>
            <p>
              {visible.length.toString().padStart(2, "0")}{" "}
              {t("imagens", "images")}
            </p>
          </div>
          <div
            className="filters"
            role="group"
            aria-label={t("Filtrar fotografias", "Filter photographs")}
          >
            {(["Todos", ...categories] as Category[]).map((category) => (
              <button
                key={category}
                className={active === category ? "active" : ""}
                onClick={() => setActive(category)}
              >
                {locale === "pt"
                  ? category
                  : {
                      Todos: "All",
                      Aviação: "Aviation",
                      Arquitetura: "Architecture",
                      Publicidade: "Advertising",
                      Gastronomia: "Food",
                      Retratos: "Portraits",
                    }[category]}
              </button>
            ))}
          </div>
          <div className="masonry" aria-live="polite">
            {visible.map((photo, index) => (
              <button
                className="photo"
                key={photo.id}
                onClick={() => setSelected(photo)}
                aria-label={t(
                  `Ampliar fotografia de ${categoryOf(photo.id)}`,
                  `Enlarge ${categoryOf(photo.id)} photograph`,
                )}
              >
                <img
                  src={photo.src}
                  alt={t(
                    `Fotografia de ${categoryOf(photo.id).toLowerCase()} por Ricardo Beccari`,
                    `Photograph by Ricardo Beccari`,
                  )}
                  loading={index < 8 ? "eager" : "lazy"}
                />
                <span>
                  <b>{categoryOf(photo.id)}</b>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="about" id="sobre">
          <div className="section-heading light">
            <div>
              <span>02</span>
              <h2>
                {t("O olhar por trás da lente", "The eye behind the lens")}
              </h2>
            </div>
          </div>
          <div className="about-copy">
            <p className="statement">
              {t("Precisão técnica.", "Technical precision.")}
              <br />
              <em>{t("Sensibilidade humana.", "Human sensitivity.")}</em>
            </p>
            <div>
              <p>
                {t(
                  "Do hangar ao estúdio, da arquitetura à gastronomia, cada trabalho nasce de uma leitura cuidadosa da luz, das formas e da história que precisa ser contada.",
                  "From hangar to studio, architecture to food, every project begins with a careful reading of light, form and the story that needs to be told.",
                )}
              </p>
              <a
                className="primary-cta inverse"
                href="/ricardo"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("ricardo");
                }}
              >
                {t("Conheça Beccari", "Meet Beccari")} <Arrow />
              </a>
            </div>
          </div>
        </section>
        <section className="contact" id="contato">
          <p className="eyebrow">
            {t("Vamos criar juntos", "Let’s create together")}
          </p>
          <h2>
            {t("Tem um projeto", "Have a project")}
            <br />
            {t("em mente?", "in mind?")}
          </h2>
          <a className="contact-link" href="mailto:contato@beccariphoto.com.br">
            contato@beccariphoto.com.br <Arrow />
          </a>
        </section>
      </main>
      <footer>
        <a className="brand" href="#top">
          <strong>BECCARI</strong>
          <span>PHOTO</span>
        </a>
        <p>© {new Date().getFullYear()} Ricardo Beccari</p>
        <p className="copyright-notice">
          {t(
            "Uso restrito. É proibida a reprodução ou divulgação das imagens sem autorização prévia do autor.",
            "Restricted use. Reproduction or distribution of these images without the author's prior permission is prohibited.",
          )}
        </p>
        <a
          className="instagram"
          href="https://www.instagram.com/ricardobeccarifotografo/"
          target="_blank"
          rel="noreferrer"
        >
          <Instagram /> Instagram
        </a>
      </footer>
      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Fotografia ampliada"
          onClick={() => setSelected(null)}
        >
          <button
            className="close"
            onClick={() => setSelected(null)}
            aria-label="Fechar imagem"
          >
            Fechar <span>×</span>
          </button>
          <img
            src={selected.src}
            alt={`Fotografia ampliada de ${categoryOf(selected.id)}`}
            onClick={(event) => event.stopPropagation()}
          />
          <p>{categoryOf(selected.id)} — Ricardo Beccari</p>
        </div>
      )}
    </>
  );
}
export default App;
