export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const CATALOGO = "/Solofachas/";

export const WA = "https://wa.me/5493834024275";
export const IG = "https://ig.me/m/solofachas__";
export const waLink = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;
export const waPedido = (nombre: string, precio: string) =>
  waLink(`Hola! Quiero: ${nombre} (${precio}) 🌀`);

export type VariantId = "verde" | "rosa" | "negro";

export type Variant = {
  id: VariantId;
  label: string;
  product: string;
  price: string;
  detail: string;
  swatch: string;
  dial: string;
  marker: string;
  caseColor: string;
  strapColor: string;
  strapMetalness: number;
  strapRoughness: number;
  handColor: string;
  strass: boolean;
};

// Cada color del modelo 3D corresponde a un reloj real del catálogo
export const VARIANTS: Variant[] = [
  {
    id: "verde",
    label: "Verde",
    product: "Reloj plateado esfera verde",
    price: "$20.000",
    detail: "Malla metálica plateada y esfera verde con reflejo.",
    swatch: "#0e7a50",
    dial: "#0b6343",
    marker: "#f1f4fa",
    caseColor: "#dfe3ea",
    strapColor: "#dfe3ea",
    strapMetalness: 1,
    strapRoughness: 0.22,
    handColor: "#f4f6fb",
    strass: false,
  },
  {
    id: "rosa",
    label: "Rosa",
    product: "Set reloj + pulsera rosa",
    price: "$15.000",
    detail: "Dorado con brillitos y pulsera a juego. Vienen juntos.",
    swatch: "#f3a9c4",
    dial: "#efb3c8",
    marker: "#b8863c",
    caseColor: "#e7bf76",
    strapColor: "#e7bf76",
    strapMetalness: 1,
    strapRoughness: 0.2,
    handColor: "#d9a85a",
    strass: true,
  },
  {
    id: "negro",
    label: "Negro",
    product: "Relojes negros clásicos",
    price: "$10.000",
    detail: "Malla negra texturizada y caja con borde plateado.",
    swatch: "#16181f",
    dial: "#0c0e13",
    marker: "#e9edf7",
    caseColor: "#cfd4dc",
    strapColor: "#17181c",
    strapMetalness: 0.15,
    strapRoughness: 0.72,
    handColor: "#e9edf7",
    strass: false,
  },
];

export type Product = { img: string; name: string; price: string; cat: string; desc: string };

export const PRODUCTS: Product[] = [
  { img: "reloj-verde.jpg", name: "Reloj plateado esfera verde", price: "$20.000", cat: "Relojes", desc: "Verde brillante con malla metálica." },
  { img: "set-rosa.jpg", name: "Set reloj + pulsera rosa", price: "$15.000", cat: "Relojes", desc: "Dorado con brillitos y pulsera a juego." },
  { img: "anillos-rockeros.jpg", name: "Anillos rockeros", price: "$4.000 c/u", cat: "Anillos", desc: "Telaraña, araña, ataúd, esqueleto y carta." },
  { img: "bill-spider.jpg", name: "Billetera Spider", price: "$12.500", cat: "Billeteras", desc: "Negra con araña grabada y detalle rojo." },
  { img: "lentes-rojo.jpg", name: "Lentes rectangulares rojos", price: "$10.000", cat: "Lentes", desc: "Marco dorado fino, estilo retro." },
  { img: "pulseras-perlas.jpg", name: "Pulseras de perlas y cadena", price: "$6.000 c/u", cat: "Pulseras", desc: "Perlas, dijes y eslabones dorados." },
  { img: "collar-celta.jpg", name: "Collar nudo celta", price: "$8.000", cat: "Collares", desc: "Dije calado con piedrita verde." },
  { img: "gorra-ny.jpg", name: "Gorra negra NY", price: "$15.000", cat: "Gorras", desc: "Bordado en relieve, regulable." },
];

export const CATEGORIES = ["Relojes", "Anillos", "Billeteras", "Lentes", "Pulseras", "Collares", "Gorras", "Llaveros", "Aros", "Cintos"];
