import type { ReactNode, SVGProps } from 'react';

export interface SkIconProps extends Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'fill' | 'stroke' | 'strokeWidth'> {
  size?: number;
  stroke?: number;
}

function IconShell({ children, size = 18, stroke = 1.5, ...rest }: SkIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconHome(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8.8Z" />
    </IconShell>
  );
}

export function IconNote(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M6 3.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M15 3.5V7.5h4" />
      <path d="M8.5 12.5h7M8.5 16h5" />
    </IconShell>
  );
}

export function IconHistory(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9" />
      <path d="M3.5 4v3.5H7" />
      <path d="M12 8v4.2l2.8 1.6" />
    </IconShell>
  );
}

export function IconSettings(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 6h11M4 12h11M4 18h11" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </IconShell>
  );
}

export function IconArrowR(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconShell>
  );
}

export function IconArrowL(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </IconShell>
  );
}

export function IconChevronR(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M9 6l6 6-6 6" />
    </IconShell>
  );
}

export function IconChevronD(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M6 9l6 6 6-6" />
    </IconShell>
  );
}

export function IconCheck(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </IconShell>
  );
}

export function IconClose(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconShell>
  );
}

export function IconPlus(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 5v14M5 12h14" />
    </IconShell>
  );
}

export function IconWhatsapp(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 20l1.5-4.4A8 8 0 1 1 8.7 19L4 20Z" />
      <path d="M9 9c0 3 2 5 5 5l1.2-1.5-2-1L12 13l-2-2 .5-1.2-1-2L8 9Z" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function IconCopy(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V5.5A1.5 1.5 0 0 1 5.5 4H16" />
    </IconShell>
  );
}

export function IconEdit(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </IconShell>
  );
}

export function IconTrash(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
    </IconShell>
  );
}

export function IconUndo(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M9 14H5v-4M5 14a8 8 0 1 1 2.5 5.8" />
    </IconShell>
  );
}

export function IconRefresh(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 12a8 8 0 0 1 13.7-5.6M20 4v4.5h-4.5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6M4 20v-4.5h4.5" />
    </IconShell>
  );
}

export function IconSun(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </IconShell>
  );
}

export function IconCloud(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M7 18h10a4 4 0 0 0 .8-7.9 6 6 0 0 0-11.7 1A4 4 0 0 0 7 18Z" />
    </IconShell>
  );
}

export function IconRain(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M7 14h10a4 4 0 0 0 .8-7.9 6 6 0 0 0-11.7 1A4 4 0 0 0 7 14Z" />
      <path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2" />
    </IconShell>
  );
}

export function IconShop(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 8.5 5.2 5h13.6L20 8.5" />
      <path d="M4 8.5V20h16V8.5" />
      <path d="M4 8.5a3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0" />
      <path d="M10 20v-5h4v5" />
    </IconShell>
  );
}

export function IconSpark(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function IconMic(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
    </IconShell>
  );
}

export function IconMoon(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z" />
    </IconShell>
  );
}

export function IconInfo(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </IconShell>
  );
}

export function IconSearch(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </IconShell>
  );
}

export function IconFilter(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 6h18M6 12h12M10 18h4" />
    </IconShell>
  );
}

export function IconSort(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M7 5v14M7 19l-3-3M7 19l3-3M17 19V5M17 5l-3 3M17 5l3 3" />
    </IconShell>
  );
}

export function IconLock(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconShell>
  );
}

export function IconUnlock(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 7.7-1.4" />
    </IconShell>
  );
}

export function IconCalendar(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="4" y="5.5" width="16" height="15" rx="1.5" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" />
    </IconShell>
  );
}

export function IconClock(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2.5" />
    </IconShell>
  );
}

export function IconBell(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M6 17h12l-1.5-2.5V11a4.5 4.5 0 1 0-9 0v3.5L6 17Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </IconShell>
  );
}

export function IconBellOff(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M9.4 5.7A4.5 4.5 0 0 1 16.5 11v3.5l1.5 2.5h-9" />
      <path d="M7.5 14.5V11l-1.5 6h6" />
      <path d="M3 3l18 18" />
    </IconShell>
  );
}

export function IconPin(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 21v-6M9 5l-2 2 5 5 5-5-2-2-3 3-3-3Z" />
    </IconShell>
  );
}

export function IconStar(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 3.5l2.7 5.5 6 .9-4.3 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.9l6-.9L12 3.5Z" />
    </IconShell>
  );
}

export function IconHeart(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </IconShell>
  );
}

export function IconDownload(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />
    </IconShell>
  );
}

export function IconShare(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8 11l8-4M8 13l8 4" />
    </IconShell>
  );
}

