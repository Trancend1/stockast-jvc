import type { CSSProperties, ReactNode } from 'react';

const W_INK = '#1A1611';
const W_BRICK = '#F26F1B';
const W_MINT = '#4DA66E';
const W_CREAM = '#F4ECD9';
const W_GOLD = '#E8C074';
const W_BLUE = '#4A7EA0';

export interface WeatherSceneProps {
  width?: number | string;
  height?: number | string;
}

interface SceneProps extends WeatherSceneProps {
  viewBox?: string;
  children: ReactNode;
  style?: CSSProperties;
}

function Scene({
  width = 320,
  height = 100,
  viewBox = '0 0 320 100',
  children,
  style,
}: SceneProps) {
  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', maxWidth: '100%', borderRadius: 10, ...style }}
    >
      {children}
    </svg>
  );
}

interface VillageBandProps {
  inkOpacity?: number;
}

function VillageBand({ inkOpacity = 0.65 }: VillageBandProps) {
  return (
    <g
      fill="none"
      stroke={W_INK}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={inkOpacity}
    >
      <line x1="0" y1="86" x2="320" y2="86" />
      <path d="M 30 86 L 30 70 L 48 60 L 66 70 L 66 86" />
      <path d="M 80 86 L 80 78 L 96 70 L 112 78 L 112 86" />
      <path d="M 130 86 L 130 64 L 150 52 L 170 64 L 170 86" fill={W_CREAM} />
      <rect x="146" y="74" width="8" height="12" fill={W_CREAM} />
      <path d="M 188 86 L 188 76 L 202 68 L 216 76 L 216 86" />
      <path d="M 232 86 L 232 70 L 252 60 L 272 70 L 272 86" />
      <path d="M 286 86 L 286 80 L 296 74 L 306 80 L 306 86" />
    </g>
  );
}

export function SceneCerah({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{ background: 'linear-gradient(180deg, #FFF1E4 0%, #FAF6EE 65%, #F4ECD9 100%)' }}
    >
      <circle cx="240" cy="34" r="32" fill={W_BRICK} opacity="0.10" />
      <circle cx="240" cy="34" r="22" fill={W_BRICK} opacity="0.22" />
      <circle cx="240" cy="34" r="14" fill={W_BRICK} />
      <g stroke={W_BRICK} strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
        <path d="M 240 8 v 6 M 240 60 v 6 M 214 34 h -6 M 272 34 h -6" />
        <path d="M 222 16 l 4 4 M 258 52 l 4 4 M 222 52 l 4 -4 M 258 16 l 4 -4" />
      </g>
      <g fill={W_CREAM} stroke={W_INK} strokeWidth="1.3" strokeLinejoin="round" opacity="0.85">
        <path d="M 50 36 q -8 0 -8 -7 q 0 -9 12 -9 q 6 -5 14 0 q 10 0 10 8 q 0 8 -10 8 z" />
        <path
          d="M 168 28 q -6 0 -6 -5 q 0 -7 10 -7 q 4 -4 10 0 q 8 0 8 6 q 0 6 -8 6 z"
          opacity="0.7"
        />
      </g>
      <VillageBand inkOpacity={0.7} />
      <g fill={W_BRICK} opacity="0.6">
        <circle cx="36" cy="74" r="1.4" />
        <circle cx="106" cy="80" r="1.2" />
        <circle cx="270" cy="76" r="1.3" />
      </g>
      <circle cx="298" cy="92" r="2.4" fill={W_MINT} />
    </Scene>
  );
}

export function SceneBerawan({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{ background: 'linear-gradient(180deg, #EFE9DC 0%, #F4ECD9 50%, #FAF6EE 100%)' }}
    >
      <g fill={W_CREAM} stroke={W_INK} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M 22 44 q -10 0 -10 -8 q 0 -10 14 -10 q 6 -6 16 0 q 12 0 12 9 q 0 9 -12 9 z" />
        <path
          d="M 110 38 q -10 0 -10 -8 q 0 -11 16 -11 q 6 -7 18 0 q 14 0 14 10 q 0 9 -14 9 z"
          opacity="0.95"
        />
        <path
          d="M 222 46 q -12 0 -12 -8 q 0 -10 14 -10 q 6 -6 18 0 q 14 0 14 9 q 0 9 -14 9 z"
          opacity="0.9"
        />
        <path
          d="M 286 36 q -8 0 -8 -7 q 0 -9 12 -9 q 5 -5 14 0 q 10 0 10 8 q 0 8 -10 8 z"
          opacity="0.7"
        />
      </g>
      <circle cx="160" cy="40" r="22" fill={W_BRICK} opacity="0.10" />
      <VillageBand inkOpacity={0.55} />
      <circle cx="296" cy="92" r="2.2" fill={W_MINT} />
    </Scene>
  );
}

