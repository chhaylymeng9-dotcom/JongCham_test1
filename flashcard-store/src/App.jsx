import { useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LANGUAGES, LanguageProvider, useI18n } from "./i18n.jsx";
import { getCart, getSession, setCart as persistCart } from "./storage.js";
import { DECKS, makeBuild } from "./data/decks.js";
import Store from "./pages/Store.jsx";
import Customize from "./pages/Customize.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import { Badge, cx } from "./ui.jsx";
import Reveal from "./components/Reveal.jsx";

/* ---------- App shell ----------
Single-page navigation over six views, plus the header, footer and the
language switch that wraps everything.

The cart lives here and mirrors to localStorage, so a refresh mid-order
doesn't lose a deck someone spent ten minutes designing. The in-progress
build lives here too, so it survives a trip from the store to the
Customize page and back.
--------------------------------- */

const PAGES = ["store", "customize", "cart", "checkout", "orders", "account", "about", "contact"];

function Shell() {
  const [page, setPage] = useState("store");
  const [cart, setCart] = useState(() => getCart());
  // A promo code applied on the cart page lives here so checkout honours
  // the same discount; it clears with the cart once an order is paid.
  const [promo, setPromo] = useState(null);
  const [build, setBuild] = useState(() => {
    const b = makeBuild("grammar");
    return {
      ...b,
      cards: [
        {
          ...b.cards[0],
          front: ["She go to school every day."],
          back: ["Off by one letter — it's \"goes\". Catch mistakes like this before an exam does."],
        },
      ],
    };
  });
  const [menuOpen, setMenuOpen] = useState(false);
  // Set once an order is paid for, so the now-empty cart doesn't bounce the
  // customer off their own confirmation page.
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  // Damped scrolling: wheel/trackpad input is eased through a lerp instead
  // of jumping straight to the target, so the page glides and the wheel
  // feels less twitchy — noticeably slower than native. wheelMultiplier
  // well under 1 takes the edge off each notch, and the low lerp means the
  // glide takes its time catching up instead of snapping to rest. Skipped
  // entirely under reduced motion, where the native instant scroll is what
  // people want.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ wheelMultiplier: 0.55, lerp: 0.06 });
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [page]);

  const cartCount = cart.reduce((n, item) => n + item.build.qty, 0);

  function go(next) {
    const target = PAGES.includes(next) ? next : "store";
    if (target !== "checkout") setOrderPlaced(false);
    setPage(target);
  }

  function addToCart(item) {
    setCart((c) => [...c, item]);
  }

  // "Pay now" — same as adding to cart, but skips the cart page and goes
  // straight to the address/payment flow.
  function buyNow(item) {
    setOrderPlaced(false);
    setCart((c) => [...c, item]);
    setPage("checkout");
  }

  function updateQty(cartId, qty) {
    setCart((c) =>
      c.map((item) =>
        item.cartId === cartId
          ? { ...item, build: { ...item.build, qty: Math.max(1, Math.min(99, qty)) } }
          : item
      )
    );
  }

  function removeFromCart(cartId) {
    setCart((c) => c.filter((item) => item.cartId !== cartId));
  }

  // Reaching checkout with an empty cart would strand the page — send it back.
  const activePage =
    page === "checkout" && cart.length === 0 && !orderPlaced ? "cart" : page;

  // While signed in on the account page the floating nav gives way to the
  // lesson path's own rail + header; Account reports session changes so the
  // nav can return for the sign-in form and reappear after sign-out.
  const [accountSignedIn, setAccountSignedIn] = useState(() => Boolean(getSession()));
  const hideAppNav = activePage === "account" && accountSignedIn;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideAppNav && (
        <Header page={activePage} onNavigate={go} cartCount={cartCount} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((m) => !m)} />
      )}

      <main className="flex-1">
        {activePage === "store" && (
          <Store
            build={build}
            setBuild={setBuild}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onGoToCart={() => go("cart")}
            onGoToCustomize={() => go("customize")}
          />
        )}

        {activePage === "customize" && (
          <Customize
            build={build}
            setBuild={setBuild}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onGoToCart={() => go("cart")}
            onBack={() => go("store")}
          />
        )}

        {activePage === "cart" && (
          <Cart
            items={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={() => go("checkout")}
            onBack={() => go("store")}
            promo={promo}
            onApplyPromo={setPromo}
            onRemovePromo={() => setPromo(null)}
          />
        )}

        {activePage === "checkout" && (
          <Checkout
            items={cart}
            onBack={() => go("cart")}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            promo={promo}
            onPaid={() => {
              setOrderPlaced(true);
              setCart([]);
              setPromo(null);
            }}
            onGoToAccount={() => go("account")}
            onComplete={() => go("orders")}
          />
        )}

        {activePage === "orders" && <Orders onBack={() => go("store")} />}

        {activePage === "account" && <Account onGoToOrders={() => go("orders")} onBuildDeck={() => go("customize")} onGoToCart={() => go("cart")} onSessionChange={(s) => setAccountSignedIn(Boolean(s))} />}

        {activePage === "about" && <About onNavigate={go} />}

        {activePage === "contact" && <Contact />}
      </main>

      {/* The account area (dashboard, profile, plans, lessons, exam…) is its
          own app-like flow — the marketing footer doesn't belong under it. */}
      {activePage !== "account" && <Footer onNavigate={go} />}
    </div>
  );
}

