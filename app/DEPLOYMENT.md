# Publicación en Render

Esta versión conserva el juego A1/A2, el progreso local y el acceso opcional a la cuenta existente.

- Repositorio: https://github.com/gcampos-sketch/clases-aleman
- Rama de publicación: `render/desktop-app`
- Enlace: https://deutsch-gonzalo.onrender.com
- Servicio: https://dashboard.render.com/web/srv-dbt51cu7bikc73d2gc00
- Runtime: Node.js 24
- Compilación: `cd app && npm ci --include=dev && npm run build`
- Inicio: `cd app && npm start`
- El servidor escucha en el puerto que entrega Render mediante `PORT`.

Configurar en Render las variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` usando los valores del proyecto existente. Nunca subir `.env` al repositorio.

El audio usa la voz alemana del navegador como alternativa. La síntesis de Lovable requiere `LOVABLE_API_KEY` en el servidor; esta exportación no incluye esa credencial. Para confirmaciones de registro y recuperación de contraseña, el nuevo origen debe estar permitido en la configuración de redirecciones del proveedor de autenticación.

El progreso local pertenece a cada origen. El avance guardado en otro dominio no se transfiere automáticamente al enlace nuevo; el avance en la nube se recupera al entrar a la misma cuenta.


## Comprobación de audio y avance

- El cliente consulta `/api/tts?capabilities=1` para elegir entre el servidor y la voz alemana del navegador. Si falta la credencial del servidor, usa directamente el navegador, sin fallos 500 repetidos.
- El reproductor conserva pausa, continuar, detener y secuencias de frases en ambas alternativas.
- Con sesión iniciada, «Avance confirmado en la nube» aparece después de leer o escribir la versión real del servidor. «Guardar ahora» permite comprobarlo antes de cambiar de computador.
- Las escrituras comprueban la revisión del servidor. Si dos computadores tienen cambios diferentes, se conservan copias locales y se pide elegir cuál usar.
- La versión de otro computador se carga también cuando la app ya estaba abierta. Los cambios pendientes sobreviven al cierre del navegador en ese mismo computador.
- Pruebas automatizadas: `node --experimental-strip-types --test tests/*.test.mjs` desde `app/`.


## Navegación y verificación del 16/11/2026

- Menú de escritorio plegable con preferencia local; expansión por hover y foco de teclado. Preferencias usa iconos Lucide y el logo ä se comparte entre acceso, navegación y carga.
- La carga interna usa una animación de marca con reducción de movimiento. La pantalla previa de arranque en frío de un servicio gratuito pertenece a Render y no puede reemplazarse con código de la app. Evitarla requiere publicar la interfaz estática o cambiar el plan del servicio; no se ha cambiado de plan.
- El audio limita la espera de detección del servidor a 1,2 segundos y divide pasajes largos en fragmentos; el botón de pronunciación lenta aplica realmente su velocidad.
- Verificación real: evento de inicio y fin de voz alemana Anna, de-DE; lectura autenticada del avance contra la base existente; recuperación de la misma versión mediante ProgressSync con almacenamiento vacío. No se crearon cuentas ni se añadieron puntos de prueba.
- Mantener publicación de cada corrección y comprobar el despliegue antes de informarlo como publicado. El repositorio público de este servicio no activó los despliegues anteriores pese al indicador autoDeploy: comprobar la lista y publicar manualmente si no aparece un despliegue nuevo.
