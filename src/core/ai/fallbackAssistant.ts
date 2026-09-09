/**
 * FitAdapt AI - Motor Asistivo Local de Respaldo (Fallback Assistant)
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Garantiza que si la conexión a internet o el servicio de IA externa (Gemini) no están
 * disponibles, o si el usuario trabaja en modo offline:
 * 1. La aplicación nunca se bloquee ni falle.
 * 2. Las respuestas asistivas mantengan la exactitud biomecánica respaldada por el Compatibility Engine.
 * 3. Las acciones internas de adaptación (duración, intensidad, alternativas) se ejecuten fielmente.
 */

import { UserProfile } from '../../types/user';
import { Workout } from '../../types/workout';
import { AIChatMessage, AIActionPayload } from './types';
import { MedicalSafetyFilter } from './safetyFilter';
import { AIToolsExecutor } from './tools';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

export class FallbackAssistant {
  /**
   * Procesa la consulta del usuario de forma determinista y estructurada
   */
  public static processQuery(
    query: string,
    user: UserProfile,
    workout?: Workout | null
  ): AIChatMessage {
    const text = query.trim().toLowerCase();
    const messageId = `ai-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. REGLA CRÍTICA: Interceptación de consultas médicas o dolor agudo
    const medicalCheck = MedicalSafetyFilter.evaluate(query);
    if (medicalCheck.isMedicalQuery) {
      const content = `${medicalCheck.refusalMessage}\n\n${medicalCheck.professionalReferralMessage}`;
      return {
        id: messageId,
        role: 'assistant',
        content,
        timestamp,
        isMedicalWarning: true,
        isFallback: true,
        actionPayload: {
          type: 'MEDICAL_DISCLAIMER',
          reason: 'Consulta médica o dolor agudo detectado. Se rechaza diagnóstico y se sugiere evaluación profesional.',
        },
      };
    }

    // 2. CAMBIO DE DURACIÓN (ej. "solo tengo 20 minutos", "haz mi rutina más corta", "tengo 15 min")
    const durationMatch = text.match(/(?:tengo|duración|duracion|tiempo|solo|hazla de|hacer de)\s*(\d+)\s*(?:min|minutos)/i) ||
      text.match(/(\d+)\s*(?:min|minutos)/i) ||
      (text.includes('más corta') || text.includes('mas corta') ? [null, '20'] : null);

    if (durationMatch && (text.includes('min') || text.includes('corta') || text.includes('tiempo'))) {
      const requested = parseInt(durationMatch[1], 10);
      let target: 15 | 20 | 30 | 45 | 60 = 20;
      if (requested <= 18) target = 15;
      else if (requested <= 25) target = 20;
      else if (requested <= 35) target = 30;
      else if (requested <= 50) target = 45;
      else target = 60;

      if (workout) {
        const result = AIToolsExecutor.modifyWorkoutDuration(target, workout, user);
        return {
          id: messageId,
          role: 'assistant',
          content: `Entendido. He adaptado la estructura de tu rutina a una duración objetivo de **${target} minutos** utilizando el Workout Generator.\n\nSe ha recalculado el tiempo de calentamiento, los bloques principales y la vuelta a la calma para que aproveches cada minuto de forma segura.`,
          timestamp,
          isFallback: true,
          actionPayload: result.actionPayload,
          sourceTool: 'modify_workout_duration',
        };
      }
    }

    // 3. CAMBIO DE INTENSIDAD (ej. "hacer la rutina más fácil", "más suave", "más intensa", "más difícil")
    if (text.includes('más fácil') || text.includes('mas facil') || text.includes('más suave') || text.includes('mas suave') || text.includes('menos intensa') || text.includes('menos duro')) {
      if (workout) {
        const result = AIToolsExecutor.adjustWorkoutIntensity('EASIER', workout, user);
        return {
          id: messageId,
          role: 'assistant',
          content: `He adaptado la intensidad de tu sesión actual para hacerla más asequible:\n\n• **Reducción de series**: Se reduce el volumen de trabajo para evitar fatiga prematura.\n• **Descansos ampliados (+15s)**: Permiten una recuperación cardiovascular y muscular más completa.\n• **Regresión de impacto**: Se priorizan apoyos estables y bajo impacto.`,
          timestamp,
          isFallback: true,
          actionPayload: result.actionPayload,
          sourceTool: 'adjust_workout_intensity',
        };
      }
    }

    if (text.includes('más intensa') || text.includes('mas intensa') || text.includes('más difícil') || text.includes('mas dificil') || text.includes('mayor intensidad')) {
      if (workout) {
        const result = AIToolsExecutor.adjustWorkoutIntensity('HARDER', workout, user);
        return {
          id: messageId,
          role: 'assistant',
          content: `He configurado una versión con mayor densidad y estímulo:\n\n• **Aumento de series**: En los ejercicios principales del bloque central.\n• **Densidad optimizada**: Descansos ligeramente más ajustados sin comprometer la seguridad técnica.`,
          timestamp,
          isFallback: true,
          actionPayload: result.actionPayload,
          sourceTool: 'adjust_workout_intensity',
        };
      }
    }

    // 4. BÚSQUEDA DE ALTERNATIVAS O SUSTITUCIÓN (ej. "no puedo hacer este ejercicio", "busca alternativa para zancadas", "sustituye...")
    if (
      text.includes('no puedo hacer') ||
      text.includes('alternativa') ||
      text.includes('sustituir') ||
      text.includes('sustituye') ||
      text.includes('cambiar') ||
      text.includes('cambia este')
    ) {
      // Intentar extraer el nombre del ejercicio mencionado
      let targetName: string | undefined;

      // Buscar si menciona algún ejercicio de la rutina
      if (workout) {
        for (const ex of workout.exercises) {
          if (text.includes(ex.exerciseSnapshot.name.toLowerCase())) {
            targetName = ex.exerciseSnapshot.id;
            break;
          }
        }
      }

      // Si no, buscar en la biblioteca general
      if (!targetName) {
        for (const ex of EXERCISE_LIBRARY) {
          if (text.includes(ex.name.toLowerCase())) {
            targetName = ex.id;
            break;
          }
        }
      }

      // Si dice genéricamente "este ejercicio" y hay rutina activa, tomar el primer ejercicio principal
      if (!targetName && workout && workout.exercises.length > 0) {
        const main = workout.exercises.find((e) => e.section === 'MAIN_BLOCK') || workout.exercises[0];
        targetName = main.exerciseId;
      }

      if (targetName) {
        const result = AIToolsExecutor.findAlternativeExercise(targetName, user, workout);
        if (result.success && result.actionPayload?.alternative) {
          const alt = result.actionPayload.alternative;
          return {
            id: messageId,
            role: 'assistant',
            content: `He consultado al **Compatibility Engine** para encontrar una alternativa segura y verificada para **${result.data.original}**:\n\n🎯 **Alternativa recomendada**: **${alt.exerciseName}**\n\n🛡️ **Motivo biomecánico**: ${alt.reason}\n\n📋 **Pauta de ejecución**: ${alt.howToPerform || 'Realiza el movimiento con control, prestando atención a la respiración.'}`,
            timestamp,
            isFallback: true,
            actionPayload: result.actionPayload,
            sourceTool: 'find_alternative_exercise',
          };
        } else {
          return {
            id: messageId,
            role: 'assistant',
            content: result.message || 'No se encontró un sustituto compatible en este momento.',
            timestamp,
            isFallback: true,
            sourceTool: 'find_alternative_exercise',
          };
        }
      } else {
        return {
          id: messageId,
          role: 'assistant',
          content: `Para buscar una alternativa válida mediante el Compatibility Engine, por favor indícame el nombre exacto del ejercicio que deseas sustituir (por ejemplo: *"No puedo hacer zancadas"* o *"Busca alternativa para sentadilla"*).`,
          timestamp,
          isFallback: true,
        };
      }
    }

    // 5. EXPLICACIÓN DE EJERCICIO (ej. "¿cómo hago sentadilla?", "explícame flexiones")
    if (
      text.includes('cómo hago') ||
      text.includes('como hago') ||
      text.includes('cómo se hace') ||
      text.includes('como se hace') ||
      text.includes('explícame') ||
      text.includes('explicame') ||
      text.includes('técnica de') ||
      text.includes('tecnica de')
    ) {
      // Buscar coincidencia de ejercicio
      let matchedExercise = EXERCISE_LIBRARY.find((e) => text.includes(e.name.toLowerCase()));

      if (!matchedExercise && workout) {
        matchedExercise = workout.exercises.find((e) =>
          text.includes(e.exerciseSnapshot.name.toLowerCase())
        )?.exerciseSnapshot;
      }

      if (matchedExercise) {
        const result = AIToolsExecutor.explainExercise(matchedExercise.id);
        const data = result.data;
        const steps = (data.instructions as string[]).map((step) => `• ${step}`).join('\n');
        return {
          id: messageId,
          role: 'assistant',
          content: `Aquí tienes la guía técnica para **${data.name}**:\n\n**Zona principal**: ${data.bodyArea} (${data.primaryMuscle})\n**Nivel de impacto**: ${data.impactLevel}\n\n**Paso a paso postural**:\n${steps}\n\n⚠️ **Nota de seguridad**: ${data.safetyNotes}`,
          timestamp,
          isFallback: true,
          actionPayload: result.actionPayload,
          sourceTool: 'explain_exercise',
        };
      }
    }

    // 6. PROGRESO Y CONSTANCIA (ej. "¿cómo voy esta semana?", "mi progreso", "mi racha")
    if (
      text.includes('cómo voy') ||
      text.includes('como voy') ||
      text.includes('progreso') ||
      text.includes('racha') ||
      text.includes('estadísticas') ||
      text.includes('estadisticas') ||
      text.includes('constancia')
    ) {
      const result = AIToolsExecutor.getProgressSummary();
      const s = result.data;
      return {
        id: messageId,
        role: 'assistant',
        content: `Aquí tienes tu resumen de constancia saludable:\n\n🔥 **Racha actual**: ${s.currentStreakDays} ${s.currentStreakDays === 1 ? 'día' : 'días'} consecutivos\n⭐ **Mejor racha**: ${s.bestStreakDays} días\n🏋️ **Sesiones completadas**: ${s.totalWorkoutsCompleted} entrenamientos\n⏱️ **Tiempo dedicado**: ${s.totalMinutesTrained} minutos acumulados\n📅 **Esta semana**: ${s.sessionsThisWeek} de ${s.weeklyGoalTarget} sesiones pautadas\n\n¡Cada sesión cuenta para afianzar el hábito de forma sostenible!`,
        timestamp,
        isFallback: true,
        sourceTool: 'get_progress_summary',
      };
    }

    // 7. EXPLICACIÓN DE LA RUTINA (ej. "explícame mi rutina", "¿qué me toca hoy?")
    if (
      text.includes('mi rutina') ||
      text.includes('mi entrenamiento') ||
      text.includes('de qué trata') ||
      text.includes('de que trata') ||
      text.includes('qué me toca') ||
      text.includes('que me toca')
    ) {
      if (workout) {
        const exercisesList = workout.exercises
          .map((e, idx) => `${idx + 1}. **${e.exerciseSnapshot.name}** (${e.sets} series x ${e.repsOrDuration}, descanso ${e.rest}s)`)
          .join('\n');

        return {
          id: messageId,
          role: 'assistant',
          content: `Tu sesión de hoy es **"${workout.title}"** con una duración estimada de **${workout.estimatedDurationMinutes} minutos**.\n\n🎯 **Objetivo**: ${workout.goal}\n🛡️ **Adaptaciones activas**: ${workout.adaptationNotes?.join(', ') || 'Alineada con tu perfil articular'}\n\n**Estructura de la sesión**:\n${exercisesList}\n\n¿Quieres que adaptemos la duración, cambiemos algún ejercicio o te explique la técnica de alguno de ellos?`,
          timestamp,
          isFallback: true,
          sourceTool: 'get_current_workout',
        };
      }
    }

    // 8. CONSULTAS FUERA DE CONTEXTO (ej. recetas, política, etc.)
    const isOutOfContext =
      text.includes('receta') ||
      text.includes('cocinar') ||
      text.includes('capital') ||
      text.includes('película') ||
      text.includes('pelicula') ||
      text.includes('chiste') ||
      text.includes('noticia');

    if (isOutOfContext) {
      return {
        id: messageId,
        role: 'assistant',
        content: `Como asistente de **FitAdapt**, mi especialidad es ayudarte a comprender tu rutina de entrenamiento, explicarte ejercicios, buscar alternativas compatibles y adaptar la duración o intensidad de tus sesiones.\n\n¿Te gustaría que revisemos tu entrenamiento de hoy o tienes dudas sobre algún ejercicio específico?`,
        timestamp,
        isFallback: true,
      };
    }

    // 9. RESPUESTA ASISTIVA GENERAL
    return {
      id: messageId,
      role: 'assistant',
      content: `Hola. Como asistente de FitAdapt, puedo ayudarte a:\n\n• **Explicar la técnica** de cualquier ejercicio (ej. *"¿Cómo hago sentadillas?"*)\n• **Buscar alternativas seguras** mediante el Compatibility Engine (ej. *"No puedo hacer zancadas"*)\n• **Adaptar la duración** de tu rutina (ej. *"Solo tengo 20 minutos"*)\n• **Hacer la rutina más fácil o intensa** respetando tus articulaciones\n• **Consultar tu constancia** y racha semanal\n\n¿En qué puedo ayudarte hoy?`,
      timestamp,
      isFallback: true,
    };
  }
}
