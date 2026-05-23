import { notFound } from 'next/navigation';
import type { ComponentType, ReactNode } from 'react';
import { flags } from '@/lib/config/env';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import {
  ActivityDot,
  Banner,
  BarSeries,
  BelanjaCardCompact,
  BelanjaCardEditorial,
  BelanjaCardPasar,
  BelanjaCardWarm,
  CandleSeries,
  CapturedStamp,
  CategoryBar,
  DawnRibbon,
  DeltaWidget,
  DonutMini,
  EmptyPanel,
  ForecastIllust,
  GlyphAyam,
  GlyphCabai,
  GlyphLele,
  GlyphTahu,
  GlyphTempe,
  HeatStrip,
  IconArrowL,
  IconArrowR,
  IconBag,
  IconBell,
  IconCalendar,
  IconCash,
  IconChartBar,
  IconChartCandle,
  IconChartLine,
  IconCheck,
  IconCheckCircle,
  IconChevronD,
  IconChevronR,
  IconClock,
  IconClose,
  IconCloseCircle,
  IconCloud,
  IconCopy,
  IconDonut,
  IconDots,
  IconDownload,
  IconEdit,
  IconEye,
  IconFilter,
  IconHamburger,
  IconHeart,
  IconHistory,
  IconHome,
  IconInfo,
  IconLink,
  IconLock,
  IconMic,
  IconMoon,
  IconNote,
  IconOffline,
  IconPackage,
  IconPartlyCloud,
  IconPercent,
  IconPin,
  IconPlus,
  IconRain,
  IconReceipt,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconShare,
  IconShop,
  IconSort,
  IconSpark,
  IconStar,
  IconStorm,
  IconSun,
  IconSyncing,
  IconTarget,
  IconTicker,
  IconTrash,
  IconTrendDown,
  IconTrendFlat,
  IconTrendUp,
  IconUnlock,
  IconWallet,
  IconWarnTriangle,
  IconWhatsapp,
  IllustDone,
  IllustError,
  IllustNoData,
  IllustNoHistory,
  IllustOffline,
  IllustSearch,
  InlineAlert,
  LedgerStripe,
  MarketMascot,
  MiniWeather,
  NotebookFold,
  OnbDecorLokasi,
  OnbDecorMenu,
  OnbDecorNama,
  ProgressMeter,
  PushPreview,
  SavedSeal,
  SceneBerawan,
  SceneBerkabut,
  SceneCerah,
  SceneHujan,
  ScenePetir,
  SceneSubuh,
  SectionLabel,
  SignatureSeal,
  type SkIconProps,
  SkBottomNav,
  SkButton,
  SkCard,
  SkCountUp,
  SkInput,
  SkLabel,
  SkOverline,
  SkPill,
  SkSteps,
  SkThinking,
  SkTopBar,
  SkWeatherChip,
  Sparkline,
  SuccessIllust,
  TallyCounter,
  TallyStamp,
  TickerBanner,
  Toast,
  WarungMark,
  WelcomeHero,
  WordLogo,
} from '@/components/ui-kit';

export const metadata = {
  title: 'UI Kit · Stockast',
  robots: { index: false, follow: false },
};

interface IconEntry {
  name: string;
  Icon: ComponentType<SkIconProps>;
}

