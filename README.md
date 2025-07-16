# Sistema de Feedback de Colaboradores

Este es un sistema web para registrar y gestionar el feedback de múltiples colaboradores. Permite a un líder de equipo recolectar retroalimentación de manera ordenada, visualizar avances y tomar decisiones informadas sobre el desarrollo individual de cada colaborador.

## Funcionalidades

*   **Formulario de Registro:**
    *   Campo de nombre del colaborador.
    *   Campo de PO asignado.
    *   Campo de comentarios del feedback.
    *   Campo de fecha del feedback.
    *   Checklist de mejoras editable.
*   **Gestión y Visualización:**
    *   Almacenamiento de datos en el `localStorage` del navegador.
    *   Historial de feedback por colaborador.
    *   Filtros por períodos: último mes, últimos 3 meses y últimos 6 meses.
    *   Resumen visual de indicadores de mejora por colaborador.
*   **Exportación:**
    *   Exportación de todos los registros en formato Excel (`.xlsx`).
*   **Otros:**
    *   Diseño responsivo y limpio con Tailwind CSS.
    *   Posibilidad de editar o eliminar registros existentes.
    *   Funciona de manera local sin necesidad de servidor.
    *   Estructura de proyecto MVC (Modelo-Vista-Controlador).

## Guía de Descarga y Uso

### Descarga

Puedes descargar el código fuente de este repositorio de las siguientes maneras:

*   **Clonando el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```
*   **Descargando el ZIP:**
    En la página principal del repositorio, haz clic en el botón "Code" y luego en "Download ZIP".

### Uso

1.  Una vez que hayas descargado el código, abre el archivo `index.html` en tu navegador web.
2.  El sistema se cargará y podrás comenzar a registrar y gestionar el feedback.

## URL de GitHub Pages

Puedes acceder a una versión en vivo de este sistema a través de GitHub Pages en la siguiente URL:

[https://tu-usuario.github.io/tu-repositorio/](https://tu-usuario.github.io/tu-repositorio/)

**Nota:** Reemplaza `tu-usuario` y `tu-repositorio` con tu nombre de usuario de GitHub y el nombre de tu repositorio.

## Versiones

*   **v1.0.0:** Versión inicial del sistema con todas las funcionalidades básicas implementadas.
*   **v1.1.0:** Implementación de GitHub Actions para despliegue continuo en GitHub Pages y mejoras en la localización.
*   **v1.2.0:** Mejoras en la interfaz y experiencia de usuario con un enfoque minimalista.
*   **v2.0.0:** Refactorización a una arquitectura MVC, integración de Tailwind CSS y mejoras generales de la estructura del proyecto.
*   **v2.1.0:** Ajuste de la estructura de archivos para el correcto despliegue en GitHub Pages.
