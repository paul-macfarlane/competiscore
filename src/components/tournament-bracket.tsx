"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export type BracketMatch = {
  id: string;
  round: number;
  position: number;
  winnerId: string | null;
  nextMatchId: string | null;
  isBye?: boolean;
};

type TournamentBracketProps<T extends BracketMatch> = {
  bracket: T[];
  totalRounds: number;
  renderMatchCard: (match: T) => ReactNode;
  championParticipantId?: string;
};

export function getRoundLabel(round: number, totalRounds: number): string {
  if (round === totalRounds) return "Final";
  if (round === totalRounds - 1) return "Semifinals";
  if (round === totalRounds - 2) return "Quarterfinals";
  return `Round ${round}`;
}

type ConnectorPath = {
  d: string;
  isChampionPath: boolean;
  isCompleted: boolean;
  isBye: boolean;
};

export function TournamentBracket<T extends BracketMatch>({
  bracket,
  totalRounds,
  renderMatchCard,
  championParticipantId,
}: TournamentBracketProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const [connectors, setConnectors] = useState<ConnectorPath[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const rounds: T[][] = [];
  for (let r = 1; r <= totalRounds; r++) {
    rounds.push(
      bracket
        .filter((m) => m.round === r)
        .sort((a, b) => a.position - b.position),
    );
  }

  const calculateConnectors = useCallback(() => {
    const bracketEl = bracketRef.current;
    if (!bracketEl) return;

    const bracketRect = bracketEl.getBoundingClientRect();
    setSvgSize({
      width: bracketEl.scrollWidth,
      height: bracketEl.scrollHeight,
    });

    const paths: ConnectorPath[] = [];

    for (const match of bracket) {
      if (!match.nextMatchId) continue;

      const sourceEl = bracketEl.querySelector(
        `[data-match-id="${match.id}"]`,
      ) as HTMLElement | null;
      const targetEl = bracketEl.querySelector(
        `[data-match-id="${match.nextMatchId}"]`,
      ) as HTMLElement | null;

      if (!sourceEl || !targetEl) continue;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const sx = sourceRect.right - bracketRect.left;
      const sy = sourceRect.top + sourceRect.height / 2 - bracketRect.top;
      const tx = targetRect.left - bracketRect.left;
      const ty = targetRect.top + targetRect.height / 2 - bracketRect.top;
      const mx = (sx + tx) / 2;

      const d = `M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`;

      paths.push({
        d,
        isChampionPath:
          !!championParticipantId && match.winnerId === championParticipantId,
        isCompleted: !!match.winnerId,
        isBye: !!match.isBye,
      });
    }

    setConnectors(paths);
  }, [bracket, championParticipantId]);

  const updateFades = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    calculateConnectors();
    updateFades();
  }, [calculateConnectors, updateFades]);

  useEffect(() => {
    const bracketEl = bracketRef.current;
    const containerEl = containerRef.current;
    if (!bracketEl) return;

    const observer = new ResizeObserver(() => {
      calculateConnectors();
      updateFades();
    });
    observer.observe(bracketEl);
    if (containerEl) observer.observe(containerEl);

    return () => observer.disconnect();
  }, [calculateConnectors, updateFades]);

  return (
    <div className="relative">
      {showLeftFade && (
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
      )}
      {showRightFade && (
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
      )}
      <div
        ref={containerRef}
        className="overflow-x-auto"
        onScroll={updateFades}
      >
        <div ref={bracketRef} className="relative flex min-w-max gap-8 py-4">
          <svg
            className="pointer-events-none absolute inset-0"
            width={svgSize.width}
            height={svgSize.height}
          >
            {connectors.map((connector, i) => (
              <path
                key={i}
                d={connector.d}
                fill="none"
                stroke={
                  connector.isChampionPath
                    ? "var(--primary)"
                    : connector.isCompleted
                      ? "var(--primary)"
                      : "var(--border)"
                }
                strokeWidth={
                  connector.isChampionPath ? 2.5 : connector.isCompleted ? 2 : 1
                }
                strokeOpacity={
                  connector.isBye
                    ? 0.3
                    : connector.isChampionPath
                      ? 1
                      : connector.isCompleted
                        ? 0.4
                        : 1
                }
                strokeDasharray={connector.isBye ? "4 4" : undefined}
              />
            ))}
          </svg>
          {rounds.map((roundMatches, roundIndex) => {
            const round = roundIndex + 1;
            return (
              <div key={round} className="flex flex-col gap-2">
                <h3 className="text-center text-sm font-medium text-muted-foreground">
                  {getRoundLabel(round, totalRounds)}
                </h3>
                <div className="flex flex-1 flex-col justify-around gap-4">
                  {roundMatches.map((match) => (
                    <div key={match.id} data-match-id={match.id}>
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
