# Fútbol Libre — Agenda de partidos en vivo

Sitio estático (HTML + CSS + JavaScript vanilla) con la agenda de partidos de fútbol en vivo,
horarios en hora peninsular española y guía de canales deportivos. Sin frameworks, sin build,
sin base de datos.

## Estructura

```
/
├── index.html          Portada (H1, agenda, canales, contenido SEO, FAQ)
├── agenda.html         Agenda completa con pestañas por día
├── canales.html        Guía de canales deportivos
├── ligas.html          Ligas y torneos cubiertos
├── guia.html           Cómo ver los partidos (guía paso a paso)
├── faq.html            Preguntas frecuentes
├── nosotros.html       Quiénes somos
├── contacto.html       Formulario de contacto (vía Formspree)
├── privacidad.html / terminos.html / dmca.html / aviso-legal.html
├── 404.html
├── robots.txt / sitemap.xml / vercel.json
└── assets/
    ├── css/style.css
    ├── js/main.js        (navegación móvil, acordeón FAQ, año)
    ├── js/agenda.js     (motor de la agenda: pestañas, buscador, filtros, modal)
    └── js/fixtures.js   (DATOS: partidos 10–12 oct 2026 + canales)
```

## Actualizar la agenda cada jornada

Edita `assets/js/fixtures.js`: cada día tiene `date`, `label`, `longLabel` y una lista
`matches` con `time` (HH:MM, hora peninsular), `comp`, `home`, `away`, `flag` (emoji),
`cat` (`futbol`, `baloncesto`, `hockey`, `motor`, `boxeo`, `tenis`, `otro`),
`venue` (opcional), `tv` (nombres de `FUTBOL_LIBRE_CHANNELS`, opcional) y
`approx: true` si el horario está por confirmar.

## Despliegue en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel: **Add New → Project → Import** el repositorio.
3. Framework Preset: **Other**. Build Command: *(vacío)*. Output Directory: *(vacío / raíz)*.
4. Deploy. Las URLs limpias (`/agenda`, `/canales`…) funcionan gracias a `vercel.json`.

## Tareas del propietario (pendientes)

- [ ] **Dominio real**: sustituir el dominio provisional `https://futbollibre.es/`
      en todos los `canonical`, `og:url`, `sitemap.xml`, `robots.txt` y JSON-LD.
- [ ] **Formulario de contacto**: crear un formulario gratuito en formspree.io y
      sustituir `action="https://formspree.io/f/TU_ID"` en `contacto.html`.
- [ ] **Discord / Telegram**: los botones de la portada apuntan a `#`; conecta tus
      enlaces reales de Discord y Telegram.
- [ ] **Search Console**: enviar `sitemap.xml` tras el despliegue.

## Notas

- Fútbol Libre es una agenda **informativa**: no emite partidos ni enlaza a
  señales no autorizadas. Cada ficha remite a canales oficiales.
- Los horarios se publican en hora peninsular española (CEST/CET).
