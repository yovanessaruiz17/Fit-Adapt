/**
 * FitAdapt - Adaptaciones Caseras y Sustitutos Sin Pesas
 * 
 * Permite a los usuarios que entrenan en casa sin mancuernas, barras o pesas rusas:
 * 1. Conocer sustitutos cotidianos seguros (botellas de agua, mochila con libros, garrafas, silla, toalla).
 * 2. Conocer la variante equivalente 100% peso corporal (calistenia pura sin ningún implemento).
 */

import { ExerciseEquipment, MovementType } from '../types/exercise';

export interface HomeSubstituteInfo {
  householdItem: {
    name: string;
    icon: 'bottle' | 'backpack' | 'chair' | 'towel' | 'gallon' | 'wall' | 'couch';
    weightGuidance: string;
    instructions: string;
    safetyTip: string;
  };
  zeroEquipmentBodyweight: {
    name: string;
    instructions: string;
    biomechanicalWhy: string;
    tempoTip: string;
  };
}

/**
 * Mapeo de sustituciones por ID específico de ejercicio o por patrón de movimiento
 */
export const HOME_EXERCISE_SUBSTITUTES: Record<string, HomeSubstituteInfo> = {
  // 1. Sentadillas con carga (Goblet / Mancuernas)
  'ex-strength-goblet-squat': {
    householdItem: {
      name: 'Mochila al pecho o Garrafa de agua de 5L',
      icon: 'backpack',
      weightGuidance: 'Garrafa llena = 5 kg. Mochila con 4-6 libros = 4 a 7 kg.',
      instructions: 'Abraza la mochila contra tu esternón con ambos brazos o sujeta la garrafa por el asa frente al pecho. Mantén los codos apuntando hacia abajo.',
      safetyTip: 'Mantén el torso erguido; no dejes que el peso tire de tus hombros hacia adelante.',
    },
    zeroEquipmentBodyweight: {
      name: 'Sentadilla con Pausa Isométrica (3 segundos abajo)',
      instructions: 'Baja con tu propio peso corporal y quédate congelado abajo a 90° durante 3 segundos antes de subir con fuerza.',
      biomechanicalWhy: 'Elimina el rebote elástico y multiplica la tensión muscular en cuádriceps y glúteos sin necesitar un solo gramo de peso.',
      tempoTip: '3s bajar — 3s aguantar abajo — 1s subir explosivo.',
    },
  },

  // 2. Peso Muerto Rumano con Mancuernas (RDL)
  'ex-strength-rdl-dumbbells': {
    householdItem: {
      name: 'Mochila cargada o 2 Garrafas de agua por las asas',
      icon: 'gallon',
      weightGuidance: '2 Garrafas de 5L = 10 kg (5 kg por mano) o mochila de 8 kg.',
      instructions: 'Agarra las asas de las garrafas o las correas de la mochila. Empuja las caderas hacia atrás flexionando levemente las rodillas y desliza el peso pegado a las piernas.',
      safetyTip: 'Mantén la espalda 100% plana como una tabla. Si sientes tensión en lumbares, no bajes más allá de tus rodillas.',
    },
    zeroEquipmentBodyweight: {
      name: 'Peso Muerto a Una Pierna sin Peso (Equilibrio) o Buenos Días',
      instructions: 'De pie, con manos en la nuca, apoya solo una pierna y lleva la otra estirada hacia atrás mientras tu torso baja en línea recta.',
      biomechanicalWhy: 'El trabajo unilateral (a una pierna) sobrecarga los isquiosurales y glúteos el doble sin necesidad de mancuernas, mejorando además el equilibrio del tobillo y cadera.',
      tempoTip: 'Baja en 3 segundos sintiendo el estiramiento detrás del muslo.',
    },
  },

  // 3. Peso Muerto con Pesa Rusa / Mancuerna Central
  'ex-fullbody-kb-deadlift': {
    householdItem: {
      name: 'Garrafa de 5L o Bolso resistente cargado',
      icon: 'gallon',
      weightGuidance: '5 a 8 kg.',
      instructions: 'Coloca la garrafa entre tus pies. Con la espalda recta, flexiona caderas y rodillas para agarrar el asa con ambas manos y ponte de pie contrayendo glúteos.',
      safetyTip: 'Aprieta el abdomen antes de despegar el peso del suelo.',
    },
    zeroEquipmentBodyweight: {
      name: 'Puente de Glúteos a Una Pierna en Suelo',
      instructions: 'Túmbate boca arriba con rodillas flexionadas, eleva una pierna al aire y sube la pelvis empujando con el talón de la otra pierna.',
      biomechanicalWhy: 'Aísla la extensión de cadera y glúteo mayor con carga óptima sin sobrecargar la columna vertebral.',
      tempoTip: 'Aguanta 2 segundos arriba en cada repetición.',
    },
  },

  // 4. Press Militar de Hombros con Mancuernas
  'ex-strength-seated-db-press': {
    householdItem: {
      name: '2 Botellas de agua de 1.5 L o 2 L',
      icon: 'bottle',
      weightGuidance: '1.5 L = 1.5 kg por mano / 2 L = 2 kg por mano.',
      instructions: 'Sujeta una botella en cada mano a la altura de las orejas. Empuja verticalmente hacia el techo hasta estirar los brazos sin arquear la espalda.',
      safetyTip: 'Asegúrate de que las tapas estén bien enroscadas y no dejes caer las botellas al terminar.',
    },
    zeroEquipmentBodyweight: {
      name: 'Flexiones en Pica (Pike Push-ups) en Suelo',
      instructions: 'Colócate en posición de flexión pero eleva tus caderas al techo formando una "V" invertida con tu cuerpo. Flexiona los codos bajando la coronilla hacia el suelo.',
      biomechanicalWhy: 'Transfiere el peso de tu torso directamente sobre los deltoides (hombros), simulando el press vertical sin requerir ningún equipamiento.',
      tempoTip: 'Baja despacio y empuja el suelo con las palmas extendidas.',
    },
  },

  // 5. Press de Pecho Plano con Mancuernas
  'ex-strength-db-floor-press': {
    householdItem: {
      name: '2 Botellas grandes de agua o 2 Paquetes de comida (arroz/legumbres)',
      icon: 'bottle',
      weightGuidance: '1.5 a 2.5 kg por mano.',
      instructions: 'Túmbate en el suelo boca arriba con rodillas dobladas. Empuja las botellas hacia arriba juntándolas sobre el pecho sin golpear los codos contra el piso.',
      safetyTip: 'Apoya bien la zona lumbar en la colchoneta o alfombra.',
    },
    zeroEquipmentBodyweight: {
      name: 'Flexiones en Suelo (o Inclinadas en Mesa/Pared)',
      instructions: 'Coloca las manos a la anchura de hombros, mantén el cuerpo recto como una tabla y baja el pecho hasta 5 cm del suelo.',
      biomechanicalWhy: 'Las flexiones reclutan exactamente los mismos músculos pectorales y tríceps que el press con mancuernas, movilizando entre el 60% y 70% de tu peso corporal.',
      tempoTip: 'Si te cuesta, apoya las manos en el borde de una mesa firme o en la pared.',
    },
  },

  // 6. Remo Unilateral con Mancuerna en Banco
  'ex-strength-dumbbell-row': {
    householdItem: {
      name: 'Garrafa de agua de 5L con asa o Mochila con libros',
      icon: 'gallon',
      weightGuidance: 'Garrafa = 5 kg / Mochila = 5 a 8 kg.',
      instructions: 'Apoya una mano y una rodilla en una silla resistente o en el borde del sofá. Con la otra mano, jala la garrafa hacia la cadera llevando el codo hacia atrás.',
      safetyTip: 'No gires el torso; mantén los hombros paralelos al suelo durante todo el movimiento.',
    },
    zeroEquipmentBodyweight: {
      name: 'Remo con Toalla en Puerta o Puente de Escápulas en Suelo',
      instructions: 'Pasa una toalla alrededor del pomo de una puerta sólida o marco firme. Inclínate hacia atrás con los brazos extendidos y jala de la toalla juntando los omóplatos.',
      biomechanicalWhy: 'Permite trabajar los dorsales y la espalda alta aprovechando la resistencia de tu peso corporal y la tracción isométrica.',
      tempoTip: 'Aprieta la espalda 2 segundos al final de la tracción.',
    },
  },

  // 7. Thruster con Mancuernas (Sentadilla + Press)
  'ex-fullbody-db-thruster': {
    householdItem: {
      name: '2 Botellas de agua de 1.5L o Mochila abrazada al pecho',
      icon: 'bottle',
      weightGuidance: '3 kg total (botellas) o 5 kg (mochila).',
      instructions: 'Sostén las botellas a la altura de los hombros. Haz una sentadilla completa y, al impulsarte hacia arriba, extiende los brazos hacia el techo en un movimiento fluido.',
      safetyTip: 'Usa el impulso de las piernas para elevar el peso; no separes los talones del suelo.',
    },
    zeroEquipmentBodyweight: {
      name: 'Sentadilla Rítmica con Elevación Rápida de Brazos',
      instructions: 'Haz la sentadilla y sube con potencia estirando los brazos al cielo como si lanzaras una pelota imaginaria, apretando glúteos arriba.',
      biomechanicalWhy: 'Conserva la misma demanda cardiovascular y de coordinación cuerpo completo sin riesgo de sobrecarga en muñecas u hombros.',
      tempoTip: 'Cadencia constante y respiración sincronizada.',
    },
  },

  // 8. Farmer's Walk (Paseo del Granjero) con Mancuernas
  'ex-fullbody-farmers-walk': {
    householdItem: {
      name: '2 Garrafas de 5L o 2 Bolsas de compra equilibradas',
      icon: 'gallon',
      weightGuidance: '5 kg en cada mano.',
      instructions: 'Sujeta una garrafa en cada mano a los costados. Camina con paso firme y torso recto por el pasillo o sala durante el tiempo asignado.',
      safetyTip: 'No te inclines hacia ningún lado; mantén los hombros atrás y el abdomen duro.',
    },
    zeroEquipmentBodyweight: {
      name: 'Marcha Militar en el Sitio con Brazos en Tensión',
      instructions: 'Marcha en el sitio elevando rodillas a 90° con los puños cerrados apretando activamente todo el cuerpo como una estatua móvil.',
      biomechanicalWhy: 'Exige la misma estabilidad postural del core y equilibrio de tobillos y cadera.',
      tempoTip: 'Mantén la mirada al frente y la espalda bien erguida.',
    },
  },

  // 9. Curl de Bíceps Alterno con Mancuernas
  'ex-strength-bicep-curl-db': {
    householdItem: {
      name: '2 Botellas de agua de 1L a 1.5L',
      icon: 'bottle',
      weightGuidance: '1 a 1.5 kg por mano.',
      instructions: 'De pie con codos pegados a los costados, flexiona el codo levantando la botella hacia el hombro girando la palma hacia arriba.',
      safetyTip: 'No balancees el cuerpo hacia atrás para levantar el peso.',
    },
    zeroEquipmentBodyweight: {
      name: 'Curl Isométrico con Toalla (Bajo el pie)',
      instructions: 'Pisa el centro de una toalla larga con un pie. Sujeta los dos extremos con las manos flexionando los codos a 90° y jala hacia arriba con fuerza durante 5 segundos.',
      biomechanicalWhy: 'La contracción isométrica máxima contra un objeto inamovible activa el 100% de las fibras del bíceps sin necesitar pesas.',
      tempoTip: 'Contracción de 5 segundos de esfuerzo máximo por repetición.',
    },
  },

  // 10. Patada de Tríceps con Mancuerna
  'ex-strength-triceps-kickback': {
    householdItem: {
      name: '1 Botella de agua de 1L o paquete de 1 kg',
      icon: 'bottle',
      weightGuidance: '1 kg a 1.5 kg.',
      instructions: 'Con el torso inclinado a 45° y el codo pegado a la costilla, extiende el antebrazo hacia atrás apretando la parte posterior del brazo.',
      safetyTip: 'El codo debe actuar como una bisagra fija; no lo bajes ni lo subas.',
    },
    zeroEquipmentBodyweight: {
      name: 'Fondos de Tríceps en Silla Firme o Borde de Cama',
      instructions: 'Apoya las palmas en el borde de una silla estable con las piernas flexionadas al frente. Baja flexionando los codos hacia atrás y empuja hacia arriba.',
      biomechanicalWhy: 'Es el ejercicio de peso corporal más efectivo para los tríceps, ajustable simplemente acercando o alejando los pies.',
      tempoTip: 'Codos pegados y apuntando hacia atrás, nunca hacia los lados.',
    },
  },

  // 11. Buenos Días con Banda Elástica
  'ex-strength-band-good-morning': {
    householdItem: {
      name: 'Palo de escoba o Toalla estirada tras la nuca',
      icon: 'towel',
      weightGuidance: '0 kg (Puro control postural).',
      instructions: 'Sujeta el palo o toalla tensa sobre tus hombros tras la nuca. Flexiona las caderas hacia atrás manteniendo la espalda recta hasta sentir tensión en los isquiotibiales.',
      safetyTip: 'No dobles la columna; el movimiento nace 100% de la bisagra de cadera.',
    },
    zeroEquipmentBodyweight: {
      name: 'Buenos Días con Manos en la Nuca',
      instructions: 'Coloca las manos en la nuca con codos bien abiertos. Lleva las caderas hacia atrás flexionando suavemente las rodillas y regresa apretando glúteos.',
      biomechanicalWhy: 'Fortalece los erectores espinales y la cadena posterior aprendiendo el patrón de bisagra de cadera seguro.',
      tempoTip: 'Baja en 3 segundos sintiendo el estiramiento y sube en 1.',
    },
  },

  // 12. Press Pallof con Banda Elástica
  'ex-toning-pallof-press': {
    householdItem: {
      name: 'Toalla anclada en picaporte de puerta o Medias/Leggings elásticos',
      icon: 'towel',
      weightGuidance: 'Resistencia elástica o isométrica.',
      instructions: 'Pasa la toalla o prenda elástica alrededor de una manija sólida de puerta cerrada. Sujétala con ambas manos a la altura del pecho y empuja hacia el frente resistiendo la rotación.',
      safetyTip: 'Asegúrate de que la puerta esté completamente cerrada y trabada.',
    },
    zeroEquipmentBodyweight: {
      name: 'Plancha Lateral de Antebrazo en Suelo',
      instructions: 'Apóyate de lado sobre tu antebrazo y los laterales de tus pies o rodillas, elevando la cadera en línea recta.',
      biomechanicalWhy: 'Activa los oblicuos y el transverso abdominal como estabilizadores antirrotación con la gravedad como resistencia.',
      tempoTip: 'Mantén la cadera alta sin dejarla caer hacia el suelo.',
    },
  },
};

