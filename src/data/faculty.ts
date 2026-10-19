// Faculty de SimAcademy. Semblanzas resumidas de los CV que entregó cada
// docente (carpeta «SimAcademy/Docentes», oct-2026). Formato fijo: formación
// → cargo actual → credenciales en simulación → tema distintivo. Nada de datos
// de contacto ni personales: sólo trayectoria profesional.
//
// `programas` sale del nombre de la carpeta (EuSim 1, EuSim 1 y 2, Actriz).
// Quien aún no manda foto queda con `photo: null` y se muestran sus iniciales.

export type Pais = 'México' | 'Argentina' | 'Chile';

export interface Docente {
  name: string;
  pais: Pais;
  programas: string[];
  headline: string;
  bio: string;
  photo: string | null;
}

export const faculty: Docente[] = [
  // ── Faculty EuSim Nivel 1 y 2 ──────────────────────────────────────────
  {
    name: 'Diego Vinciguerra',
    pais: 'Argentina',
    programas: ['EuSim 1', 'EuSim 2'],
    headline: 'Pediatra intensivista · Seguridad del paciente',
    bio:
      'Médico pediatra especialista en cuidados intensivos pediátricos y Magíster en Políticas Públicas. Dirige el Centro de Simulación Clínica de la Fundación Barceló y es jefe de Terapia Intensiva Pediátrica del Hospital Durand. Instructor EuSim e instructor de Factores Humanos (ANAC). Su eje: seguridad del paciente, factores humanos y seguridad psicológica.',
    photo: 'diego-vinciguerra',
  },
  {
    name: 'Dolores Latugaye',
    pais: 'Argentina',
    programas: ['EuSim 1', 'EuSim 2'],
    headline: 'Enfermería · Dirección de centros de simulación',
    bio:
      'Licenciada en Enfermería y Magíster en Educación, con doctorado en Ciencias Biomédicas en etapa de defensa. Dirige el Centro de Simulación «Ciro L. Echesortu» de la Universidad Austral, cuya Escuela de Enfermería encabezó de 2015 a 2026. Instructora EuSim, formada en el Hospital Virtual Valdecilla y en estándares INACSL. Su eje: simulación en la enseñanza de la enfermería.',
    photo: 'dolores-latugaye',
  },
  {
    name: 'Héctor Navarrini',
    pais: 'Argentina',
    programas: ['EuSim 1', 'EuSim 2'],
    headline: 'Anestesiólogo · Formación de instructores',
    bio:
      'Médico especialista en Anestesiología, con diplomatura en Educación para Profesionales de la Salud (Universidad Nacional de Cuyo). Dirigió el Centro de Simulación de la Asociación Mendocina de Anestesiología y creó el curso de instructores de simulación de la FAAAAR. Educador EuSim. Su eje: anestesia cardiovascular, neonatal y pediátrica llevada al escenario simulado.',
    photo: 'hector-navarrini',
  },

  {
    name: 'Carolina Astoul',
    pais: 'Argentina',
    programas: ['EuSim 1', 'EuSim 2'],
    headline: 'Enfermería · Juicio clínico',
    bio:
      'Licenciada en Enfermería con trayectoria en cuidados críticos pediátricos de alta complejidad. Subdirectora del Centro de Simulación Clínica de la Universidad Austral, doctoranda en Ciencias Biomédicas y Máster en Educación para Profesionales de la Salud (Universidad de Barcelona). Instructora EuSim de Nivel 1 y 2. Su eje: la enseñanza del juicio clínico.',
    photo: 'carolina-astoul',
  },

  // ── Faculty EuSim Nivel 1 ──────────────────────────────────────────────
  {
    name: 'Angélica García Gómez',
    pais: 'México',
    programas: ['EuSim 1'],
    headline: 'Médica · Evaluación y ECOE',
    bio:
      'Médica cirujana por la UNAM, Máster en Educación de Profesionales de la Salud (Universidad de Barcelona) y especialista en Alta Dirección. Formada como instructora EuSim de Nivel 1 y 2, y como formadora de instructores. Su eje: evaluación educativa, psicometría y exámenes clínicos objetivos estructurados (ECOE).',
    photo: 'angelica-garcia',
  },
  {
    name: 'Hugo Olvera',
    pais: 'México',
    programas: ['EuSim 1'],
    headline: 'Médico · Gestión de centros de simulación',
    bio:
      'Médico cirujano por la UNAM, Maestro en Educación Basada en Competencias, con doctorado en Educación y posgrado en Simulación Clínica y Seguridad del Paciente (Universidad de Barcelona). Jefe del Departamento de Integración de Ciencias Médicas de la Facultad de Medicina de la UNAM; coordinó el centro de simulación del CECAM. Certificado CHSE por la Society for Simulation in Healthcare. Su eje: telesimulación y operación de centros.',
    photo: 'hugo-olvera',
  },
  {
    name: 'Josefina Serrano',
    pais: 'México',
    programas: ['EuSim 1'],
    headline: 'Médica de urgencias · Debriefing y ECOE',
    bio:
      'Médica cirujana por la UNAM, especialista en Administración Gerontológica, con maestría en Medicina de Urgencias en curso. Médica de urgencias en el Hospital General Ajusco Medio; fue jefa de simulación clínica de la Universidad La Salle. Faculty EuSim e instructora AHA. Coordina el Comité de Vinculación de RENASIM. Su eje: debriefing educativo y evaluación por competencias.',
    photo: 'josefina-serrano',
  },
  {
    name: 'Magdalena Sierra',
    pais: 'México',
    programas: ['EuSim 1'],
    headline: 'Enfermería cardiológica · Realidad virtual',
    bio:
      'Licenciada en Enfermería y Obstetricia, especialista en Enfermería Infantil y Maestra en Educación Basada en Competencias. Coordina el Centro de Aprendizaje por Simulación de la Escuela de Enfermería del Instituto Nacional de Cardiología. Educadora EuSim 1 y 2 y Faculty EuSim. Su eje: simulación con realidad virtual para el aprendizaje transformacional en enfermería.',
    photo: 'magdalena-sierra',
  },
  {
    name: 'Celina Hajdinjak',
    pais: 'Argentina',
    programas: ['EuSim 1'],
    headline: 'Pediatra intensivista',
    bio:
      'Médica pediatra especialista en Terapia Intensiva Pediátrica, formada en el Hospital Garrahan. Coordinadora académica del Centro de Simulación de la Fundación Barceló y médica de planta de Terapia Intensiva Pediátrica del Hospital Durand. Faculty EuSim desde 2025. Su eje: el paciente pediátrico crítico.',
    photo: 'celina-hajdinjak',
  },
  {
    name: 'Marlova Silva',
    pais: 'Chile',
    programas: ['EuSim 1'],
    headline: 'Enfermera matrona · Paciente estandarizado',
    bio:
      'Enfermera matrona y Magíster en Educación Médica por la Pontificia Universidad Católica de Chile. Directora ejecutiva de SI Academia; ha diseñado e implementado centros y hospitales simulados en Chile, Costa Rica, Perú y Panamá. Certificada CHSE, instructora del Center for Medical Simulation (Harvard) y Faculty EuSim. Su eje: paciente estandarizado y diseño de centros de simulación.',
    photo: 'marlova-silva',
  },

  // ── Docentes SimAcademy ────────────────────────────────────────────────
  {
    name: 'Carolina Bejarano',
    pais: 'México',
    programas: [],
    headline: 'Médica · Innovación educativa y acreditación',
    bio:
      'Médica cirujana y partera por el Instituto Politécnico Nacional, con diplomado en Educación para Profesionales de la Salud. Fue jefa de Innovación Educativa de la Escuela Nacional de Medicina y Homeopatía (IPN) y es evaluadora de COMAEM en procesos nacionales e internacionales. Su eje: diseño curricular, calidad educativa y enseñanza basada en simulación.',
    photo: 'carolina-bejarano',
  },
  {
    name: 'Rodrigo Rubio',
    pais: 'México',
    programas: [],
    headline: 'Anestesiólogo · Manejo de crisis y factor humano',
    bio:
      'Médico anestesiólogo por el Hospital ABC/UNAM, con fellowship en Simulación Clínica (Western University, Canadá) y Diplomado en Alta Dirección (IPADE). Dirige el Centro de Desarrollo del Centro Médico ABC y es faculty del Center for Medical Simulation (Harvard). Expresidente de FLASIC y vicepresidente del Comité de Educación de la WFSA. Su eje: crisis en quirófano, vía aérea difícil y factor humano.',
    photo: 'rodrigo-rubio',
  },
  {
    name: 'Sara Morales López',
    pais: 'México',
    programas: [],
    headline: 'Médica · Educación médica y acreditación',
    bio:
      'Médica cirujana por la UNAM, especialista en docencia y Maestra en Educación. En la Facultad de Medicina de la UNAM ha encabezado la Secretaría de Enseñanza Clínica, la investigación en educación médica y el CECAM. Miembro fundador de RENASIM y de FLASIC, donde es responsable de la Comisión de Acreditación de Centros de Simulación.',
    photo: 'sara-morales',
  },

  // ── Pacientes simulados ────────────────────────────────────────────────
  {
    name: 'Verónica Toro Torres',
    pais: 'Chile',
    programas: ['Paciente simulado'],
    headline: 'Actriz · Directora de HumanizArte en Salud',
    bio:
      'Actriz e instructora en simulación clínica. Dirige HumanizArte en Salud, centro de formación y gestión de pacientes simulados, en el cruce entre las artes vivas y la educación en salud. Coordina la formación escénica del programa de Actores de SimAcademy. Su eje: la mirada humanizada del paciente simulado.',
    photo: 'veronica-toro',
  },
  {
    name: 'Ximena Gajardo',
    pais: 'Chile',
    programas: ['Paciente simulado'],
    headline: 'Actriz · Formación de pacientes simulados',
    bio:
      'Actriz titulada del Col·legi de Teatre de Barcelona e instructora en simulación en salud. Integra HumanizArte y suma más de 11 años formando equipos de pacientes simulados en universidades chilenas. Su eje: feedback asertivo, comunicación y moulage.',
    photo: 'ximena-gajardo',
  },
];