export function IconLink(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M10 14a4 4 0 0 1 0-5.5l3-3a4 4 0 0 1 5.5 5.5l-2 2" />
      <path d="M14 10a4 4 0 0 1 0 5.5l-3 3a4 4 0 0 1-5.5-5.5l2-2" />
    </IconShell>
  );
}

export function IconEye(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </IconShell>
  );
}

export function IconEyeOff(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 4l16 16" />
      <path d="M10.6 6.4A12 12 0 0 1 12 6c6.5 0 10 6 10 6s-1.3 2.3-3.8 4" />
      <path d="M14 14a3 3 0 0 1-4-4M6.3 8.5C3.6 10.2 2 12 2 12s3.5 6 10 6c1.4 0 2.6-.2 3.7-.6" />
    </IconShell>
  );
}

export function IconHamburger(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconShell>
  );
}

export function IconDots(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function IconTrendUp(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </IconShell>
  );
}

export function IconTrendDown(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M14 17h7v-7" />
    </IconShell>
  );
}

export function IconTrendFlat(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 12h14M14 8l4 4-4 4" />
    </IconShell>
  );
}

export function IconChartLine(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 20V5" />
      <path d="M3 20h18" />
      <path d="M6 16l4-4 4 3 6-7" />
    </IconShell>
  );
}

export function IconChartBar(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 20V5M3 20h18" />
      <rect x="6" y="12" width="3" height="6" />
      <rect x="11" y="8" width="3" height="10" />
      <rect x="16" y="14" width="3" height="4" />
    </IconShell>
  );
}

export function IconChartCandle(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 20V5M3 20h18" />
      <path d="M7 8v8M7 9.5h0M12 6v12M17 10v6" />
      <rect x="5.7" y="10" width="2.6" height="5" />
      <rect x="10.7" y="8" width="2.6" height="6" />
      <rect x="15.7" y="11" width="2.6" height="3" />
    </IconShell>
  );
}

export function IconDonut(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 7 4l-7 4Z" fill="currentColor" stroke="none" opacity="0.85" />
      <circle cx="12" cy="12" r="3.5" />
    </IconShell>
  );
}

export function IconTarget(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function IconCash(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <rect x="3" y="7" width="18" height="11" rx="1.5" />
      <circle cx="12" cy="12.5" r="2.5" />
      <path d="M6 10v5M18 10v5" />
    </IconShell>
  );
}

export function IconWallet(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
      <path d="M16 12.5h4M20 11v3" />
    </IconShell>
  );
}

export function IconPercent(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M5 19l14-14" />
    </IconShell>
  );
}

export function IconReceipt(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M6 3h12v17.5l-3-1.5-3 1.5-3-1.5-3 1.5V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </IconShell>
  );
}

export function IconTicker(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 12h18" />
      <path d="M6 9l3 3-3 3M18 9l-3 3 3 3" />
    </IconShell>
  );
}

export function IconBag(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </IconShell>
  );
}

export function IconPackage(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3.5 7.5 12 12l8.5-4.5" />
      <path d="M12 12v9" />
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
    </IconShell>
  );
}

export function IconCheckCircle(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6.5" />
    </IconShell>
  );
}

export function IconCloseCircle(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </IconShell>
  );
}

export function IconWarnTriangle(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 4l9 16H3L12 4Z" />
      <path d="M12 11v4M12 17.5v.5" />
    </IconShell>
  );
}

export function IconSyncing(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 12a9 9 0 0 1 15-6.5M21 12a9 9 0 0 1-15 6.5" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </IconShell>
  );
}

export function IconOffline(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M3 4l18 18" />
      <path d="M5 10a14 14 0 0 1 4-2.5M2 7a17 17 0 0 1 4-2" />
      <path d="M9 14a8 8 0 0 1 7-1" />
      <path d="M12 19h0.01" />
    </IconShell>
  );
}

export function IconStorm(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M7 14h10a4 4 0 0 0 .8-7.9 6 6 0 0 0-11.7 1A4 4 0 0 0 7 14Z" />
      <path d="M12 14l-2 4h3l-2 4" />
    </IconShell>
  );
}

export function IconFog(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M4 9h16M3 13h18M5 17h14M7 21h10" />
    </IconShell>
  );
}

export function IconPartlyCloud(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <circle cx="8.5" cy="8.5" r="3" />
      <path d="M11 16h7a3.5 3.5 0 1 0-0.7-6.9 5 5 0 0 0-9.3 1A3.5 3.5 0 0 0 11 16Z" />
    </IconShell>
  );
}

export function IconStarSmall(p: SkIconProps) {
  return (
    <IconShell {...p}>
      <path d="M12 5l1.5 4 4 .5-3 3 1 4-3.5-2-3.5 2 1-4-3-3 4-.5L12 5Z" fill="currentColor" stroke="none" />
    </IconShell>
  );
}
