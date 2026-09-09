# FitAdapt — Documento de Arquitectura y Reglas Maestras
**Versión:** 1.0.0 (Fase 1 completada)  
**Estado:** Arquitectura base, modelos y motor de compatibilidad establecidos.

---

## 1. Visión General del Proyecto

**FitAdapt** es una plataforma de entrenamiento personalizado desarrollada progresivamente como Progressive Web App (PWA). Genera planes de ejercicio adaptados rigurosamente a las características, objetivos, disponibilidad, entorno y limitaciones físicas declaradas por cada usuario.

### Principio Arquitectónico Fundamental
FitAdapt **no depende exclusivamente de modelos de lenguaje o inteligencia artificial generativa** para decidir qué ejercicios recomendar. La arquitectura establece una separación estricta en cinco capas:

```
┌────────────────────────────────────────────────────────┐
│  5. Capa Asistiva de IA (Explicación, coaching, dudas) │
└───────────────────────────┬────────────────────────────┘
                            │ (Solo consulta y asiste; no ignora reglas)
┌───────────────────────────▼────────────────────────────┐
│  4. Generador de Rutinas (Fase 6)                       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  3. Motor de Reglas y Compatibilidad (Deterministic)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  2. Metadatos de Ejercicios (Impacto, palancas, riesgos)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  1. Base Estructurada de Ejercicios (Catálogo Validador)│
└────────────────────────────────────────────────────────┘
```

1. **Base estructurada de ejercicios:** Catálogo curado con especificaciones biomecánicas y de seguridad validadas.
2. **Metadatos de cada ejercicio:** Registro exhaustivo de impacto, grupos musculares, contraindicaciones e incompatibilidades.
3. **Motor de reglas y compatibilidad:** Algoritmo determinista que evalúa `Exercise + UserProfile` produciendo `compatible`, `compatible_with_modification` o `not_recommended`. Las limitaciones físicas siempre anulan preferencias de rendimiento.
4. **Generador de rutinas:** Orquestador de volumen, descanso y progresión semanal.
5. **Inteligencia artificial como capa asistiva:** Puede explicar ejercicios, sugerir alternativas dentro del catálogo preaprobado y motivar, pero **nunca** inventar ejercicios inexistentes ni puentear restricciones del motor.

---

## 2. Mapa de Fases del Proyecto

| Fase | Título | Estado |
| :--- | :--- | :--- |
| **FASE 1** | **Arquitectura, reglas maestras y estructura base** | **ACTIVA / COMPLETADA** |
| FASE 2 | Sistema visual y UI/UX | Siguiente |
| FASE 3 | Onboarding y perfil fitness | Planificada |
| FASE 4 | Biblioteca estructurada de ejercicios | Planificada |
| FASE 5 | Motor de personalización y compatibilidad avanzada | Planificada |
| FASE 6 | Generador de rutinas | Planificada |
| FASE 7 | Entrenamiento activo y planificación semanal | Planificada |
| FASE 8 | Progreso y estadísticas | Planificada |
| FASE 9 | Asistente Fitness con IA | Planificada |
| FASE 10 | PWA, optimización, accesibilidad, seguridad y lanzamiento | Planificada |

---

## 3. Reglas de Continuidad y Calidad Técnica

Durante todas las fases del desarrollo se aplicarán de forma obligatoria las siguientes directrices:
* **No reconstruir la aplicación desde cero ni eliminar código funcional.**
* **No implementar funcionalidades de fases futuras antes de tiempo** (p. ej., no llamar a Gemini antes de la Fase 9 ni persistir rutinas avanzadas antes de la Fase 6).
* **Separación estricta:** Mantener siempre desacoplada la interfaz de usuario (UI), la lógica de negocio (Rules Engine) y los datos de dominio.
* **Seguridad y ética médica:**
  * No diagnosticar lesiones ni certificar aptitud médica.
  * Prohibido prometer reducción de grasa localizada.
  * Advertencia visible y detención ante banderas rojas (dolor agudo, cirugía reciente, síntomas cardiovasculares).
* **Morfología corporal:** Uso estrictamente como variable secundaria descriptiva y ergonómica.

