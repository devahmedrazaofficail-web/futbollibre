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
├── api/fixtures.js     (endpoint privado para football-data.org)
└── assets/
    ├── css/style.css
    ├── js/main.js        (navegación móvil, acordeón FAQ, año)
    └── js/agenda.js      (carga y renderiza los partidos)
```

## Agenda automática

La agenda solicita a football-data.org los partidos de hoy y de los dos días siguientes
mediante `api/fixtures.js`. La API key se mantiene en el servidor y nunca se expone al
navegador. La página actualiza los datos al cargar y cada 15 minutos. La cobertura es
fútbol y depende de las competiciones disponibles en el plan de football-data.org; no
incluye baloncesto, hockey, motor ni enlaces o reproductores de retransmisión.

Para activar la API en Vercel:

1. Crea una cuenta en [football-data.org](https://www.football-data.org/client/register)
   y genera un token para el plan que cubra tus competiciones.
2. En el proyecto de Vercel abre **Settings → Environment Variables**.
3. Añade `FOOTBALL_DATA_API_TOKEN` con ese token para Production (y Preview si lo necesitas).
4. Vuelve a desplegar el proyecto. Sin el token, la agenda muestra un aviso de configuración.

## Despliegue en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel: **Add New → Project → Import** el repositorio.
3. Framework Preset: **Other**. Build Command: *(vacío)*. Output Directory: *(vacío / raíz)*.
4. Deploy. Las URLs limpias (`/agenda`, `/canales`…) funcionan gracias a `vercel.json`.

## Tareas del propietario (pendientes)

- [ ] **Dominio real**: sustituir el dominio provisional `https://futbollibrelivetv.com/`
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
