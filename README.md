# 📄 Sistema de Actas CEM – Entrega de Equipos

Aplicación web para la **gestión, generación, firma y almacenamiento de actas de entrega de equipos** del Comité de Estudios Médicos (CEM).

Este sistema reemplaza procesos manuales (Word + Drive) por un flujo digital controlado, auditable y eficiente.

---

## 🧠 Arquitectura General

Arquitectura **Frontend + Backend desacoplados**, donde el backend es la **única fuente de verdad** para:
- Numeración de actas
- Persistencia
- Integraciones externas (Drive, Gemini)

---

## 🖥️ Frontend

**Stack**
- React + TypeScript
- Tailwind CSS
- Canvas (firmas manuscritas)
- Fetch API

### 📂 Estructura de Carpetas (Frontend)

```
src/
│
├── App.tsx                ✅ Orquestador principal
├── main.tsx               (o index.tsx)
│
├── types.ts               ✅ Tipos globales
├── constants.ts           ✅ Constantes globales
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── CreateActaPage.tsx
│   └── PreviewPage.tsx
│
├── components/
│   └── acta/
│       ├── layout/
│       │   ├── ActaPreview.tsx        ✅ Formato A4
│       │   ├── Navbar.tsx             ✅ Formato A4
│       │   └── SignaturePad.tsx       ✅ Firma en canvas
│       │
│       ├── form/
│       │   ├── DestinatarioForm.tsx
│       │   ├── EquipoForm.tsx
│       │   └── EntregaForm.tsx
│       │
│       └── ui/
│           ├── ActaCard.tsx
│           └── ActaStatusBadge.tsx
│
├── services/
│   ├── api.ts             ✅ conexión al backend
│   └── user.service.ts    ✅ Uso de la API
│
├─ App.tsx                  # Orquestador principal del flujo
├─ types.ts                 # Interfaces globales (ActaData, etc.)
├─ constants.tsx            # Configuración institucional (CEM)
├─ index.tsx                # Punto de entrada React
└─ index.html               # Template base
```

> ⚠️ **Nota importante**  
> `types.ts` vive al mismo nivel que `App.tsx` e `index.tsx`.  
> No está dentro de ninguna carpeta.

---

## 🔒 Backend

**Stack sugerido**
- Node.js + Express
- Google Drive API
- Gemini API (Google Generative AI)
- Base de datos (PostgreSQL / MySQL / MongoDB)

### Responsabilidades del Backend

- 🔢 Reservar número de acta (consecutivo único)
- ☁️ Subir PDFs firmados a Google Drive
- 🧾 Guardar metadatos del acta
- 🤖 Ejecutar Gemini (nunca en frontend)
- 🔐 Proteger credenciales y API Keys

---

## 🔢 Numeración de Actas (Crítico)

El backend es la **única fuente de verdad**.

### Flujo correcto:
1. Frontend → `POST /actas/reserve`
2. Backend:
   - Incrementa contador
   - Crea registro `draft`
   - Devuelve `{ actaId, actaNumber }`
3. Frontend:
   - Muestra el número
   - Nunca lo calcula

Formato recomendado:
```
ACTA No. S579
ACTA No. S580
```

---

## ✍️ Firmas

- Capturadas en frontend con `SignaturePad`
- Convertidas a Base64
- Incrustadas en el PDF
- El PDF final es el único archivo válido

---

## ☁️ Google Drive

- El frontend **NO** se conecta a Drive
- El backend:
  - Sube el PDF
  - Recibe `driveFileId`
  - Guarda solo ese ID en la DB

---

## 🤖 Gemini AI

- Ubicación: **Backend**
- Archivo recomendado: `services/geminiService.ts`
- Usos:
  - Redacción profesional de observaciones
  - Sugerencias técnicas

> ❌ Nunca exponer `API_KEY` en frontend

---

## 🔐 Variables de Entorno (Backend)

```env
PORT=3001
DATABASE_URL=
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=
GEMINI_API_KEY=
```

---

## 🚀 Instalación

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
npm install
npm run dev
```

---

## 🧾 Estados del Acta

- `draft` → creada, no firmada
- `pending_scan` → firmada en físico
- `uploaded` → PDF cargado y bloqueado

---

## 🏁 Nota Final

Una vez generado y subido el PDF:
- El acta queda **bloqueada**
- No se edita
- Se conserva para auditoría

---

**CEM – Gestión profesional, clara y auditable de actas institucionales.**
