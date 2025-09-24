# Gestión de Insumos

Esta aplicación está diseñada para facilitar la asignación equitativa de insumos entre los miembros de un grupo, manteniendo un registro histórico y generando reportes detallados.

Este proyecto fue inicializado con [Create React App](C:\Users\Admin\AndroidStudioProjects\GESTIONDEINSUMOSV2).

---

## Descripción y Reglas de Negocio

### 1. Reglas de Asignación

La aplicación sigue un conjunto de reglas para determinar a quién se le asigna un insumo, priorizando la equidad y la responsabilidad:

**a. Incumplimiento de Sesión Anterior (Máxima Prioridad):**
Si un miembro fue marcado como "incumplido" con un insumo específico en la sesión inmediatamente anterior, la aplicación intentará asignarle ese mismo insumo nuevamente en la sesión actual. Esto asegura que se cumpla con la responsabilidad pendiente.

**b. Distribución Equitativa de Insumos:**
Un insumo no será asignado a un miembro que ya lo haya recibido en el pasado, a menos que todos los demás miembros del grupo ya hayan recibido ese mismo insumo al menos una vez. Esto garantiza una rotación justa de todos los insumos entre todos los miembros.

**c. Rotación General:**
Si las reglas anteriores no aplican, la aplicación asignará el insumo al siguiente miembro en la secuencia de rotación general del grupo, basándose en el historial de asignaciones.

**d. Reasignación Manual:**
Puedes reasignar un insumo a otro miembro en cualquier momento durante la sesión actual. Al hacerlo, la aplicación buscará al siguiente miembro disponible según las reglas. Es importante notar que una reasignación manual "limpia" la deuda de incumplimiento para ese insumo en particular, ya que el historial registrará al nuevo asignado.

### 2. Funcionalidades del Reporte en PDF

La aplicación permite generar un reporte detallado en formato PDF, diseñado para ser claro y fácil de leer:

*   **Página 1: Registro Cronológico de Sesiones:**
    Muestra un historial detallado de las asignaciones por sesión. Cada sesión se presenta con su fecha y una lista de los insumos asignados, a quién y su estado (cumplido/incumplido). Está diseñado en dos columnas para optimizar el espacio.

*   **Página 2: Tabla de Insumos (Matriz de Cumplimiento):**
    Presenta una matriz visual donde las filas son los insumos y las columnas son los miembros. Una celda marcada con "SÍ" indica que ese miembro ha cumplido con la asignación de ese insumo en alguna ocasión. Los nombres de los insumos largos se truncan con "..." para asegurar que la tabla quepa.

### 3. Gestión de Miembros e Insumos

Puedes agregar o eliminar tanto miembros como insumos en la aplicación.

*   **Miembros:**
    *   **Añadir Miembros:** Utiliza los campos de texto y botones "Añadir" en la sección de Miembros. Los nuevos miembros deben ser agregados con números consecutivos y nunca se deben reciclar números de miembros anteriores.
    *   **Eliminar Miembros:** Junto a cada miembro en la lista, encontrarás un botón para eliminarlo.

*   **Insumos:**
    *   **Añadir Insumos:** Utiliza los campos de texto y botones "Añadir" en la sección de Insumos. Los números de insumo pueden ser reciclados.
    *   **Eliminar Insumos:** En la sección "Gestionar Insumos", selecciona el insumo del menú desplegable y haz clic en "Eliminar Insumo Seleccionado".

*   **Marcar Estado:** En el historial, puedes hacer clic directamente sobre el estado de una asignación ("cumplido" o "incumplido") para cambiarlo.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about running tests for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about deployment for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the Create React App documentation.

To learn React, check out the React documentation.