export function SceneHujan({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{ background: 'linear-gradient(180deg, #DDD3BD 0%, #ECE4D3 50%, #F4ECD9 100%)' }}
    >
      <g fill={W_CREAM} stroke={W_INK} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M 26 38 q -14 0 -14 -10 q 0 -12 18 -12 q 8 -8 22 0 q 16 0 16 11 q 0 11 -16 11 z" />
        <path d="M 130 32 q -14 0 -14 -10 q 0 -12 18 -12 q 8 -8 22 0 q 16 0 16 11 q 0 11 -16 11 z" />
        <path d="M 234 40 q -14 0 -14 -10 q 0 -12 18 -12 q 8 -8 22 0 q 16 0 16 11 q 0 11 -16 11 z" />
      </g>
      <g stroke={W_BLUE} strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M 22 50 l -3 8 M 42 54 l -3 8 M 58 50 l -3 8 M 78 56 l -3 8" />
        <path d="M 122 48 l -3 8 M 142 54 l -3 8 M 162 48 l -3 8 M 178 54 l -3 8" />
        <path d="M 224 52 l -3 8 M 244 56 l -3 8 M 264 52 l -3 8 M 284 58 l -3 8" />
        <path d="M 90 64 l -2 6 M 152 64 l -2 6 M 256 66 l -2 6 M 304 62 l -2 6" />
      </g>
      <VillageBand inkOpacity={0.7} />
      <ellipse cx="100" cy="92" rx="32" ry="2" fill={W_BLUE} opacity="0.35" />
      <ellipse cx="220" cy="92" rx="22" ry="2" fill={W_BLUE} opacity="0.3" />
      <circle cx="300" cy="92" r="2.2" fill={W_MINT} />
    </Scene>
  );
}

export function ScenePetir({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{ background: 'linear-gradient(180deg, #5D5447 0%, #8A8073 60%, #ECE4D3 100%)' }}
    >
      <g fill="#3A3328" stroke={W_INK} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M 10 42 q -10 0 -10 -8 q 0 -10 14 -10 q 6 -6 16 0 q 12 0 12 9 q 0 9 -12 9 z" />
        <path d="M 60 36 q -14 0 -14 -10 q 0 -12 20 -12 q 8 -8 24 0 q 16 0 16 11 q 0 11 -16 11 z" />
        <path d="M 160 40 q -16 0 -16 -11 q 0 -14 22 -14 q 10 -10 26 0 q 18 0 18 13 q 0 12 -18 12 z" />
        <path d="M 260 36 q -14 0 -14 -10 q 0 -12 20 -12 q 8 -8 24 0 q 16 0 16 11 q 0 11 -16 11 z" />
      </g>
      <path
        d="M 170 38 L 158 64 L 168 64 L 158 86 L 184 56 L 174 56 L 184 38 Z"
        fill={W_GOLD}
        stroke={W_INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g stroke={W_BLUE} strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M 30 60 l -3 8 M 50 64 l -3 8 M 70 60 l -3 8 M 90 64 l -3 8 M 110 60 l -3 8 M 130 64 l -3 8" />
        <path d="M 210 60 l -3 8 M 230 64 l -3 8 M 250 60 l -3 8 M 270 64 l -3 8 M 290 60 l -3 8 M 310 64 l -3 8" />
      </g>
      <VillageBand inkOpacity={0.85} />
      <ellipse cx="160" cy="92" rx="58" ry="3" fill={W_GOLD} opacity="0.25" />
    </Scene>
  );
}