/**
 * Sustituto casero por defecto según el patrón de movimiento
 * si el ejercicio no tiene un mapeo individual explícito
 */
export function getHomeSubstituteForExercise(
  exerciseId: string,
  movementType?: MovementType,
  requiredEquipment?: ExerciseEquipment[]
): HomeSubstituteInfo {
  // 1. Coincidencia directa por ID
  if (HOME_EXERCISE_SUBSTITUTES[exerciseId]) {
    return HOME_EXERCISE_SUBSTITUTES[exerciseId];
  }

  // 2. Coincidencia por patrón de movimiento si requiere pesas/equipamiento
  switch (movementType) {
    case MovementType.SQUAT:
      return {
        householdItem: {
          name: 'Mochila al pecho con libros o 2 botellas de agua',
          icon: 'backpack',
          weightGuidance: 'Ajusta el peso metiendo 3-5 libros (3 a 6 kg).',
          instructions: 'Abraza la mochila contra tu pecho. Mantén la espalda recta y baja empujando las caderas hacia atrás.',
          safetyTip: 'Mantén los talones bien apoyados en el suelo.',
        },
        zeroEquipmentBodyweight: {
          name: 'Sentadilla con Tempo Lento (3 segundos bajada)',
          instructions: 'Baja en 3 segundos lentos, aguanta 1 segundo abajo y sube controlando el movimiento.',
          biomechanicalWhy: 'Aumenta el tiempo bajo tensión muscular simulando el efecto de una carga externa sin peso.',
          tempoTip: '3 segundos al bajar, 1 segundo abajo, 1 segundo al subir.',
        },
      };

    case MovementType.HINGE:
      return {
        householdItem: {
          name: 'Mochila o Garrafa de agua de 5L',
          icon: 'gallon',
          weightGuidance: '4 a 6 kg.',
          instructions: 'Sostén la mochila o garrafa con los brazos relajados y empuja las caderas hacia atrás flexionando levemente las rodillas.',
          safetyTip: 'No arquees la zona lumbar en ningún momento.',
        },
        zeroEquipmentBodyweight: {
          name: 'Puente de Glúteos en Suelo (o a Una Pierna)',
          instructions: 'Túmbate boca arriba y eleva la cadera contrayendo los glúteos con fuerza en la parte más alta.',
          biomechanicalWhy: 'Trabaja glúteos e isquiotibiales con total seguridad para tu columna.',
          tempoTip: 'Aguanta 2 segundos arriba apretando los glúteos.',
        },
      };

    case MovementType.PUSH_VERTICAL:
      return {
        householdItem: {
          name: '2 Botellas de agua de 1.5L',
          icon: 'bottle',
          weightGuidance: '1.5 kg por mano.',
          instructions: 'Sostén una botella en cada mano junto a las orejas y empuja hacia el techo con los brazos estirados.',
          safetyTip: 'No eches la cabeza hacia atrás ni curves la espalda.',
        },
        zeroEquipmentBodyweight: {
          name: 'Flexión en Pica (Pike Push-up) en Suelo o Pared',
          instructions: 'Eleva la cadera en V invertida y flexiona los codos llevando la cabeza hacia el suelo para cargar los hombros.',
          biomechanicalWhy: 'Dirige el peso del tren superior a los deltoides sin requerir mancuernas.',
          tempoTip: 'Mantén las piernas rectas o ligeramente flexionadas.',
        },
      };

    case MovementType.PULL_HORIZONTAL:
    case MovementType.PULL_VERTICAL:
      return {
        householdItem: {
          name: 'Mochila cargada o Toalla anclada en una puerta',
          icon: 'backpack',
          weightGuidance: '4 a 6 kg.',
          instructions: 'Inclina el torso hacia adelante apoyando una mano en una silla, y jala la mochila con la otra llevando el codo a la cintura.',
          safetyTip: 'Mantén los hombros lejos de las orejas.',
        },
        zeroEquipmentBodyweight: {
          name: 'Puente Escapular en Suelo (Tracción con omóplatos)',
          instructions: 'Tumbado boca arriba con codos apoyados a los lados a 90°, presiona los codos contra el piso elevando el pecho 5 cm del suelo.',
          biomechanicalWhy: 'Activa intensamente la musculatura interescapular y los dorsales con contracción isométrica pura.',
          tempoTip: 'Mantén la contracción 3 segundos arriba en cada repetición.',
        },
      };

    case MovementType.PUSH_HORIZONTAL:
      return {
        householdItem: {
          name: 'Borde de una mesa firme o Silla apoyada en la pared',
          icon: 'chair',
          weightGuidance: 'Peso de tu propio cuerpo inclinado.',
          instructions: 'Apoya las manos en el borde de la silla o mesa para hacer flexiones inclinadas si el suelo te resulta muy pesado.',
          safetyTip: 'Asegúrate de que la silla o mesa no deslice.',
        },
        zeroEquipmentBodyweight: {
          name: 'Flexiones Estándar en Suelo o con Rodillas',
          instructions: 'Baja el pecho hasta casi tocar el piso manteniendo el abdomen apretado como una plancha.',
          biomechanicalWhy: 'Es el patrón de empuje rey con peso corporal.',
          tempoTip: 'Codos a 45 grados del cuerpo, nunca abiertos a 90 grados.',
        },
      };

    default:
      return {
        householdItem: {
          name: '2 Botellas de agua o Mochila ligera',
          icon: 'bottle',
          weightGuidance: '1.5 a 3 kg.',
          instructions: 'Usa botellas de agua o una mochila cómoda para añadir una ligera resistencia al movimiento.',
          safetyTip: 'Comprueba el agarre antes de iniciar la serie.',
        },
        zeroEquipmentBodyweight: {
          name: 'Versión con Peso Corporal y Mayor Control de Tempo',
          instructions: 'Realiza el movimiento de forma lenta y deliberada, apretando el músculo diana en cada fase.',
          biomechanicalWhy: 'El control neuromuscular compensa la falta de carga externa.',
          tempoTip: 'Movimiento fluido sin tirones.',
        },
      };
  }
}