---

## 4. Modelos de Datos Conceptuales

Todos los tipos están centralizados en `/src/types/` y exportados a través de `/src/types/index.ts`:

### 4.1 Entidades Principales
- **`UserProfile` (`src/types/user.ts`):** Perfil antropométrico, objetivos (`FitnessGoal`), nivel (`FitnessLevel`), entorno (`TrainingLocation`, `AnyEquipment`), limitaciones físicas y declaración de seguridad médica.
- **`Exercise` (`src/types/exercise.ts`):** Ficha técnica biomecánica completa con categoría, nivel objetivo y mínimo, tipo de movimiento, impacto articular (`LOW`, `MEDIUM`, `HIGH`), intensidad, tiempos, instrucciones paso a paso, errores frecuentes, contraindicaciones, códigos de limitaciones incompatibles y versiones adaptadas (bajo impacto y sin equipamiento).
- **`PhysicalLimitation` (`src/types/user.ts`):** Código normalizado, zona afectada, severidad, movimientos incompatibles y bandera `requiresLowImpact`.
- **`Workout` & `WorkoutExercise` (`src/types/workout.ts`):** Estructura en bloques (calentamiento, principal, vuelta a la calma) con snapshot del ejercicio y registro de adaptaciones aplicadas.
- **`WorkoutPlan` & `WorkoutSession` (`src/types/workout.ts`):** Planificación semanal y registro en vivo de series completadas, RPE y molestias percibidas.
- **`ProgressRecord` (`src/types/progress.ts`):** Métricas cuantitativas y cualitativas de adherencia.
- **`AIInteraction` (`src/types/ai.ts`):** Auditoría de respuestas generadas por IA y verificación estricta de restricciones de seguridad (`passedSafetyAudit`).

---

## 5. Especificación del Motor de Compatibilidad

El motor está implementado en `src/core/compatibility/evaluator.ts` y sus reglas en `src/core/compatibility/rules.ts`.

### Algoritmo de Evaluación
Para cada pareja `(Exercise, UserProfile)`:
1. **Filtro Crítico #1 (Limitaciones Físicas):** Si el usuario declara una limitación presente en `exercise.incompatibleLimitationCodes`:
   - Si existe `exercise.lowImpactVersion` y la limitación lo tolera -> `COMPATIBLE_WITH_MODIFICATION`.
   - Si no existe alternativa segura -> `NOT_RECOMMENDED`.
2. **Filtro Crítico #2 (Impacto Articular):** Si el usuario requiere bajo impacto y el ejercicio es `HIGH` impact:
   - Si tiene `lowImpactVersion` -> `COMPATIBLE_WITH_MODIFICATION`.
   - Si no -> `NOT_RECOMMENDED`.
3. **Filtro Crítico #3 (Equipamiento):** Si el usuario no dispone del equipamiento:
   - Si tiene `noEquipmentVersion` -> `COMPATIBLE_WITH_MODIFICATION`.
   - Si no -> `NOT_RECOMMENDED`.
4. **Filtro Crítico #4 (Lugar):** Validación `exercise.compatibleLocations.includes(user.trainingLocation)`.
5. **Regla de Nivel y Progresión:** Si el nivel del usuario es menor a `exercise.minLevelAllowed` -> `NOT_RECOMMENDED`.
6. **Alineación de Objetivos:** Modula el score final de compatibilidad (100 para objetivo primario directo, 88 para secundario, 75 para adaptación).

---

## 6. Preparación para la Fase 2 (Sistema Visual y UI/UX)

La Fase 1 deja listos los cimientos para la Fase 2:
- **Design Tokens y Tipografía:** Tailwind CSS v4 configurado con soporte para paletas de alto contraste y estados visuales accesibles (WCAG AA).
- **Componentes de Demostración y Diagnóstico:** Interfaz de control en `src/App.tsx` que permite probar en tiempo real las reglas de compatibilidad frente a 3 perfiles arquetípicos y visualizar la estructura sin dependencias pesadas.
- **Lucide Icons & Motion:** Listos para animaciones fluidas y microinteracciones en la siguiente fase.
