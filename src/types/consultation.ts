export type BusinessType =
  | "warung"
  | "toko"
  | "makanan"
  | "jasa"
  | "online"
  | "lainnya"

export type BusinessAge =
  | "kurang-dari-1-tahun"
  | "1-3-tahun"
  | "3-5-tahun"
  | "lebih-dari-5-tahun"

export type RevenueRange =
  | "kurang-dari-5jt"
  | "5jt-15jt"
  | "15jt-50jt"
  | "50jt-100jt"
  | "lebih-dari-100jt"

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  warung: "Warung / Toko Kelontong",
  toko: "Toko Retail",
  makanan: "Makanan & Minuman",
  jasa: "Jasa / Layanan",
  online: "Online Shop",
  lainnya: "Lainnya",
}

export const BUSINESS_AGE_LABELS: Record<BusinessAge, string> = {
  "kurang-dari-1-tahun": "Kurang dari 1 tahun",
  "1-3-tahun": "1 - 3 tahun",
  "3-5-tahun": "3 - 5 tahun",
  "lebih-dari-5-tahun": "Lebih dari 5 tahun",
}

export const REVENUE_RANGE_LABELS: Record<RevenueRange, string> = {
  "kurang-dari-5jt": "< Rp 5 juta",
  "5jt-15jt": "Rp 5 - 15 juta",
  "15jt-50jt": "Rp 15 - 50 juta",
  "50jt-100jt": "Rp 50 - 100 juta",
  "lebih-dari-100jt": "> Rp 100 juta",
}
