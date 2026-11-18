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
