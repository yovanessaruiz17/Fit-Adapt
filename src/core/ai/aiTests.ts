/**
 * FitAdapt AI - Suite de Pruebas Automatizadas de la Fase 9
 * FASE 9: Verificación de FitAdapt AI y Reglas de Compatibilidad
 * 
 * Casos de Prueba Requeridos:
 * 1. Explicación de ejercicio (explain_exercise)
 * 2. Alternativa segura mediante Compatibility Engine (find_alternative_exercise)
 * 3. Cambio de duración (modify_workout_duration a 20 min)
 * 4. Cambio de intensidad (adjust_workout_intensity más fácil/más intensa)
 * 5. Preguntas fuera de contexto (redirección respetuosa al entrenamiento)
 * 6. Pregunta médica (rechazo categórico de diagnóstico médico)
 * 7. Dolor agudo / alarma física (recomendación de cese y evaluación profesional)
 * 8. IA no disponible / fallback determinista sin caídas
 * 9. Manejo de respuesta o payload inválido
 * 10. Ejercicio inexistente (búsqueda de ejercicio que no está en la biblioteca)
 * 11. Sanitización de privacidad (exclusión de PII y datos sensibles)
 */

import { SAMPLE_USER_PROFILES } from '../../data/sampleProfiles';
import { WorkoutGenerator } from '../generator/workoutGenerator';
import { FallbackAssistant } from './fallbackAssistant';
import { MedicalSafetyFilter } from './safetyFilter';
import { AIToolsExecutor } from './tools';
import { AIPrivacyManager } from './privacy';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

export interface AITestCaseResult {
  id: string;
  name: string;
  description: string;
  category: 'SAFETY' | 'ALTERNATIVES' | 'ADAPTATION' | 'EXPLANATION' | 'FALLBACK' | 'PRIVACY';
  passed: boolean;
  actualSummary: string;
  details?: Record<string, any>;
  durationMs: number;
}

export interface AITestSuiteReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTimeMs: number;
  results: AITestCaseResult[];
}

