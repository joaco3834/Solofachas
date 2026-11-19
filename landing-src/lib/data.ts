export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const CATALOGO = "/Solofachas/";

export const WA = "https://wa.me/5493834024275";
export const IG = "https://ig.me/m/solofachas__";
export const waLink = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;
export const waPedido = (nombre: string, precio: string) =>
  waLink(`Hola! Quiero: ${nombre} (${precio}) 🌀`);

// "Elegí tu reloj": los tres relojes con sus fotos reales
export type Watch = {
  id: string;
  label: string;
  swatch: string;
  product: string;
  price: string;
  detail: string;
  img: string; // foto en /productos
  catImg: string; // nombre de la foto en el catálogo (para el pedido compartido)
  models?: string[];
};

export const WATCHES: Watch[] = [
  {
    id: "verde",
    label: "Verde",
    swatch: "#0e7a50",
    product: "Reloj plateado esfera verde",
    price: "$20.000",
    detail: "Malla metálica plateada y esfera verde con reflejo.",
    img: "reloj-verde.jpg",
    catImg: "reloj-verde.jpg",
  },
  {
    id: "rosa",
    label: "Rosa",
    swatch: "#f3a9c4",
    product: "Set reloj + pulsera rosa",
    price: "$15.000",
    detail: "Reloj dorado con brillitos y pulsera a juego con piedras rosas. Vienen juntos.",
    img: "set-rosa.jpg",
    catImg: "set-rosa.jpg",
  },
  {
    id: "negro",
    label: "Negro",
    swatch: "#16181f",
    product: "Relojes negros clásicos",
    price: "$10.000",
    detail: "Malla negra texturizada. Tres modelos: números romanos, números grandes y total black.",
    img: "relojes-negros.jpg",
    catImg: "relojes-negros.jpg",
    models: ["Números romanos", "Números grandes", "Total black"],
  },
];

// catImg: nombre de la foto en el catálogo · catId: sección del catálogo (si hay que elegir modelo allá)
export type Product = { img: string; name: string; price: string; cat: string; desc: string; catImg: string; catId?: string };

export const PRODUCTS: Product[] = [
  { img: "reloj-verde.jpg", name: "Reloj plateado esfera verde", price: "$20.000", cat: "Relojes", desc: "Verde brillante con malla metálica.", catImg: "reloj-verde.jpg" },
  { img: "set-rosa.jpg", name: "Set reloj + pulsera rosa", price: "$15.000", cat: "Relojes", desc: "Dorado con brillitos y pulsera a juego.", catImg: "set-rosa.jpg" },
  { img: "anillos-rockeros.jpg", name: "Anillos rockeros", price: "$4.000 c/u", cat: "Anillos", desc: "Telaraña, araña, ataúd, esqueleto y carta.", catImg: "58322.jpg", catId: "anillos" },
  { img: "bill-spider.jpg", name: "Billetera Spider", price: "$12.500", cat: "Billeteras", desc: "Negra con araña grabada y detalle rojo.", catImg: "bill-spider.jpg" },
  { img: "lentes-rojo.jpg", name: "Lentes rectangulares rojos", price: "$10.000", cat: "Lentes", desc: "Marco dorado fino, estilo retro.", catImg: "lentes-rojo.jpg" },
  { img: "pulseras-perlas.jpg", name: "Pulseras de perlas y cadena", price: "$6.000 c/u", cat: "Pulseras", desc: "Perlas, dijes y eslabones dorados.", catImg: "pulseras-perlas.jpg", catId: "pulseras" },
  { img: "collar-celta.jpg", name: "Collar nudo celta", price: "$8.000", cat: "Collares", desc: "Dije calado con piedrita verde.", catImg: "collar-celta.jpg" },
  { img: "gorra-ny.jpg", name: "Gorra negra NY", price: "$15.000", cat: "Gorras", desc: "Bordado en relieve, regulable.", catImg: "58381.jpg" },
];

export const CATEGORIES = ["Relojes", "Anillos", "Billeteras", "Lentes", "Pulseras", "Collares", "Gorras", "Llaveros", "Aros"];

// Collage de la portada. x/y: centro de la foto en % de la portada · w: ancho en vw · r: giro ·
// d: profundidad (más alto = más cerca, se mueve más con el mouse y el scroll)
export type CollageSpot = { x: number; y: number; w: number; r: number };
export type CollageItem = { img: string; name: string; price: string; href: string; d: number; desk: CollageSpot; mob?: CollageSpot };

export const COLLAGE: CollageItem[] = [
  { img: "reloj-verde", name: "Reloj esfera verde", price: "$20.000", href: "#relojes", d: 1, desk: { x: 13, y: 26, w: 13, r: -7 }, mob: { x: 20, y: 19, w: 34, r: -7 } },
  { img: "anillos", name: "Anillos rockeros", price: "$4.000 c/u", href: `${CATALOGO}#anillos`, d: 0.5, desk: { x: 33, y: 18, w: 9, r: 5 } },
  { img: "collar", name: "Collar nudo celta", price: "$8.000", href: `${CATALOGO}#collares`, d: 0.45, desk: { x: 64, y: 16, w: 8.5, r: -4 }, mob: { x: 52, y: 14, w: 22, r: 4 } },
  { img: "lentes", name: "Lentes rojos", price: "$10.000", href: `${CATALOGO}#lentes`, d: 0.9, desk: { x: 85, y: 25, w: 13, r: 6 }, mob: { x: 81, y: 18, w: 33, r: 6 } },
  { img: "billetera", name: "Billetera Spider", price: "$12.500", href: `${CATALOGO}#billeteras`, d: 0.7, desk: { x: 91, y: 62, w: 10, r: -6 }, mob: { x: 84, y: 84, w: 30, r: -6 } },
  { img: "pulseras", name: "Pulseras de perlas", price: "$6.000 c/u", href: `${CATALOGO}#pulseras`, d: 1.1, desk: { x: 72, y: 84, w: 12, r: 5 }, mob: { x: 17, y: 85, w: 32, r: 5 } },
  { img: "gorra", name: "Gorra negra NY", price: "$15.000", href: `${CATALOGO}#gorras`, d: 0.8, desk: { x: 28, y: 86, w: 11, r: -5 }, mob: { x: 51, y: 93, w: 24, r: -3 } },
  { img: "set-rosa", name: "Set reloj + pulsera rosa", price: "$15.000", href: "#relojes", d: 0.6, desk: { x: 7, y: 66, w: 10, r: 7 } },
];
