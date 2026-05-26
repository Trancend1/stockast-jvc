/**
 * Java onboarding locations grouped by province.
 *
 * The current UI still uses a native <select>, so we keep the options grouped
 * and pre-flattened to reduce scan fatigue while staying easy to extend.
 *
 * BMKG public weather data is ultimately resolved by adm4. Most Java regions
 * still need their representative adm4 mapping, so we keep `adm4Code` nullable
 * and preserve the data shape for future enrichment.
 */

export type LocationCityType =
  | 'kabupaten'
  | 'kota'
  | 'kabupaten_administrasi'
  | 'kota_administrasi'
  | 'provinsi';

export type LocationOption = {
  readonly value: string;
  readonly label: string;
  readonly province: string;
  readonly cityType: LocationCityType;
  readonly adm4Code: string | null;
};

export type LocationGroup = {
  readonly province: string;
  readonly options: ReadonlyArray<LocationOption>;
};

type CreateLocationArgs = {
  value: string;
  name: string;
  province: string;
  cityType: LocationCityType;
  adm4Code?: string | null;
};

function createLocation({
  value,
  name,
  province,
  cityType,
  adm4Code = null,
}: CreateLocationArgs): LocationOption {
  return {
    value,
    label: buildLabel(name, province, cityType),
    province,
    cityType,
    adm4Code,
  };
}

function buildLabel(name: string, province: string, cityType: LocationCityType): string {
  switch (cityType) {
    case 'kabupaten':
      return `Kabupaten ${name}, ${province}`;
    case 'provinsi':
      return name;
    default:
      return `${name}, ${province}`;
  }
}

const kabupaten = (
  value: string,
  name: string,
  province: string,
  adm4Code?: string | null,
): LocationOption => createLocation({ value, name, province, cityType: 'kabupaten', adm4Code });

const kota = (
  value: string,
  name: string,
  province: string,
  adm4Code?: string | null,
): LocationOption => createLocation({ value, name, province, cityType: 'kota', adm4Code });

const kabupatenAdministrasi = (
  value: string,
  name: string,
  province: string,
  adm4Code?: string | null,
): LocationOption =>
  createLocation({ value, name, province, cityType: 'kabupaten_administrasi', adm4Code });

const kotaAdministrasi = (
  value: string,
  name: string,
  province: string,
  adm4Code?: string | null,
): LocationOption =>
  createLocation({ value, name, province, cityType: 'kota_administrasi', adm4Code });

