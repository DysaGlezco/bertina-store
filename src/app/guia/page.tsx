import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "¿Cuál es para mí?",
  description: "Descubre qué tipo de cuaderno se adapta mejor a tu estilo de vida. Guía completa de journals, planners, agendas y más.",
};

/* ─── Tipos y grupos ───────────────────────────────────────────────── */

interface TipoCuaderno {
  nombre: string;
  beneficios: string;
  paraQuien: string;
  cuando: string;
  queEncontraras: string;
  catalogoHref: string;
}

interface Grupo {
  etiqueta: string;
  descripcion: string;
  tipos: TipoCuaderno[];
}

const GRUPOS: Grupo[] = [
  {
    etiqueta: "Organización & Productividad",
    descripcion: "Para quienes quieren dominar su tiempo y ver resultados claros.",
    tipos: [
      {
        nombre: "Planner diario",
        beneficios: "Reduce la ansiedad de tener todo en la cabeza, aumenta la productividad y ayuda a priorizar lo que realmente importa.",
        paraQuien: "Quien tiene múltiples responsabilidades y necesita estructurar su día con claridad.",
        cuando: "Cada mañana antes de empezar el día, y cada noche para revisar lo logrado.",
        queEncontraras: "Intención del día, bloques horarios, lista de tareas por prioridad, espacio para notas y reflexión nocturna.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Agenda anual",
        beneficios: "Visión clara del año completo, facilita la planificación a largo plazo y evita olvidar fechas importantes.",
        paraQuien: "Quien piensa en meses y años, no solo en días — emprendedoras, estudiantes, personas con proyectos a largo plazo.",
        cuando: "Al inicio del año para establecer el marco, y mensualmente para revisar y ajustar.",
        queEncontraras: "Vista anual de un vistazo, páginas mensuales, metas por trimestre y sección de reflexión de cierre de año.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Productividad",
        beneficios: "Maximiza el tiempo disponible, reduce la procrastinación y hace visible el progreso real.",
        paraQuien: "Quien quiere ir más allá de las listas de tareas y construir sistemas de trabajo que funcionen de verdad.",
        cuando: "Cada domingo para planificar la semana, cada día para ejecutar y registrar avances.",
        queEncontraras: "Planificación semanal, tracker de hábitos, espacio para reflexión de resultados y seguimiento de proyectos.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Bullet Journal",
        beneficios: "Sistema completamente personalizable que combina agenda, diario y tracker en uno; desarrolla la creatividad y el autoconocimiento.",
        paraQuien: "Quien quiere un sistema diseñado exactamente para su vida, sin moldes fijos.",
        cuando: "Al inicio de cada mes para diseñar las páginas, y diariamente para registrar y planificar.",
        queEncontraras: "Páginas dot grid, índice, tracker de hábitos, log diario y espacio libre para crear tu propio sistema.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
    ],
  },
  {
    etiqueta: "Reflexión & Bienestar",
    descripcion: "Para quienes buscan un espacio propio donde conocerse mejor y vivir con más consciencia.",
    tipos: [
      {
        nombre: "Journal",
        beneficios: "Libera la mente, reduce el estrés, ayuda a procesar emociones y mejora la autoconciencia.",
        paraQuien: "Quien quiere un espacio libre sin reglas, donde la única voz que importa es la propia.",
        cuando: "Cada mañana para arrancar con claridad, o cada noche para soltar lo que cargaste durante el día.",
        queEncontraras: "Páginas lisas o punteadas, espacio para fecha y estado de ánimo, prompts opcionales para quien no sabe por dónde empezar.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Cuaderno de gratitud",
        beneficios: "Cambia el foco hacia lo positivo, mejora el bienestar emocional y reduce la ansiedad con el tiempo.",
        paraQuien: "Quien quiere desarrollar una mentalidad más positiva y vivir con mayor consciencia.",
        cuando: "Cada noche antes de dormir como ritual de cierre, o cada mañana como primer pensamiento del día.",
        queEncontraras: "Espacio diario para tres gratitudes, momentos destacados de la semana, reflexiones mensuales y prompts guiados.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Manifestación",
        beneficios: "Clarifica lo que realmente deseas, refuerza la intención y conecta con tus metas desde un lugar positivo.",
        paraQuien: "Quien trabaja con intención y visualización, o simplemente quiere tener claridad sobre lo que quiere construir.",
        cuando: "Como ritual matutino de diez minutos, o cuando necesitas reconectar con tus metas.",
        queEncontraras: "Afirmaciones diarias, visualización de metas, páginas de intención mensual y espacio para registrar señales y avances.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
    ],
  },
  {
    etiqueta: "Finanzas & Salud",
    descripcion: "Para quienes quieren llevar su cuerpo y sus recursos con más intención.",
    tipos: [
      {
        nombre: "Cuaderno de finanzas",
        beneficios: "Genera conciencia sobre los hábitos de gasto, facilita el ahorro y reduce la ansiedad financiera.",
        paraQuien: "Quien quiere retomar el control de su dinero de forma simple, sin apps ni hojas de cálculo.",
        cuando: "Semanalmente para registrar movimientos, mensualmente para revisar el balance.",
        queEncontraras: "Registro de ingresos y gastos, tracker de ahorro, metas financieras y resumen mensual y anual.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Nutrición",
        beneficios: "Genera conciencia sobre lo que comes sin obsesión, ayuda a identificar patrones y apoya tus objetivos de salud.",
        paraQuien: "Quien quiere llevar una relación más consciente y amable con la alimentación.",
        cuando: "Antes de cada comida para planificar, o al final del día para registrar cómo te sentiste.",
        queEncontraras: "Registro diario de comidas, nivel de hidratación, espacio para anotar cómo te sientes y metas semanales.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Fitness",
        beneficios: "Hace visible el progreso físico, aumenta la motivación y ayuda a mantener la constancia.",
        paraQuien: "Quien entrena con intención y quiere ver su evolución reflejada en papel, no solo en el espejo.",
        cuando: "Antes de entrenar para planificar la rutina, después para registrar series, repeticiones y sensaciones.",
        queEncontraras: "Registro de entrenamientos por día, tracker de progreso físico, espacio para metas y registro de descanso y recuperación.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
    ],
  },
  {
    etiqueta: "Momentos especiales",
    descripcion: "Para guardar lo que no debería olvidarse jamás.",
    tipos: [
      {
        nombre: "Cuaderno de embarazo",
        beneficios: "Preserva momentos únicos e irrepetibles y ayuda a procesar las emociones de este proceso tan especial.",
        paraQuien: "Mamás en espera que quieren guardar cada semana de este camino.",
        cuando: "Semanalmente para registrar cambios y emociones, y siempre que quieras capturar un momento especial.",
        queEncontraras: "Seguimiento semana a semana, espacio para síntomas, emociones y antojos, páginas para la primera ecografía y carta para el bebé.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Diario de viaje",
        beneficios: "Preserva recuerdos con más detalle que las fotos y convierte cada viaje en una historia propia.",
        paraQuien: "Viajeras que quieren guardar la esencia de cada destino — no solo las fotos, sino cómo se sintió estar ahí.",
        cuando: "Durante el viaje para capturar momentos al instante, o cada noche del viaje como ritual de cierre.",
        queEncontraras: "Páginas por día de viaje, espacio para itinerario, personas conocidas, experiencias memorables y páginas para pegar entradas o pequeños recuerdos.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
    ],
  },
  {
    etiqueta: "Pasiones & Hobbies",
    descripcion: "Para quienes tienen un amor particular y quieren dedicarle un espacio propio.",
    tipos: [
      {
        nombre: "Diario de lectura",
        beneficios: "Retiene mejor lo leído, ayuda a elegir próximas lecturas y construye un registro personal de crecimiento.",
        paraQuien: "Lectoras que quieren ir más allá de leer y realmente conectar con los libros.",
        cuando: "Mientras lees para capturar frases, y al terminar cada libro para reflexionar sobre lo que te dejó.",
        queEncontraras: "Ficha por libro con título, autor, fecha y valoración, espacio para frases favoritas, reflexiones personales y lista de próximas lecturas.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
      {
        nombre: "Cuaderno de recetas",
        beneficios: "Reúne tus recetas favoritas en un solo lugar y rescata recetas familiares antes de que se pierdan con el tiempo.",
        paraQuien: "Amantes de la cocina que quieren guardar sus creaciones y las recetas heredadas en un lugar bonito.",
        cuando: "Cada vez que pruebas una receta que merece guardarse, o para rescatar recetas de familia.",
        queEncontraras: "Secciones por tipo de plato, ficha de receta con ingredientes, pasos y notas personales, espacio para fotos del resultado.",
        catalogoHref: "/catalogo?category=cuadernos",
      },
    ],
  },
];

/* ─── Componente tarjeta ────────────────────────────────────────────── */

function TipoCard({ tipo }: { tipo: TipoCuaderno }) {
  return (
    <div className="bg-white border border-cream-deep rounded-sm p-8 flex flex-col gap-6 hover:border-gold/40 hover:shadow-sm transition-all duration-300">
      <div>
        <h3 className="font-serif text-2xl text-ink">{tipo.nombre}</h3>
        <div className="w-8 h-px bg-gold mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        <div className="space-y-1">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">Beneficios</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed">{tipo.beneficios}</p>
        </div>
        <div className="space-y-1">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">Para quién</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed">{tipo.paraQuien}</p>
        </div>
        <div className="space-y-1">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">Cuándo usarlo</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed">{tipo.cuando}</p>
        </div>
        <div className="space-y-1">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">Qué encontrarás</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed">{tipo.queEncontraras}</p>
        </div>
      </div>

      <Link
        href={tipo.catalogoHref}
        className="self-start font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-px hover:border-gold transition-colors duration-200"
      >
        Ver en catálogo →
      </Link>
    </div>
  );
}

/* ─── Página ────────────────────────────────────────────────────────── */

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Catálogo", href: "/catalogo" }, { label: "¿Cuál es para mí?" }]} />
          </div>
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-6">Guía de cuadernos</p>
          <h1 className="font-serif text-display-lg text-ink leading-tight max-w-xl">
            ¿Cuál es<br />
            <em className="text-sage not-italic">para mí?</em>
          </h1>
          <div className="w-12 h-px bg-gold mt-8 mb-6" />
          <p className="font-sans text-base text-warmgray leading-relaxed max-w-lg">
            No todos los cuadernos son iguales — ni tú eres igual a nadie. Esta guía está pensada para ayudarte a encontrar el que realmente necesitas.
          </p>
        </div>
      </section>

      {/* Grupos */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-20">
          {GRUPOS.map((grupo) => (
            <div key={grupo.etiqueta}>
              {/* Encabezado de grupo */}
              <div className="flex items-center gap-4 mb-10">
                <div className="hidden sm:block flex-1 h-px bg-cream-deep" />
                <div className="text-center min-w-0">
                  <p className="font-sans text-xs tracking-wide sm:tracking-[0.3em] uppercase text-warmgray">{grupo.etiqueta}</p>
                  <p className="font-sans text-sm text-warmgray/70 mt-1">{grupo.descripcion}</p>
                </div>
                <div className="hidden sm:block flex-1 h-px bg-cream-deep" />
              </div>

              {/* Cards del grupo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {grupo.tipos.map((tipo) => (
                  <TipoCard key={tipo.nombre} tipo={tipo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-cream-warm border-t border-cream-deep">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <p className="font-serif text-2xl font-light text-ink italic">
            "¿Aún tienes dudas?"
          </p>
          <div className="w-8 h-px bg-gold mx-auto" />
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            Escríbeme por WhatsApp y te ayudo a encontrar el cuaderno perfecto para ti. Me encanta hablar de papel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/catalogo" className="btn-outline">
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/5358732088?text=Hola%2C%20me%20gustar%C3%ADa%20que%20me%20ayudes%20a%20elegir%20un%20cuaderno."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Ayúdame a elegir
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
