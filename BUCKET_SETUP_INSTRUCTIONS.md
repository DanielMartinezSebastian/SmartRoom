# Configuración del Bucket userAvatar en Supabase

## ⚠️ IMPORTANTE: El bucket debe ser PÚBLICO

### Paso 1: Verificar que el bucket existe
1. Ve a tu Dashboard de Supabase
2. Navega a **Storage** en el menú lateral
3. Busca el bucket `userAvatar`

### Paso 2: Configurar el bucket como PÚBLICO
1. Haz clic en el bucket `userAvatar`
2. Haz clic en el botón de **configuración** (⚙️) o **Settings**
3. Asegúrate de que la opción **"Public bucket"** esté **ACTIVADA** ✅
4. Si no está activada, actívala y guarda los cambios

### Paso 3: Configurar políticas de seguridad (RLS)

Ve a **SQL Editor** en Supabase y ejecuta el siguiente SQL:

```sql
-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow authenticated uploads to userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update in userAvatar" ON storage.objects;

-- Política para subir archivos (usuarios autenticados)
CREATE POLICY "Allow authenticated uploads to userAvatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'userAvatar');

-- Política para leer archivos (acceso público)
CREATE POLICY "Allow public read access to userAvatar"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'userAvatar');

-- Política para eliminar archivos (usuarios autenticados)
CREATE POLICY "Allow authenticated delete from userAvatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'userAvatar');

-- Política para actualizar archivos (usuarios autenticados)
CREATE POLICY "Allow authenticated update in userAvatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'userAvatar')
WITH CHECK (bucket_id = 'userAvatar');
```

### Paso 4: Verificar la configuración

#### Opción A: Usar la consola del navegador
1. Abre la consola del navegador (F12)
2. Ve a la página de perfil
3. Intenta subir una imagen
4. Verifica los logs en la consola:
   - Debe aparecer: `Public URL generated: https://...`
   - Debe aparecer: `Avatar updated successfully: {...}`

#### Opción B: Verificar manualmente la URL
1. Sube una imagen
2. Ve a Storage > userAvatar en Supabase
3. Copia la URL pública de la imagen
4. Pégala en una nueva pestaña del navegador
5. Si la imagen se muestra, el bucket está configurado correctamente ✅

### Paso 5: Reiniciar el servidor de desarrollo

Después de hacer estos cambios:

```bash
# Detén el servidor (Ctrl+C)
# Regenera el cliente de Prisma
npx prisma generate

# Inicia el servidor nuevamente
npm run dev
```

### Problemas comunes

#### La imagen se sube pero no se muestra
- ✅ Verifica que el bucket sea **público**
- ✅ Verifica que las políticas RLS estén aplicadas
- ✅ Intenta acceder directamente a la URL de la imagen en el navegador
- ✅ Verifica la consola del navegador para errores CORS

#### Error "Bucket not found"
- ✅ Verifica que el nombre del bucket sea exactamente `userAvatar` (case-sensitive)
- ✅ Regenera el cliente de Prisma: `npx prisma generate`
- ✅ Reinicia el servidor de desarrollo

#### Error "Unauthorized"
- ✅ Verifica que estés logueado como ADMIN o WORKER
- ✅ Verifica las políticas RLS en Supabase

### Estructura de URLs

Las URLs públicas del bucket deben verse así:

```
https://[tu-proyecto].supabase.co/storage/v1/object/public/userAvatar/[nombre-archivo].png
```

Si en tu caso la URL no incluye `/public/`, es porque el bucket no está configurado como público.

### Test rápido con curl

Puedes probar si el bucket es accesible públicamente con:

```bash
# Reemplaza con la URL de una imagen que hayas subido
curl -I https://[tu-proyecto].supabase.co/storage/v1/object/public/userAvatar/[archivo].png

# Si es público, deberías ver HTTP/1.1 200 OK
# Si no es público, verás HTTP/1.1 404 Not Found o 403 Forbidden
```