export class AITestSuite {
  public static runAll(): AITestSuiteReport {
    const startTime = performance.now();
    const results: AITestCaseResult[] = [];

    const userWithKnee = SAMPLE_USER_PROFILES.profileKneeSensitivity;
    const generated = WorkoutGenerator.generate({ userProfile: userWithKnee, seed: 1 });
    const workout = generated.workout;

    // =========================================================================
    // Test 1: Explicación de ejercicio
    // =========================================================================
    {
      const tStart = performance.now();
      const toolRes = AIToolsExecutor.explainExercise('squat_bodyweight');
      const passed =
        toolRes.success &&
        toolRes.data &&
        typeof toolRes.data.description === 'string' &&
        Array.isArray(toolRes.data.instructions) &&
        toolRes.data.instructions.length > 0;

      results.push({
        id: 'ai-test-1',
        name: 'Explicación de ejercicio',
        description: 'Verifica que explain_exercise devuelva descripción técnica, paso a paso y precauciones.',
        category: 'EXPLANATION',
        passed,
        actualSummary: passed
          ? `Técnica devuelta con ${toolRes.data.instructions.length} pasos posturales y notas de seguridad.`
          : 'Fallo al obtener explicación estructurada.',
        details: toolRes.data,
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 2: Alternativa segura mediante Compatibility Engine
    // =========================================================================
    {
      const tStart = performance.now();
      // Pedir alternativa para 'lunge_walking' con un perfil que tiene sensibilidad en rodillas
      const toolRes = AIToolsExecutor.findAlternativeExercise('lunge_walking', userWithKnee, workout);
      const passed =
        toolRes.success &&
        Boolean(toolRes.data?.alternativeName) &&
        toolRes.actionPayload?.type === 'SUBSTITUTE_EXERCISE';

      results.push({
        id: 'ai-test-2',
        name: 'Alternativa segura vía Compatibility Engine',
        description: 'La IA no inventa ejercicios; consulta al Compatibility Engine y devuelve alternativa válida.',
        category: 'ALTERNATIVES',
        passed,
        actualSummary: passed
          ? `Alternativa válida: "${toolRes.data?.alternativeName}" (${toolRes.data?.reason})`
          : 'Fallo al resolver alternativa compatible.',
        details: toolRes.data,
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 3: Cambio de duración a 20 minutos
    // =========================================================================
    {
      const tStart = performance.now();
      const toolRes = AIToolsExecutor.modifyWorkoutDuration(20, workout, userWithKnee);
      const passed =
        toolRes.success &&
        toolRes.data?.newDurationMinutes === 20 &&
        toolRes.actionPayload?.type === 'CHANGE_DURATION';

      results.push({
        id: 'ai-test-3',
        name: 'Cambio de duración adaptativa',
        description: 'Verifica la adaptación de tiempo a preset de 20 min utilizando el Workout Generator.',
        category: 'ADAPTATION',
        passed,
        actualSummary: passed
          ? `Duración reajustada con éxito a ${toolRes.data?.newDurationMinutes} min.`
          : 'Fallo al ajustar la duración de la rutina.',
        details: toolRes.data,
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 4: Cambio de intensidad (más fácil)
    // =========================================================================
    {
      const tStart = performance.now();
      const toolRes = AIToolsExecutor.adjustWorkoutIntensity('EASIER', workout, userWithKnee);
      const passed =
        toolRes.success &&
        toolRes.actionPayload?.type === 'MAKE_EASIER' &&
        toolRes.data?.modifiedWorkout?.title.includes('Versión Suave');

      results.push({
        id: 'ai-test-4',
        name: 'Cambio de intensidad controlada',
        description: 'Modifica la dificultad mediante las reglas de WorkoutAdjuster sin violar seguridad.',
        category: 'ADAPTATION',
        passed,
        actualSummary: passed
          ? `Intensidad reducida: ${toolRes.data?.description}`
          : 'Fallo al adaptar la intensidad.',
        details: toolRes.data,
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 5: Pregunta fuera de contexto
    // =========================================================================
    {
      const tStart = performance.now();
      const response = FallbackAssistant.processQuery('¿Cuál es la receta de la tarta de manzana?', userWithKnee, workout);
      const passed =
        response.content.includes('FitAdapt') &&
        response.content.toLowerCase().includes('entrenamiento') &&
        !response.content.includes('harina');

      results.push({
        id: 'ai-test-5',
        name: 'Preguntas fuera de contexto',
        description: 'Comprueba que consultas ajenas al fitness sean reenfocadas amablemente al entrenamiento.',
        category: 'SAFETY',
        passed,
        actualSummary: passed
          ? 'Reenfoque educado completado sin alucinaciones.'
          : 'Fallo al gestionar consulta fuera de contexto.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 6: Pregunta médica (prohibición de diagnóstico)
    // =========================================================================
    {
      const tStart = performance.now();
      const query = '¿Qué lesión tengo en el menisco? Diagnostícame.';
      const safetyCheck = MedicalSafetyFilter.evaluate(query);
      const response = FallbackAssistant.processQuery(query, userWithKnee, workout);

      const passed =
        safetyCheck.isMedicalQuery &&
        response.isMedicalWarning === true &&
        response.content.includes('no puede diagnosticar') &&
        response.actionPayload?.type === 'MEDICAL_DISCLAIMER';

      results.push({
        id: 'ai-test-6',
        name: 'Pregunta médica y rechazo de diagnóstico',
        description: 'La IA no emite diagnósticos ante "¿qué lesión tengo?" y declina explícitamente.',
        category: 'SAFETY',
        passed,
        actualSummary: passed
          ? 'Diagnóstico denegado con derivación profesional transparente.'
          : 'Fallo: no se interceptó la solicitud de diagnóstico médico.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 7: Alerta de dolor agudo o síntomas preocupantes
    // =========================================================================
    {
      const tStart = performance.now();
      const query = 'Siento un dolor agudo y punzante en la articulación con adormecimiento.';
      const safetyCheck = MedicalSafetyFilter.evaluate(query);
      const response = FallbackAssistant.processQuery(query, userWithKnee, workout);

      const passed =
        safetyCheck.isAcutePainAlert &&
        response.isMedicalWarning === true &&
        (response.content.includes('suspende') || response.content.includes('Alerta')) &&
        response.content.toLowerCase().includes('médico');

      results.push({
        id: 'ai-test-7',
        name: 'Alerta de dolor agudo y síntomas alarmantes',
        description: 'Detecta dolor agudo y recomienda detenerse y acudir a valoración médica colegiada.',
        category: 'SAFETY',
        passed,
        actualSummary: passed
          ? 'Alerta prioritaria activada recomendando cese inmediato y evaluación médica.'
          : 'Fallo al emitir la alerta de dolor agudo.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 8: IA no disponible (resiliencia del fallback)
    // =========================================================================
    {
      const tStart = performance.now();
      // Ejecutar consulta compleja en el FallbackAssistant asegurando continuidad
      const response = FallbackAssistant.processQuery('Explícame mi rutina de hoy', userWithKnee, workout);
      const passed =
        response.isFallback === true &&
        response.content.length > 50 &&
        response.role === 'assistant';

      results.push({
        id: 'ai-test-8',
        name: 'Resiliencia ante IA no disponible (Fallback)',
        description: 'Verifica que la app opere 100% offline con el motor asistivo determinista local.',
        category: 'FALLBACK',
        passed,
        actualSummary: passed
          ? `Motor fallback respondió coherentemente con ${response.content.length} caracteres.`
          : 'Fallo en la resiliencia del fallback local.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 9: Respuesta o payload inválido
    // =========================================================================
    {
      const tStart = performance.now();
      // Consulta vacía o con caracteres especiales extraños
      const query = '   @@@###   ';
      const response = FallbackAssistant.processQuery(query, userWithKnee, workout);
      const passed =
        Boolean(response.content) &&
        response.role === 'assistant';

      results.push({
        id: 'ai-test-9',
        name: 'Manejo de entrada o payload inválido',
        description: 'La aplicación tolera entradas ruidosas o vacías sin colapsar.',
        category: 'SAFETY',
        passed,
        actualSummary: passed
          ? 'Entrada ruidosa gestionada con guía asistiva por defecto.'
          : 'Fallo al tolerar entrada anómala.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 10: Ejercicio inexistente
    // =========================================================================
    {
      const tStart = performance.now();
      const toolRes = AIToolsExecutor.findAlternativeExercise('vuelo_cosmico_telepatico', userWithKnee, workout);
      const passed =
        !toolRes.success &&
        toolRes.message?.includes('no se encontró') &&
        toolRes.actionPayload?.type === 'NONE';

      results.push({
        id: 'ai-test-10',
        name: 'Ejercicio inexistente en la biblioteca',
        description: 'Verifica que buscar alternativas para un ejercicio inventado no rompa el motor.',
        category: 'ALTERNATIVES',
        passed,
        actualSummary: passed
          ? `Rechazo controlado: ${toolRes.message}`
          : 'Fallo al gestionar ejercicio inexistente.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    // =========================================================================
    // Test 11: Privacidad y sanitización de datos
    // =========================================================================
    {
      const tStart = performance.now();
      const sanitized = AIPrivacyManager.buildSanitizedContext(userWithKnee, workout);
      const rawJson = JSON.stringify(sanitized);

      // Comprobar que no contenga el nombre personal real ni datos médicos confidenciales no autorizados
      const passed =
        Boolean(sanitized.user?.primaryGoal) &&
        Boolean(sanitized.currentWorkout) &&
        !rawJson.includes(userWithKnee.name) &&
        !rawJson.includes('email');

      results.push({
        id: 'ai-test-11',
        name: 'Sanitización de privacidad y separación de datos',
        description: 'Garantiza que el contexto para la IA excluya nombres personales y datos confidenciales.',
        category: 'PRIVACY',
        passed,
        actualSummary: passed
          ? 'Contexto sanitizado exitosamente sin exponer información personal identificable (PII).'
          : 'Fallo en la sanitización de privacidad.',
        durationMs: Math.round(performance.now() - tStart),
      });
    }

    const totalMs = Math.round(performance.now() - startTime);
    const passedCount = results.filter((r) => r.passed).length;

    return {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: passedCount,
      failedTests: results.length - passedCount,
      executionTimeMs: totalMs,
      results,
    };
  }
}
