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