export const LOCATION_GROUPS: ReadonlyArray<LocationGroup> = [
  {
    province: 'DKI Jakarta',
    options: [
      kabupatenAdministrasi('kepulauan-seribu', 'Kepulauan Seribu', 'DKI Jakarta'),
      kotaAdministrasi('jakarta-barat', 'Jakarta Barat', 'DKI Jakarta'),
      kotaAdministrasi('jakarta-pusat', 'Jakarta Pusat', 'DKI Jakarta'),
      kotaAdministrasi('jakarta-selatan', 'Jakarta Selatan', 'DKI Jakarta'),
      kotaAdministrasi('jakarta-timur', 'Jakarta Timur', 'DKI Jakarta'),
      kotaAdministrasi('jakarta-utara', 'Jakarta Utara', 'DKI Jakarta'),
    ],
  },
  {
    province: 'Banten',
    options: [
      kabupaten('pandeglang', 'Pandeglang', 'Banten'),
      kabupaten('lebak', 'Lebak', 'Banten'),
      kabupaten('tangerang-kabupaten', 'Tangerang', 'Banten'),
      kabupaten('serang-kabupaten', 'Serang', 'Banten'),
      kota('cilegon', 'Cilegon', 'Banten'),
      kota('serang', 'Serang', 'Banten'),
      kota('tangerang', 'Tangerang', 'Banten'),
      kota('tangerang-selatan', 'Tangerang Selatan', 'Banten'),
    ],
  },
  {
    province: 'Jawa Barat',
    options: [
      kabupaten('bogor-kabupaten', 'Bogor', 'Jawa Barat'),
      kabupaten('sukabumi-kabupaten', 'Sukabumi', 'Jawa Barat'),
      kabupaten('cianjur', 'Cianjur', 'Jawa Barat'),
      kabupaten('bandung-kabupaten', 'Bandung', 'Jawa Barat'),
      kabupaten('garut', 'Garut', 'Jawa Barat'),
      kabupaten('tasikmalaya-kabupaten', 'Tasikmalaya', 'Jawa Barat'),
      kabupaten('ciamis', 'Ciamis', 'Jawa Barat'),
      kabupaten('kuningan', 'Kuningan', 'Jawa Barat'),
      kabupaten('cirebon-kabupaten', 'Cirebon', 'Jawa Barat'),
      kabupaten('majalengka', 'Majalengka', 'Jawa Barat'),
      kabupaten('sumedang', 'Sumedang', 'Jawa Barat'),
      kabupaten('indramayu', 'Indramayu', 'Jawa Barat'),
      kabupaten('subang', 'Subang', 'Jawa Barat'),
      kabupaten('purwakarta', 'Purwakarta', 'Jawa Barat'),
      kabupaten('karawang', 'Karawang', 'Jawa Barat'),
      kabupaten('bekasi-kabupaten', 'Bekasi', 'Jawa Barat'),
      kabupaten('bandung-barat', 'Bandung Barat', 'Jawa Barat'),
      kabupaten('pangandaran', 'Pangandaran', 'Jawa Barat'),
      kota('bogor', 'Bogor', 'Jawa Barat'),
      kota('sukabumi', 'Sukabumi', 'Jawa Barat'),
      kota('bandung', 'Bandung', 'Jawa Barat'),
      kota('cirebon', 'Cirebon', 'Jawa Barat'),
      kota('bekasi', 'Bekasi', 'Jawa Barat'),
      kota('depok', 'Depok', 'Jawa Barat'),
      kota('cimahi', 'Cimahi', 'Jawa Barat'),
      kota('tasikmalaya', 'Tasikmalaya', 'Jawa Barat'),
      kota('banjar', 'Banjar', 'Jawa Barat'),
    ],
  },
  {
    province: 'Jawa Tengah',
    options: [
      kabupaten('cilacap', 'Cilacap', 'Jawa Tengah'),
      kabupaten('banyumas', 'Banyumas', 'Jawa Tengah'),
      kabupaten('purbalingga', 'Purbalingga', 'Jawa Tengah'),
      kabupaten('banjarnegara', 'Banjarnegara', 'Jawa Tengah'),
      kabupaten('kebumen', 'Kebumen', 'Jawa Tengah'),
      kabupaten('purworejo', 'Purworejo', 'Jawa Tengah'),
      kabupaten('wonosobo', 'Wonosobo', 'Jawa Tengah'),
      kabupaten('magelang-kabupaten', 'Magelang', 'Jawa Tengah'),
      kabupaten('boyolali', 'Boyolali', 'Jawa Tengah'),
      kabupaten('klaten', 'Klaten', 'Jawa Tengah'),
      kabupaten('sukoharjo', 'Sukoharjo', 'Jawa Tengah'),
      kabupaten('wonogiri', 'Wonogiri', 'Jawa Tengah'),
      kabupaten('karanganyar', 'Karanganyar', 'Jawa Tengah'),
      kabupaten('sragen', 'Sragen', 'Jawa Tengah'),
      kabupaten('grobogan', 'Grobogan', 'Jawa Tengah'),
      kabupaten('blora', 'Blora', 'Jawa Tengah'),
      kabupaten('rembang', 'Rembang', 'Jawa Tengah'),
      kabupaten('pati', 'Pati', 'Jawa Tengah'),
      kabupaten('kudus', 'Kudus', 'Jawa Tengah'),
      kabupaten('jepara', 'Jepara', 'Jawa Tengah'),
      kabupaten('demak', 'Demak', 'Jawa Tengah'),
      kabupaten('semarang-kabupaten', 'Semarang', 'Jawa Tengah'),
      kabupaten('temanggung', 'Temanggung', 'Jawa Tengah'),
      kabupaten('kendal', 'Kendal', 'Jawa Tengah'),
      kabupaten('batang', 'Batang', 'Jawa Tengah'),
      kabupaten('pekalongan-kabupaten', 'Pekalongan', 'Jawa Tengah'),
      kabupaten('pemalang', 'Pemalang', 'Jawa Tengah'),
      kabupaten('tegal-kabupaten', 'Tegal', 'Jawa Tengah'),
      kabupaten('brebes', 'Brebes', 'Jawa Tengah'),
      kota('magelang', 'Magelang', 'Jawa Tengah'),
      kota('surakarta', 'Surakarta', 'Jawa Tengah'),
      kota('salatiga', 'Salatiga', 'Jawa Tengah', '33.73.01.1001'),
      kota('semarang', 'Semarang', 'Jawa Tengah'),
      kota('pekalongan', 'Pekalongan', 'Jawa Tengah'),
      kota('tegal', 'Tegal', 'Jawa Tengah'),
    ],
  },
  {
    province: 'DI Yogyakarta',
    options: [
      kabupaten('kulon-progo', 'Kulon Progo', 'DI Yogyakarta'),
      kabupaten('bantul', 'Bantul', 'DI Yogyakarta'),
      kabupaten('gunungkidul', 'Gunungkidul', 'DI Yogyakarta'),
      kabupaten('sleman', 'Sleman', 'DI Yogyakarta'),
      kota('yogyakarta', 'Yogyakarta', 'DI Yogyakarta'),
    ],
  },
  {
    province: 'Jawa Timur',
    options: [
      kabupaten('pacitan', 'Pacitan', 'Jawa Timur'),
      kabupaten('ponorogo', 'Ponorogo', 'Jawa Timur'),
      kabupaten('trenggalek', 'Trenggalek', 'Jawa Timur'),
      kabupaten('tulungagung', 'Tulungagung', 'Jawa Timur'),
      kabupaten('blitar-kabupaten', 'Blitar', 'Jawa Timur'),
      kabupaten('kediri-kabupaten', 'Kediri', 'Jawa Timur'),
      kabupaten('malang-kabupaten', 'Malang', 'Jawa Timur'),
      kabupaten('lumajang', 'Lumajang', 'Jawa Timur'),
      kabupaten('jember', 'Jember', 'Jawa Timur'),
      kabupaten('banyuwangi', 'Banyuwangi', 'Jawa Timur'),
      kabupaten('bondowoso', 'Bondowoso', 'Jawa Timur'),
      kabupaten('situbondo', 'Situbondo', 'Jawa Timur'),
      kabupaten('probolinggo-kabupaten', 'Probolinggo', 'Jawa Timur'),
      kabupaten('pasuruan-kabupaten', 'Pasuruan', 'Jawa Timur'),
      kabupaten('sidoarjo', 'Sidoarjo', 'Jawa Timur'),
      kabupaten('mojokerto-kabupaten', 'Mojokerto', 'Jawa Timur'),
      kabupaten('jombang', 'Jombang', 'Jawa Timur'),
      kabupaten('nganjuk', 'Nganjuk', 'Jawa Timur'),
      kabupaten('madiun-kabupaten', 'Madiun', 'Jawa Timur'),
      kabupaten('magetan', 'Magetan', 'Jawa Timur'),
      kabupaten('ngawi', 'Ngawi', 'Jawa Timur'),
      kabupaten('bojonegoro', 'Bojonegoro', 'Jawa Timur'),
      kabupaten('tuban', 'Tuban', 'Jawa Timur'),
      kabupaten('lamongan', 'Lamongan', 'Jawa Timur'),
      kabupaten('gresik', 'Gresik', 'Jawa Timur'),
      kabupaten('bangkalan', 'Bangkalan', 'Jawa Timur'),
      kabupaten('sampang', 'Sampang', 'Jawa Timur'),
      kabupaten('pamekasan', 'Pamekasan', 'Jawa Timur'),
      kabupaten('sumenep', 'Sumenep', 'Jawa Timur'),
      kota('kediri', 'Kediri', 'Jawa Timur'),
      kota('blitar', 'Blitar', 'Jawa Timur'),
      kota('malang', 'Malang', 'Jawa Timur'),
      kota('probolinggo', 'Probolinggo', 'Jawa Timur'),
      kota('pasuruan', 'Pasuruan', 'Jawa Timur'),
      kota('mojokerto', 'Mojokerto', 'Jawa Timur'),
      kota('madiun', 'Madiun', 'Jawa Timur'),
      kota('surabaya', 'Surabaya', 'Jawa Timur'),
      kota('batu', 'Batu', 'Jawa Timur'),
    ],
  },
] as const;

export const LOCATION_OPTIONS: ReadonlyArray<LocationOption> = LOCATION_GROUPS.flatMap(
  (group) => group.options,
);

const LEGACY_LOCATION_OPTIONS: ReadonlyArray<LocationOption> = [
  createLocation({
    value: 'jakarta',
    name: 'DKI Jakarta',
    province: 'DKI Jakarta',
    cityType: 'provinsi',
  }),
];

const BY_VALUE = new Map(
  [...LOCATION_OPTIONS, ...LEGACY_LOCATION_OPTIONS].map((option) => [option.value, option]),
);

export function findLocation(value: string): LocationOption | undefined {
  return BY_VALUE.get(value);
}