/* ---------- header ---------- */

function Header({ page, onNavigate, cartCount, menuOpen, onToggleMenu }) {
  const { t } = useI18n();

  // Header animation — the bar starts parked above the viewport and drops
  // in on load with the same ease/duration as the Reveal blocks, and once
  // the page scrolls it picks up a soft shadow so it reads as floating
  // over the content. Under reduced motion the header is simply present.
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  const [entered, setEntered] = useState(reduceMotion);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    // Flip on the frame after first paint so the parked-above state is what
    // renders first and the drop-in actually transitions.
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "store", label: t("nav.store") },
    { id: "about", label: t("nav.about") },
    { id: "contact", label: t("nav.contact") },
    { id: "cart", label: t("nav.cart"), count: cartCount },
    { id: "account", label: t("nav.account") },
  ];

  return (
    /* Floating pill navbar — the whole bar is one rounded-full card that
       hovers over the page with a small top gap, and the nav links inside
       form a tinted pill group where the active page gets a solid pill.
       The drop-in and scroll shadow live on the pill, not the wrapper. */
    <header className="sticky top-0 z-30 print:hidden px-4 sm:px-6 pt-3 sm:pt-4">
      <div
        className="max-w-6xl mx-auto rounded-full border border-ink/10 bg-paper/90 backdrop-blur-sm"
        style={
          reduceMotion
            ? undefined
            : {
                transform: entered ? "none" : "translateY(-120%)",
                transition:
                  "transform 0.9s cubic-bezier(0.2, 0.7, 0.3, 1), box-shadow 0.3s ease",
                boxShadow: scrolled
                  ? "0 8px 24px rgba(35, 32, 27, 0.1)"
                  : "0 1px 2px rgba(35, 32, 27, 0.04)",
              }
        }
      >
        <div className="px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate("store")}
          className="flex items-center gap-3 shrink-0 text-left"
        >
          <Logo />
          <span>
            <span className="block font-display text-lg leading-none">{t("brand.name")}</span>
            <span className="hidden sm:block label text-ink/45 text-[9px] mt-1">
              {t("brand.tagline")}
            </span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-3">
          {/* tinted pill group — the active page gets the solid pill */}
          <nav className="flex items-center gap-1 rounded-full border border-ink/10 bg-ink/[0.04] p-1">
            {links.map((l) => (
              <NavLink key={l.id} active={page === l.id} onClick={() => onNavigate(l.id)} count={l.count}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <span className="w-px h-5 bg-ink/15" />
          <LanguageSwitch />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitch />
          <button
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-label={t("nav.menu")}
            className="w-10 h-10 border border-ink/20 rounded-full flex flex-col items-center justify-center gap-[5px]"
          >
            <span className={cx("block w-4 h-px bg-ink transition-transform", menuOpen && "translate-y-[3px] rotate-45")} />
            <span className={cx("block w-4 h-px bg-ink transition-transform", menuOpen && "-translate-y-[3px] -rotate-45")} />
          </button>
        </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden max-w-6xl mx-auto mt-2 rounded-3xl border border-ink/10 bg-paper shadow-panel animate-fade-in overflow-hidden">
          <div className="px-5 py-3 flex flex-col">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => onNavigate(l.id)}
                className={cx(
                  "text-left py-3 border-b border-ink/10 last:border-0 flex items-center justify-between",
                  page === l.id ? "text-grease font-medium" : "text-ink/80"
                )}
              >
                {l.label}
                {l.count > 0 && <span className="font-mono text-xs">({l.count})</span>}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function NavLink({ active, onClick, count, children }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cx(
        "rounded-full px-3.5 py-1.5 text-sm transition-all duration-200",
        active
          ? "bg-ink text-paper shadow-sm"
          : "text-ink/60 hover:text-ink hover:bg-ink/[0.06]"
      )}
    >
      {children}
      {count > 0 && <span className="ml-1.5 font-mono text-xs text-grease">{count}</span>}
    </button>
  );
}

function LanguageSwitch({ light = false }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cx(
        "inline-flex items-center rounded-full p-0.5 border",
        light ? "border-cardstock/20" : "border-ink/20"
      )}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          aria-pressed={lang === l.id}
          title={l.name}
          className={cx(
            "px-2.5 py-1 rounded-full text-xs transition-colors",
            lang === l.id
              ? light
                ? "bg-cardstock text-chalk-deep"
                : "bg-chalk text-cardstock"
              : light
              ? "text-cardstock/50 hover:text-cardstock"
              : "text-ink/55 hover:text-ink"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect x="8" y="7" width="19" height="13" rx="2.5" fill="#D9C08C" stroke="#2F4538" strokeWidth="1.5" />
      <rect x="4" y="12" width="19" height="13" rx="2.5" fill="#F1E9D2" stroke="#2F4538" strokeWidth="1.5" />
      <path d="M8 17h11M8 20.5h7" stroke="#2F4538" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

/* ---------- footer ---------- */

// Real contact channels only — same handles Contact.jsx shows, so the
// footer never invents an address the rest of the site doesn't back up.
const FOOTER_EMAIL = "Jongcham@gmial.com";
const FOOTER_TELEGRAM = "@Jongcham";

// A sliding underline instead of the browser's instant one — the bar grows
// in from the left on hover rather than just snapping on.
const FOOTER_LINK =
  "relative inline-block text-cardstock/60 hover:text-cardstock transition-colors " +
  "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full " +
  "after:bg-cardstock after:origin-left after:scale-x-0 hover:after:scale-x-100 " +
  "after:transition-transform after:duration-300 after:ease-in-out";

function Footer({ onNavigate }) {
  const { t, pick } = useI18n();

  const shopLinks = [
    { label: t("footer.allSets"), onClick: () => onNavigate("store") },
    ...DECKS.map((d) => ({ label: pick(d.name), onClick: () => onNavigate("store") })),
  ];
  const learnLinks = [
    { label: t("footer.howItWorks"), onClick: () => onNavigate("about") },
    { label: t("footer.insideABox"), onClick: () => onNavigate("about") },
    { label: t("footer.lessonsAndPractice"), onClick: () => onNavigate("about") },
    { label: t("footer.examsAndCertificates"), onClick: () => onNavigate("about") },
  ];
  const helpLinks = [
    { label: t("footer.activateCode"), onClick: () => onNavigate("account") },
    { label: t("footer.trackOrder"), onClick: () => onNavigate("orders") },
    { label: t("footer.shippingHelp"), onClick: () => onNavigate("contact") },
    { label: t("footer.returnsHelp"), onClick: () => onNavigate("contact") },
    { label: t("footer.contactUs"), onClick: () => onNavigate("contact") },
    { label: t("footer.faq"), onClick: () => onNavigate("contact") },
  ];
  const companyLinks = [
    { label: t("footer.aboutBrand"), onClick: () => onNavigate("about") },
    { label: t("footer.forSchools"), tag: t("footer.bulkTag"), onClick: () => onNavigate("contact") },
    { label: t("footer.reseller"), onClick: () => onNavigate("contact") },
    { label: t("footer.privacy"), href: "#" },
    { label: t("footer.terms"), href: "#" },
  ];

  return (
    <footer className="mt-auto print:hidden bg-chalk-deep text-cardstock/65 border-t border-cardstock/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* ---------- brand + link columns ---------- */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-10 pt-12 pb-12">
          {/* Each footer column eases in on scroll, staggered left→right. */}
          <Reveal className="sm:col-span-3 lg:col-span-1">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="font-display text-lg text-cardstock leading-none">{t("brand.name")}</span>
              <span className="label text-cardstock/35 text-[8px]">{t("footer.tagline")}</span>
            </div>
            <p className="text-sm leading-relaxed text-cardstock/60 max-w-[30ch] mb-6">{t("footer.blurb")}</p>

            <div className="text-xs leading-relaxed text-cardstock/50 mb-6">
              <span className="label text-cardstock/30 block mb-1">{t("footer.workshopLabel")}</span>
              {t("contact.workshopHint")}
              <br />
              <a href={`mailto:${FOOTER_EMAIL}`} className={FOOTER_LINK}>
                {FOOTER_EMAIL}
              </a>
              <br />
              {t("checkout.telegram")}{" "}
              <a href="#" className={FOOTER_LINK}>
                {FOOTER_TELEGRAM}
              </a>
            </div>

            <div className="flex gap-2">
              <SocialIcon label="Facebook">
                <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.29-.04-1.27-.13-2.41-.13-2.39 0-4.02 1.46-4.02 4.13v2.3H7.5V14h2.76v8h3.24Z" />
              </SocialIcon>
              <SocialIcon label="Instagram" stroke>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
              </SocialIcon>
              <SocialIcon label="TikTok">
                <path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2.2-2.57V9.5a5.7 5.7 0 1 0 5.2 5.68V8.9a6.6 6.6 0 0 0 3.8 1.2V7a3.9 3.9 0 0 1-3.8-3.8V2Z" />
              </SocialIcon>
              <SocialIcon label="Telegram" stroke>
                <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />
              </SocialIcon>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <FooterColumn title={t("footer.shop")} links={shopLinks} />
          </Reveal>
          <Reveal delay={0.16}>
            <FooterColumn title={t("footer.learn")} links={learnLinks} />
          </Reveal>
          <Reveal delay={0.24}>
            <FooterColumn title={t("footer.help")} links={helpLinks} />
          </Reveal>
          <Reveal delay={0.32}>
            <FooterColumn title={t("footer.company")} links={companyLinks} />
          </Reveal>
        </div>

        {/* ---------- bottom bar ---------- */}
        <Reveal className="flex flex-wrap items-center gap-5 py-6 border-t border-cardstock/10 text-xs text-cardstock/40">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <LanguageSwitch light />
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <Badge tone="light">ABA KHQR</Badge>
            <Badge tone="light">Visa</Badge>
            <Badge tone="light">Mastercard</Badge>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs text-cardstock/35 max-w-md leading-relaxed pb-8">{t("footer.demoNotice")}</p>
        </Reveal>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="label text-cardstock/35 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a href={link.href} className={cx(FOOTER_LINK, "text-sm")}>
                {link.label}
              </a>
            ) : (
              <button type="button" onClick={link.onClick} className={cx(FOOTER_LINK, "text-sm text-left")}>
                {link.label}
              </button>
            )}
            {link.tag && (
              <span className="ml-1.5 label text-[8px] text-moss border border-moss/35 rounded-full px-1.5 py-0.5 align-middle">
                {link.tag}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label, stroke, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-cardstock/15 text-cardstock/55 flex items-center justify-center hover:text-chalk-deep hover:bg-cardstock/90 hover:border-transparent transition-colors"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={stroke ? "none" : "currentColor"}
        stroke="currentColor"
        strokeWidth={stroke ? 1.8 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
