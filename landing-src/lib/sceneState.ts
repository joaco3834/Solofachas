// Estado compartido entre el DOM (scroll, puntero) y la escena 3D, sin re-renders de React
export const sceneState = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  // en el celu, lugar que deja la sección "Elegí tu esfera" para el reloj (en unidades 3D)
  slot: null as null | { y: number; s: number },
};
