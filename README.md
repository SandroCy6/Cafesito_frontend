# Cafetería Harvest — Frontend

Plataforma web para la gestión de pedidos y catálogo de productos de la Cafetería Harvest. Desarrollada como proyecto académico del curso **Herramientas de Desarrollo**.

---

## Tabla de contenidos

- [Cafetería Harvest — Frontend](#cafetería-harvest--frontend)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [Stack tecnológico](#stack-tecnológico)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos previos](#requisitos-previos)
    - [Pasos](#pasos)
  - [Equipo de trabajo](#equipo-de-trabajo)

---

## Descripción

Aplicación web que permite a los usuarios explorar el catálogo de cafés y postres, ver el detalle de cada producto, gestionar su carrito de compras y acceder mediante un sistema de autenticación. El proyecto sigue una arquitectura de **feature branches**, donde cada integrante trabajó de forma independiente en su módulo asignado antes de integrarlo a la rama principal.

---

## Stack tecnológico

| Tecnología       | Uso                                      |
|------------------|------------------------------------------|
| Next.js 14+      | Framework principal (App Router)         |
| TypeScript       | Tipado estático                          |
| Tailwind CSS     | Estilos y diseño responsivo              |
| Shadcn UI        | Componentes de interfaz reutilizables    |
| Git / GitHub     | Control de versiones y colaboración      |

---

## Estructura del proyecto

```
cafesito_frontend/
├── app/              # Rutas y páginas (App Router de Next.js)
├── components/       # Componentes reutilizables (Shadcn + propios)
├── data/             # Datos estáticos del catálogo
├── lib/              # Utilidades y helpers
├── store/            # Estado global
├── public/           # Archivos estáticos
└── components.json   # Configuración de Shadcn UI
```

---

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js `v18` o superior
- npm `v9` o superior

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/SandroCy6/Cafesito_frontend.git
cd Cafesito_frontend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar el servidor de desarrollo**

```bash
npm run dev
```

**4. Abrir en el navegador**

```
http://localhost:3000
```

---

## Equipo de trabajo

| Integrante                        | Módulo asignado      | Descripción                                                        |
|-----------------------------------|----------------------|--------------------------------------------------------------------|
| Almendra Pacheco Santa Cruz       | Layout base / Home   | Estructura base de la aplicación: Navbar, Footer y página de inicio |
| Alexander Xavier Neyra de la Cruz | Catálogo             | Página de listado de productos (cafés y postres) usando Cards de Shadcn |
| Huamaní Peña Dayana Michelle      | Detalle de producto  | Vista individual de cada producto con descripción y precio         |
| Sandro Rafael Díaz Maguiña        | Carrito              | Gestión de pedidos y cálculo del total a pagar                     |
| Ariana Tenorio Tanta              | Autenticación        | Formularios de Login y Registro de usuario                         |

---

> Curso: Herramientas de Desarrollo — Universidad Tecnologica del Perú 
> Docente: Quispe Tincopa Lino Martin