export function SceneSubuh({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{
        background: 'linear-gradient(180deg, #21295c 0%, #0e1d56 35%, #001f54 70%, #001235 100%)',
      }}
    >
      <g fill="#c8e2ec">
        <circle cx="38" cy="18" r="1.2" />
        <circle cx="74" cy="32" r="0.9" opacity="0.6" />
        <circle cx="110" cy="14" r="1" />
        <circle cx="142" cy="22" r="0.8" opacity="0.7" />
        <circle cx="190" cy="12" r="1.3" />
        <circle cx="222" cy="28" r="0.9" opacity="0.6" />
        <circle cx="262" cy="20" r="1.1" />
        <circle cx="294" cy="34" r="0.9" opacity="0.55" />
        <circle cx="20" cy="50" r="0.8" opacity="0.45" />
      </g>
      <g>
        <circle cx="240" cy="32" r="22" fill="#61a5c2" opacity="0.10" />
        <circle cx="240" cy="32" r="14" fill="#76b8d0" opacity="0.30" />
        <circle cx="240" cy="32" r="11" fill="#c8e2ec" />
        <circle cx="245" cy="29" r="9.5" fill="#001f54" />
      </g>
      <g
        fill="none"
        stroke="#7eb4cc"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      >
        <line x1="0" y1="86" x2="320" y2="86" />
        <path d="M 30 86 L 30 70 L 48 60 L 66 70 L 66 86" />
        <path d="M 80 86 L 80 78 L 96 70 L 112 78 L 112 86" />
        <path d="M 130 86 L 130 64 L 150 52 L 170 64 L 170 86" />
        <path d="M 188 86 L 188 76 L 202 68 L 216 76 L 216 86" />
        <path d="M 286 86 L 286 80 L 296 74 L 306 80 L 306 86" />
      </g>
      <rect x="146" y="74" width="8" height="12" fill={W_GOLD} opacity="0.85" />
      <g fill="#76b8d0" opacity="0.45">
        <circle cx="48" cy="92" r="1.6" />
        <circle cx="118" cy="92" r="1.2" />
        <circle cx="266" cy="92" r="1.8" />
      </g>
    </Scene>
  );
}

export function SceneBerkabut({ width, height }: WeatherSceneProps) {
  return (
    <Scene
      width={width}
      height={height}
      style={{ background: 'linear-gradient(180deg, #E6DDC9 0%, #ECE4D3 45%, #F4ECD9 100%)' }}
    >
      <g stroke={W_INK} strokeWidth="1.2" strokeLinecap="round" opacity="0.18">
        <path d="M 0 26 H 280" />
        <path d="M 40 38 H 320" />
        <path d="M 0 52 H 200" />
        <path d="M 80 66 H 320" />
      </g>
      <g fill={W_CREAM} stroke={W_INK} strokeWidth="1.2" strokeLinejoin="round" opacity="0.6">
        <path d="M 50 50 q -10 0 -10 -7 q 0 -9 14 -9 q 6 -5 16 0 q 10 0 10 8 q 0 8 -10 8 z" />
        <path d="M 220 44 q -10 0 -10 -7 q 0 -9 14 -9 q 6 -5 16 0 q 10 0 10 8 q 0 8 -10 8 z" />
      </g>
      <g
        fill="none"
        stroke={W_INK}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      >
        <line x1="0" y1="86" x2="320" y2="86" />
        <path d="M 30 86 L 30 70 L 48 60 L 66 70 L 66 86" />
        <path d="M 130 86 L 130 64 L 150 52 L 170 64 L 170 86" />
        <path d="M 232 86 L 232 70 L 252 60 L 272 70 L 272 86" />
      </g>
      <circle cx="296" cy="92" r="2.0" fill={W_MINT} opacity="0.7" />
    </Scene>
  );
}

export type WeatherKind =
  | 'cerah'
  | 'sun'
  | 'sunny'
  | 'berawan'
  | 'cloud'
  | 'cloudy'
  | 'hujan'
  | 'rain'
  | 'rainy'
  | 'petir'
  | 'storm'
  | 'stormy'
  | 'subuh'
  | 'night'
  | 'berkabut'
  | 'fog'
  | 'foggy';

export const WEATHER_SCENES: Record<WeatherKind, (p: WeatherSceneProps) => ReactNode> = {
  cerah: SceneCerah,
  sun: SceneCerah,
  sunny: SceneCerah,
  berawan: SceneBerawan,
  cloud: SceneBerawan,
  cloudy: SceneBerawan,
  hujan: SceneHujan,
  rain: SceneHujan,
  rainy: SceneHujan,
  petir: ScenePetir,
  storm: ScenePetir,
  stormy: ScenePetir,
  subuh: SceneSubuh,
  night: SceneSubuh,
  berkabut: SceneBerkabut,
  fog: SceneBerkabut,
  foggy: SceneBerkabut,
};

export interface WeatherSceneViewProps extends WeatherSceneProps {
  kind?: WeatherKind;
  style?: CSSProperties;
}

export function WeatherScene({
  kind = 'cerah',
  width = 320,
  height = 100,
  style,
}: WeatherSceneViewProps) {
  const Cmp = WEATHER_SCENES[kind] ?? SceneCerah;
  return <div style={style}>{Cmp({ width, height })}</div>;
}