const ICONS: ReadonlyArray<IconEntry> = [
  { name: 'home', Icon: IconHome },
  { name: 'note', Icon: IconNote },
  { name: 'history', Icon: IconHistory },
  { name: 'settings', Icon: IconSettings },
  { name: 'shop', Icon: IconShop },
  { name: 'calendar', Icon: IconCalendar },
  { name: 'clock', Icon: IconClock },
  { name: 'hamburger', Icon: IconHamburger },
  { name: 'dots', Icon: IconDots },
  { name: 'search', Icon: IconSearch },
  { name: 'filter', Icon: IconFilter },
  { name: 'sort', Icon: IconSort },
  { name: 'arrowR', Icon: IconArrowR },
  { name: 'arrowL', Icon: IconArrowL },
  { name: 'chevronR', Icon: IconChevronR },
  { name: 'chevronD', Icon: IconChevronD },
  { name: 'plus', Icon: IconPlus },
  { name: 'close', Icon: IconClose },
  { name: 'check', Icon: IconCheck },
  { name: 'edit', Icon: IconEdit },
  { name: 'trash', Icon: IconTrash },
  { name: 'copy', Icon: IconCopy },
  { name: 'share', Icon: IconShare },
  { name: 'link', Icon: IconLink },
  { name: 'download', Icon: IconDownload },
  { name: 'refresh', Icon: IconRefresh },
  { name: 'eye', Icon: IconEye },
  { name: 'lock', Icon: IconLock },
  { name: 'unlock', Icon: IconUnlock },
  { name: 'pin', Icon: IconPin },
  { name: 'star', Icon: IconStar },
  { name: 'heart', Icon: IconHeart },
  { name: 'mic', Icon: IconMic },
  { name: 'moon', Icon: IconMoon },
  { name: 'checkCircle', Icon: IconCheckCircle },
  { name: 'closeCircle', Icon: IconCloseCircle },
  { name: 'warnTriangle', Icon: IconWarnTriangle },
  { name: 'info', Icon: IconInfo },
  { name: 'spark', Icon: IconSpark },
  { name: 'syncing', Icon: IconSyncing },
  { name: 'offline', Icon: IconOffline },
  { name: 'bell', Icon: IconBell },
  { name: 'trendUp', Icon: IconTrendUp },
  { name: 'trendDown', Icon: IconTrendDown },
  { name: 'trendFlat', Icon: IconTrendFlat },
  { name: 'chartLine', Icon: IconChartLine },
  { name: 'chartBar', Icon: IconChartBar },
  { name: 'chartCandle', Icon: IconChartCandle },
  { name: 'donut', Icon: IconDonut },
  { name: 'target', Icon: IconTarget },
  { name: 'cash', Icon: IconCash },
  { name: 'wallet', Icon: IconWallet },
  { name: 'percent', Icon: IconPercent },
  { name: 'receipt', Icon: IconReceipt },
  { name: 'ticker', Icon: IconTicker },
  { name: 'bag', Icon: IconBag },
  { name: 'package', Icon: IconPackage },
  { name: 'whatsapp', Icon: IconWhatsapp },
  { name: 'sun', Icon: IconSun },
  { name: 'cloud', Icon: IconCloud },
  { name: 'rain', Icon: IconRain },
  { name: 'storm', Icon: IconStorm },
  { name: 'partlyCloud', Icon: IconPartlyCloud },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="sk-overline">{title}</div>
      {children}
    </section>
  );
}

