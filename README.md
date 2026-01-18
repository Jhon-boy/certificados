# 🎓 Sistema de Gestión de Certificados - Universidad de Guayaquil

Sistema web completo para la gestión, generación y emisión de certificados académicos de la Universidad de Guayaquil emitidos por los EVENTOS que desarrollan en la institución. Desarrollado con arquitectura en capas, implementando patrones de diseño modernos y mejores prácticas de desarrollo.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Tecnologías y Herramientas](#-tecnologías-y-herramientas)
- [Patrones de Diseño Implementados](#-patrones-de-diseño-implementados)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Uso](#-uso)

---

## 🎯 Descripción

Sistema integral desarrollado en **.NET 8.0** que permite gestionar eventos académicos, generar certificados en formato PDF con códigos QR, enviar notificaciones por correo electrónico y mantener un registro completo de auditoría de todas las operaciones realizadas en el sistema.

---

## ✨ Características Principales

- 📄 **Generación Automática de Certificados PDF**: Creación dinámica de certificados con formato personalizable
- 📧 **Sistema de Notificaciones**: Envío automático de certificados por correo electrónico
- 🔍 **Códigos QR**: Integración de códigos QR en certificados para verificación digital
- 📊 **Dashboard Administrativo**: Panel de control con métricas y estadísticas en tiempo real
- 🔐 **Sistema de Auditoría Completo**: Registro automático de todas las operaciones CRUD
- 👥 **Gestión de Usuarios y Roles**: Sistema de autenticación y autorización por roles
- 📚 **Gestión de Eventos Académicos**: Administración completa de eventos, expositores y participantes
- 🎨 **Formatos Personalizables**: Múltiples plantillas de certificados configurables
- 📝 **Actas de Asistencia y Calificación**: Registro y seguimiento de participantes

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una **Arquitectura en Capas (Layered Architecture)** con separación clara de responsabilidades:

```
┌─────────────────────────────────────┐
│   certificados.web (Presentación)  │  ← Controllers, Views, Mappers
├─────────────────────────────────────┤
│  certificados.services (Negocio)   │  ← Lógica de negocio, Servicios
├─────────────────────────────────────┤
│   certificados.dal (Acceso Datos)  │  ← Data Access, Repositorios
├─────────────────────────────────────┤
│  certificados.models (Modelos)     │  ← Entidades, Context, Helpers
└─────────────────────────────────────┘
```

### Capas del Sistema

1. **Capa de Presentación (`certificados.web`)**
   - Controllers MVC para manejo de peticiones HTTP
   - Views Razor para renderizado de UI
   - Mappers para transformación de DTOs
   - Middleware personalizado para manejo de excepciones

2. **Capa de Servicios (`certificados.services`)**
   - Lógica de negocio centralizada
   - Servicios especializados (PDF, Email, Certificados, etc.)
   - Validaciones y reglas de negocio

3. **Capa de Acceso a Datos (`certificados.dal`)**
   - Data Access Objects (DA) siguiendo patrón Repository
   - Abstracción de acceso a base de datos
   - Servicios de auditoría

4. **Capa de Modelos (`certificados.models`)**
   - Entidades de dominio (Entity Framework Core)
   - Contexto de base de datos (AppDbContext)
   - Helpers y utilidades compartidas
   - Entidades de auditoría

---

## 🛠️ Tecnologías y Herramientas

### Framework y Lenguaje
- **.NET 8.0** - Framework de desarrollo multiplataforma
- **C#** - Lenguaje de programación orientado a objetos
- **ASP.NET Core MVC** - Framework web para aplicaciones MVC

### Base de Datos y ORM
- **SQL Server** - Sistema de gestión de bases de datos relacionales
- **Entity Framework Core 9.0** - ORM para acceso a datos
- **Code First Migrations** - Migraciones de esquema de base de datos

### Herramientas de Desarrollo
- **Visual Studio 2022** - IDE principal
- **SQL Server Management Studio** - Gestión de base de datos
- **Git** - Control de versiones

---

## 🎨 Patrones de Diseño Implementados

### 1. **Dependency Injection (Inyección de Dependencias)**
- Registro automático de servicios mediante reflexión
- Ciclo de vida Scoped para servicios y Data Access
- Configuración centralizada en `DependencyInjection.cs`

```csharp
// Registro automático de servicios que terminan en "Service"
services.AddScoped<ServiceType>();

// Registro automático de Data Access que terminan en "DA"
services.AddScoped<DAType>();
```

### 2. **Repository Pattern (Patrón Repositorio)**
- Abstracción de acceso a datos mediante clases `*DA` (Data Access)
- Separación entre lógica de negocio y persistencia
- Facilita testing y mantenibilidad

### 3. **Service Layer Pattern (Capa de Servicios)**
- Servicios especializados por dominio (CertificadosService, EmailService, PdfService, etc.)
- Encapsulación de lógica de negocio
- Reutilización de código

### 4. **Mapper Pattern (Patrón Mapeador)**
- Transformación entre entidades y DTOs
- Separación de modelos de dominio y modelos de presentación
- Mappers especializados por entidad

### 5. **Middleware Pattern**
- Manejo global de excepciones
- Logging automático de errores en base de datos
- Respuestas JSON estandarizadas

### 6. **Audit Pattern (Patrón de Auditoría)**
- Sistema de auditoría automático para todas las entidades
- Tablas de auditoría separadas por esquema
- Helper genérico para conversión de entidades a auditoría

### 7. **Response Pattern**
- Respuestas estandarizadas mediante `ResponseApp`
- Códigos de estado consistentes
- Manejo centralizado de errores

---

## 📁 Estructura del Proyecto

```
app-web-certificados/
│
├── certificados.web/              # Capa de Presentación
│   ├── Controllers/              # Controladores MVC
│   │   ├── Mappers/              # Mappers DTO ↔ Entity
│   │   └── *.Controller.cs      # Controladores por dominio
│   ├── Views/                    # Vistas Razor
│   ├── Models/                   # DTOs y ViewModels
│   ├── Infrastructure/           # Configuración DI
│   └── wwwroot/                  # Archivos estáticos
│
├── certificados.services/         # Capa de Servicios
│   └── Services/                 # Servicios de negocio
│       ├── CertificadosService.cs
│       ├── PdfService.cs
│       ├── EmailService.cs
│       └── ...
│
├── certificados.dal/              # Capa de Acceso a Datos
│   └── DataAccess/               # Data Access Objects
│       ├── TcertificadoDA.cs
│       ├── TeventoDA.cs
│       ├── AuditoriaService.cs
│       └── ...
│
└── certificados.models/           # Capa de Modelos
    ├── Context/                   # DbContext
    │   └── AppDbContext.cs
    ├── Entitys/                   # Entidades
    │   ├── dbo/                   # Entidades principales
    │   └── auditoria/             # Entidades de auditoría
    ├── Helper/                    # Helpers y utilidades
    │   └── AuditHelper.cs
    ├── Utils/                     # Constantes y utilidades
    └── Migrations/                # Migraciones EF Core
```

---

## 📦 Requisitos Previos

Antes de desplegar la aplicación, asegúrate de tener instalados:

- **Visual Studio 2022** o superior
  - Descarga: [Visual Studio Community](https://visualstudio.microsoft.com/es/vs/community/)
  - Workloads requeridos: ASP.NET y desarrollo web

- **SQL Server 2016** o superior
  - SQL Server Express es suficiente para desarrollo
  - Descarga: [SQL Server Express](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)

- **SQL Server Management Studio (SSMS) 20.x** o superior
  - Descarga: [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)

- **.NET 8.0 SDK**
  - Generalmente incluido con Visual Studio 2022
  - Verificación: `dotnet --version`

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/{USUARIO}/app-web-certificados.git
cd app-web-certificados
git checkout feature/produccion_certificados
```

### 2. Configurar la Base de Datos

1. Abre **SQL Server Management Studio**
2. Crea una nueva base de datos llamada `certificado`
3. O modifica la cadena de conexión en `appsettings.json`

### 3. Configurar la Cadena de Conexión

Edita el archivo `certificados.web/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=certificado;User ID=sa;Password=TuPassword;TrustServerCertificate=True;MultipleActiveResultSets=true;Encrypt=True"
  }
}
```

### 4. Aplicar Migraciones

Abre la **Terminal de Visual Studio** (Package Manager Console) y ejecuta:

```powershell
# Navegar al proyecto de modelos
cd certificados.models

# Crear migración (solo la primera vez)
Add-Migration InitialCreate

# Aplicar migraciones a la base de datos
Update-Database
```

### 5. Configurar Email (Opcional)

Si deseas habilitar el envío de correos, configura en `appsettings.json`:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "tu_correo@gmail.com",
    "SmtpPassword": "tu_contraseña"
  }
}
```

### 6. Ejecutar la Aplicación

1. Establece `certificados.web` como proyecto de inicio
2. Presiona **F5** o haz clic en **Iniciar**
3. La aplicación se abrirá en `https://localhost:5001` (o puerto configurado)

---

## 🗄️ Configuración de Base de Datos

### Esquemas de Base de Datos

El sistema utiliza dos esquemas principales:

- **`dbo`**: Esquema principal con todas las tablas de negocio
- **`auditoria`**: Esquema para tablas de auditoría (historial de cambios)

### Entidades Principales

- `Tcertificado` - Certificados generados
- `Tevento` - Eventos académicos
- `Tpersona` - Personas/participantes
- `Tdocente` - Docentes
- `Tgrupo` - Grupos de participantes
- `TformatoCertificado` - Plantillas de certificados
- `Tusuario` - Usuarios del sistema
- `Trol` - Roles de usuario
- `Tlog` - Logs de errores y excepciones

---

## 💻 Uso

### Endpoints Principales

El sistema expone múltiples endpoints RESTful organizados por controladores:

- `/api/certificado/*` - Gestión de certificados
- `/api/evento/*` - Gestión de eventos
- `/api/persona/*` - Gestión de personas
- `/api/usuario/*` - Gestión de usuarios
- `/Dashboard` - Panel administrativo

### Flujo de Generación de Certificados

1. **Crear Evento**: Registrar un evento académico
2. **Agregar Participantes**: Asociar personas al evento
3. **Configurar Formato**: Seleccionar plantilla de certificado
4. **Generar Certificados**: Crear PDFs con códigos QR
5. **Enviar Notificaciones**: Distribuir certificados por email

---

## 🔒 Seguridad y Auditoría

- **Sistema de Auditoría Automático**: Todas las operaciones CRUD se registran automáticamente
- **Manejo Global de Excepciones**: Errores capturados y registrados en base de datos
- **Validación de Datos**: Validaciones en múltiples capas
- **Roles y Permisos**: Sistema de autorización por roles

---

## 📝 Notas Adicionales

- El proyecto utiliza **Code First** con Entity Framework Core
- Las migraciones se gestionan mediante **EF Core Migrations**
- El sistema de auditoría utiliza **reflexión** para conversión automática de entidades
- Los códigos QR se generan con **ZXing.Net**

---

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado siguiendo las mejores prácticas de desarrollo de software:

- ✅ Separación de responsabilidades
- ✅ Principios SOLID
- ✅ Código limpio y mantenible
- ✅ Arquitectura escalable
- ✅ Documentación en código

---

## 📄 Licencia

Este proyecto es de uso interno para la Universidad de Guayaquil.

---

## 👤 Autor
JOHN CUVI - Ingeniero de software
- 📧 Email: jhoncuvi12@gmail.com 
- 📧 Linkedin: https://www.linkedin.com/in/john-cuvi-ba8246272/

---
 
