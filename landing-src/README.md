# Landing de Solofachas

Landing con collage de productos (Next.js, Tailwind CSS, GSAP ScrollTrigger y Framer Motion).
Se publica en https://joaco3834.github.io/Solofachas/landing/

## Cómo actualizarla

```bash
cd landing-src
npm install
npm run dev            # vista previa en http://localhost:3000/Solofachas/landing
npm run publish-site   # compila y copia el resultado a la carpeta ../landing
```

Después subí los cambios a `main` y GitHub Pages la actualiza en uno o dos minutos.

- Productos, precios y links: `lib/data.ts`
- Fotos de los destacados: `public/productos/`
- Fotos del collage de la portada: `public/collage/` (posiciones en `COLLAGE`, dentro de `lib/data.ts`)

## Pedido compartido

La landing y el catálogo usan el mismo pedido (se guarda en el navegador con la clave `sf-pedido`).
El botón "Tu pedido" de la landing abre el catálogo con el pedido abierto (`/Solofachas/#pedido`).