export default function UiKitPreviewPage() {
  if (!flags.uiKitPreview && process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main className="sk-screen" style={{ minHeight: '100vh', padding: '24px 22px 80px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <div className="sk-display" style={{ fontSize: 14, color: 'var(--sk-text-2)' }}>
            Stockast — Internal
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.022em', margin: 0 }}>
            UI Kit reference
          </h1>
          <p style={{ fontSize: 13, color: 'var(--sk-text-3)', marginTop: 6, maxWidth: 520 }}>
            Live preview of every UI Kit export. Toggle Subuh to spot-check both palettes. Hidden
            from production unless `FEATURE_UI_KIT_PREVIEW=true`.
          </p>
        </div>
        <SubuhToggle />
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Section title="Brand">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
            <WordLogo />
            <MarketMascot />
          </div>
          <WelcomeHero />
          <TickerBanner />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <ForecastIllust />
            <SuccessIllust />
          </div>
        </Section>

        <Section title="Icons">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              gap: 4,
            }}
          >
            {ICONS.map(({ name, Icon }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 8px',
                  background: 'var(--sk-surface)',
                  border: '1px solid var(--sk-line)',
                  borderRadius: 8,
                }}
              >
                <Icon size={22} />
                <span style={{ fontSize: 10.5, color: 'var(--sk-text-3)' }}>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Item glyphs">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--sk-text-2)' }}>
            {[
              { name: 'Lele', G: GlyphLele },
              { name: 'Ayam', G: GlyphAyam },
              { name: 'Tahu', G: GlyphTahu },
              { name: 'Tempe', G: GlyphTempe },
              { name: 'Cabai', G: GlyphCabai },
            ].map(({ name, G }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  background: 'var(--sk-surface)',
                  border: '1px solid var(--sk-line)',
                  borderRadius: 10,
                }}
              >
                <G size={44} />
                <span style={{ fontSize: 11.5, color: 'var(--sk-text-3)' }}>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Weather scenes">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 12,
            }}
          >
            <SceneCerah />
            <SceneBerawan />
            <SceneHujan />
            <ScenePetir />
            <SceneSubuh />
            <SceneBerkabut />
          </div>
        </Section>

        <Section title="Atmospheric motifs">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--sk-text-2)' }}
          >
            <DawnRibbon weather="rain" />
            <DawnRibbon weather="sun" />
            <DawnRibbon weather="cloud" subuh />
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <SignatureSeal />
              <TallyStamp count={24} />
              <CapturedStamp count={5} />
              <SavedSeal time="03:12" />
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <NotebookFold />
              <WarungMark />
              <MiniWeather kind="rain" size={32} />
              <MiniWeather kind="cloud" size={32} />
              <MiniWeather kind="sun" size={32} />
            </div>
            <LedgerStripe />
            <CategoryBar label="Protein" count={2} />
            <SectionLabel>Akun</SectionLabel>
          </div>
        </Section>

        <Section title="Empty states">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            <EmptyPanel
              illust={IllustNoData}
              title="Belum ada catatan"
              body="Catat satu hari, hari berikutnya jalan."
            />
            <EmptyPanel
              illust={IllustNoHistory}
              title="Minggu pertama"
              body="Tunggu 7 hari, polanya akan terbaca."
            />
            <EmptyPanel
              illust={IllustOffline}
              title="Lagi tidak online"
              body="Catatan disimpan di sini, sinkron saat sinyal kembali."
            />
            <EmptyPanel
              illust={IllustError}
              title="Ada yang ngambek"
              body="Coba ulang sebentar lagi."
            />
            <EmptyPanel
              illust={IllustSearch}
              title="Tidak ada yang cocok"
              body="Coba kata kunci lain."
            />
            <EmptyPanel illust={IllustDone} title="Beres" body="Semua sudah ditangani." />
          </div>
        </Section>

        <Section title="Onboarding decor">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            <div
              style={{
                background: 'var(--sk-surface)',
                border: '1px solid var(--sk-line)',
                borderRadius: 12,
                padding: 12,
                color: 'var(--sk-text)',
              }}
            >
              <OnbDecorNama />
            </div>
            <div
              style={{
                background: 'var(--sk-surface)',
                border: '1px solid var(--sk-line)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <OnbDecorLokasi />
            </div>
            <div
              style={{
                background: 'var(--sk-surface)',
                border: '1px solid var(--sk-line)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <OnbDecorMenu />
            </div>
          </div>
        </Section>

        <Section title="Primitives — Buttons">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <SkButton variant="primary">Primary</SkButton>
            <SkButton variant="brand">Brand</SkButton>
            <SkButton variant="secondary">Secondary</SkButton>
            <SkButton variant="ghost">Ghost</SkButton>
            <SkButton variant="primary" size="lg">
              Large
            </SkButton>
            <SkButton variant="primary" size="sm">
              Small
            </SkButton>
            <SkButton variant="brand" leading={<IconWhatsapp size={16} />}>
              With icon
            </SkButton>
          </div>
        </Section>

        <Section title="Primitives — Pills + tags">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <SkPill>Default</SkPill>
            <SkPill tone="success" dot>
              Pola jelas
            </SkPill>
            <SkPill tone="warn" dot>
              Data baru
            </SkPill>
            <SkPill tone="danger">Penting</SkPill>
            <SkPill tone="brand">10% off</SkPill>
            <SkWeatherChip kind="rain" time="Sore" />
            <SkWeatherChip kind="sun" time="Pagi" />
            <SkWeatherChip kind="cloud" time="Siang" />
          </div>
        </Section>

        <Section title="Primitives — Form + chrome">
          <SkCard
            tone="muted"
            style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}
          >
            <SkLabel hint="Tulis nama warung agar catatan harianmu tetap rapi">Nama warung</SkLabel>
            <SkInput placeholder="Warung Maju Jaya" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkSteps count={3} current={1} />
              <SkButton variant="primary">Lanjut</SkButton>
            </div>
            <SkOverline>Status</SkOverline>
            <div
              style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--sk-text-2)' }}
            >
              <SkThinking />
              <span style={{ fontSize: 13 }}>AI sedang membaca</span>
            </div>
            <SkCountUp to={128} className="sk-mono" style={{ fontSize: 28, fontWeight: 600 }} />
          </SkCard>
        </Section>

        <Section title="Primitives — Chrome">
          <SkTopBar
            mode="default"
            warungName="Warung Maju Jaya"
            date="Selasa, 20 Mei"
            status="synced"
          />
          <SkTopBar mode="task" title="Catat stok hari ini" />
          <SkBottomNav active="catat" />
        </Section>

        <Section title="Charts">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            <SkCard>
              <SkOverline>Sparkline</SkOverline>
              <Sparkline trend="up" />
            </SkCard>
            <SkCard>
              <SkOverline>BarSeries</SkOverline>
              <BarSeries />
            </SkCard>
            <SkCard>
              <SkOverline>CandleSeries</SkOverline>
              <CandleSeries />
            </SkCard>
            <DeltaWidget />
            <SkCard>
              <SkOverline>DonutMini</SkOverline>
              <DonutMini showLegend />
            </SkCard>
            <SkCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ProgressMeter label="Target hari ini" hint="64 / 100" value={64} />
              <ProgressMeter label="Sisa modal" hint="20%" value={20} tone="warn" />
            </SkCard>
            <SkCard>
              <TallyCounter value={24} label="ekor lele" trend="down" delta="−6 vs kemarin" />
            </SkCard>
            <SkCard>
              <HeatStrip
                data={Array.from({ length: 28 }, (_, i) => 6 + ((i * 7) % 38))}
                label="14 hari terakhir"
              />
            </SkCard>
          </div>
        </Section>

        <Section title="Notifications">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
            <Toast kind="success" title="Tersimpan" message="Catatan stok hari ini sudah masuk." />
            <Banner
              kind="info"
              title="Cuaca sore hujan"
              message="Belanja besok mungkin ramai turun ~10%."
            />
            <InlineAlert kind="warn" title="Ayam habis 14:00">
              Pertimbangkan tambah +2 besok.
            </InlineAlert>
            <PushPreview
              appName="Stockast"
              time="03:12"
              title="Belanja besok siap"
              message="Lele 24 · Ayam 12 · Tahu 14"
            />
            <div
              style={{
                display: 'inline-flex',
                position: 'relative',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ position: 'relative' }}>
                <IconBell size={22} />
                <ActivityDot count={3} />
              </span>
              <span style={{ fontSize: 13, color: 'var(--sk-text-2)' }}>ActivityDot</span>
            </div>
          </div>
        </Section>

        <Section title="Belanja variants">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            <BelanjaCardEditorial animate={false} />
            <BelanjaCardWarm />
            <BelanjaCardCompact />
            <BelanjaCardPasar />
          </div>
        </Section>
      </div>
    </main>
  );
}
