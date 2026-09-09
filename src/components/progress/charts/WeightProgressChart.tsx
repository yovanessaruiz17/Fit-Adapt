/**
 * FitAdapt - Gráfico de Evolución de Peso
 * FASE 8: Sistema de Progreso Personal
 * 
 * Principios:
 * - Accesible, responsive, limpio (SVG puro sin dependencias externas)
 * - Manejo robusto de 0 datos, 1 dato y múltiples datos
 * - Neutralidad ética: No juzga variaciones como éxito o fracaso
 */

import React, { useState } from 'react';
import { WeightRecord } from '../../../types/progress';
import { Plus, Info, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';

export interface WeightProgressChartProps {
  records: WeightRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: WeightRecord) => void;
}

export function WeightProgressChart({
  records,
  onAddRecord,
  onEditRecord,
}: WeightProgressChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<WeightRecord | null>(null);

  // 1. CASO: 0 DATOS
  if (records.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="max-w-sm mx-auto">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Aún no has registrado ningún peso
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Llevar un registro periódico te permite observar tendencias a medio y largo plazo sin presiones.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onAddRecord} className="mt-2 font-bold">
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar primer peso
        </Button>
      </div>
    );
  }

  // 2. CASO: 1 SOLO DATO
  if (records.length === 1) {
    const single = records[0];
    return (
      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center text-teal-600 dark:text-teal-400">
              <span className="text-xl font-black">{single.weightKg}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">kg</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                Primer registro ({single.date})
              </span>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Punto inicial registrado
              </h4>
              {single.note && (
                <p className="text-xs text-zinc-500 italic mt-0.5">"{single.note}"</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEditRecord(single)}>
              Editar
            </Button>
            <Button variant="primary" size="sm" onClick={onAddRecord}>
              <Plus className="w-4 h-4 mr-1" />
              Añadir otro registro
            </Button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 flex items-start gap-2.5 text-xs text-teal-800 dark:text-teal-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
          <span>
            Se requiere al menos 2 registros en distintas fechas para trazar la línea de tendencia temporal. ¡Registra tu evolución cuando te resulte cómodo!
          </span>
        </div>
      </div>
    );
  }

  // 3. CASO: MÚLTIPLES DATOS (GRÁFICO SVG RESPONSIVE)
  const weights = records.map((r) => r.weightKg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const paddingY = Math.max(1, (maxW - minW) * 0.2);
  const yMin = Math.floor(minW - paddingY);
  const yMax = Math.ceil(maxW + paddingY);
  const yRange = yMax - yMin || 1;

  // Dimensiones del canvas SVG
  const width = 600;
  const height = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Puntos calculados
  const points = records.map((r, i) => {
    const x = padLeft + (i / (records.length - 1)) * chartW;
    const y = padTop + chartH - ((r.weightKg - yMin) / yRange) * chartH;
    return { x, y, record: r };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Área rellena bajo la curva
  const areaPoints = `${points[0].x},${padTop + chartH} ${polylinePoints} ${points[points.length - 1].x},${padTop + chartH}`;

  return (
    <div className="space-y-3">
      {/* Visualizador interactivo */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 select-none"
          role="img"
          aria-label="Gráfico de evolución temporal del peso corporal"
        >
          <defs>
            <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de cuadrícula horizontales */}
          {[0, 0.5, 1].map((ratio) => {
            const y = padTop + chartH * ratio;
            const val = Math.round((yMax - ratio * yRange) * 10) / 10;
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-zinc-400 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Área sombreada */}
          <polygon points={areaPoints} fill="url(#weightAreaGrad)" />

          {/* Línea principal del gráfico */}
          <polyline
            fill="none"
            stroke="rgb(13 148 136)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Puntos interactivos */}
          {points.map((p, idx) => {
            const isHovered = hoveredPoint?.id === p.record.id;
            return (
              <g
                key={p.record.id}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPoint(p.record)}
                onClick={() => onEditRecord(p.record)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4.5}
                  className={`${
                    isHovered
                      ? 'fill-teal-400 stroke-teal-900 stroke-2'
                      : 'fill-white dark:fill-zinc-950 stroke-teal-600 stroke-2'
                  } transition-all`}
                />
                {/* Etiqueta de fecha en el eje X para primer y último punto o intermedios */}
                {(idx === 0 || idx === points.length - 1 || idx === Math.floor(points.length / 2)) && (
                  <text
                    x={p.x}
                    y={height - 12}
                    textAnchor="middle"
                    className="text-[10px] fill-zinc-400 font-mono"
                  >
                    {p.record.date.substring(5)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip flotante o tarjeta de inspección */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 p-2 rounded-xl bg-zinc-900 text-white text-xs border border-zinc-700 shadow-md flex items-center gap-2 animate-fadeIn">
            <span className="font-bold text-teal-400">{hoveredPoint.weightKg} kg</span>
            <span className="text-zinc-400 text-[11px] font-mono">• {hoveredPoint.date}</span>
            {hoveredPoint.note && (
              <span className="text-zinc-300 text-[10px] italic max-w-[120px] truncate">
                ({hoveredPoint.note})
              </span>
            )}
            <button
              onClick={() => onEditRecord(hoveredPoint)}
              className="text-[10px] text-teal-300 underline ml-1 cursor-pointer"
            >
              Editar
            </button>
          </div>
        )}
      </div>

      {/* Historial scrolleable horizontal de puntos con botón editar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => onEditRecord(r)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 hover:border-teal-500 transition-colors flex items-center gap-2 text-left"
          >
            <span className="font-black text-zinc-900 dark:text-zinc-100">{r.weightKg} kg</span>
            <span className="text-[10px] text-zinc-400 font-mono">{r.date.substring(5)}</span>
          </button>
        ))}
      </div>

      {/* Principio ético no vinculante */}
      <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Nota de Neutralidad:</strong> Las oscilaciones del peso reflejan variaciones normales de hidratación, glucógeno y masa magra. FitAdapt no interpreta variaciones aisladas como éxito o fracaso.
        </span>
      </div>
    </div>
  );
}
