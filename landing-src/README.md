# Landing de Solofachas

Landing con reloj 3D (Next.js, Tailwind CSS, React Three Fiber, GSAP ScrollTrigger y Framer Motion).
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
- Modelo 3D del reloj: `components/three/Watch.tsx`
- Imágenes del modo liviano: `public/reloj/` (renders del mismo modelo 3D)

## Modo liviano

Si la compu o el celu no tienen buena placa de video, la página muestra el reloj como imagen
(sigue moviéndose con el scroll y el mouse) en lugar del 3D en vivo. Para forzar un modo:
agregá `?modo=3d` o `?modo=liviano` al final del link.
