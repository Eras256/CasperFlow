# Configurar CSPR.cloud para RPC confiable

## El Problema
Los nodos RPC públicos de Casper (`node.testnet.casper.network:7777`) tienen problemas de:
- CORS (Cross-Origin Resource Sharing) bloqueado
- Timeouts frecuentes
- Disponibilidad inconsistente

## La Solución: CSPR.cloud

CSPR.cloud proporciona endpoints RPC con:
- ✅ CORS habilitado
- ✅ Alta disponibilidad
- ✅ Autenticación segura
- ✅ Sin timeouts

## Pasos para Configurar

### 1. Crear cuenta en CSPR.build

1. Ve a: https://console.cspr.build
2. Crea una cuenta o inicia sesión
3. Verifica tu email

### 2. Crear una App

1. Click en "Create App" o "New Project"
2. Nombre: `FlowFi` (o el nombre que prefieras)
3. Network: Selecciona `Testnet`
4. Guarda la configuración

### 3. Obtener tu Access Token

1. En tu dashboard, busca "API Keys" o "Access Tokens"
2. Crea un nuevo token
3. Copia el token (formato: `xxx-xxx-xxx-...`)

### 4. Configurar FlowFi

Agrega el token a tu archivo `.env` del backend:

```bash
# En /backend/.env
CSPR_CLOUD_ACCESS_TOKEN=tu-token-aqui
```

O expórtalo directamente:

```bash
export CSPR_CLOUD_ACCESS_TOKEN="tu-token-aqui"
```

### 5. Reiniciar el Backend

```bash
cd backend
pkill -f uvicorn
source ../.venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 6. Verificar

El log debería mostrar:
```
🔗 Casper RPC: CSPR.cloud (authenticated)
```

En lugar de:
```
⚠️ No CSPR_CLOUD_ACCESS_TOKEN set. Using public nodes (may timeout).
```

## Configuración Avanzada (CSPR.click)

Si quieres usar CSPR.click desde el frontend (sin backend proxy):

1. En console.cspr.build, configura:
   - **Allowed Origins**: `http://localhost:3000`
   - **Enabled Proxies**: Node RPC

2. El frontend puede usar directamente:
```javascript
const proxy = window.csprclick.getCsprCloudProxy();
const rpcHandler = new HttpHandler(proxy.RpcURL, 'fetch');
rpcHandler.setCustomHeaders({ Authorization: proxy.RpcDigestToken });
```

## Notas Importantes

- El token es **gratuito** para uso en testnet
- Hay límites de cuota (generosos para desarrollo)
- El token **NO debe** exponerse en el frontend (usa el backend proxy)

## URLs de Referencia

- Console: https://console.cspr.build
- Docs: https://docs.cspr.click/cspr.click-sdk/reference/cloud-proxies
- CSPR.cloud API: https://docs.cspr.cloud/
