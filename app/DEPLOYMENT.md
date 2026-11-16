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
