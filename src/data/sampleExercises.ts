/**
 * FitAdapt - Semilla y Acceso a la Biblioteca de Ejercicios
 * FASE 4: Biblioteca de Ejercicios Estructurada
 * 
 * Re-exporta la biblioteca estructurada completa de FitAdapt asegurando
 * compatibilidad total con el Verificador de Compatibilidad y los componentes
 * desarrollados en las fases anteriores.
 */

import { EXERCISE_LIBRARY } from './exerciseLibrary';
import { Exercise } from '../types/exercise';

export const SAMPLE_EXERCISES: Exercise[] = EXERCISE_LIBRARY;

export default SAMPLE_EXERCISES;
