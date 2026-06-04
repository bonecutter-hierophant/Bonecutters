import { useEffect, useMemo, useState } from "react";
import { generateDragonSegments, MAX_DRAGON_ORDER, visibleDragonOrder, visibleSegmentCount } from "./dragonCurve";

type DragonScrollMarkProps = {
  finishSectionId?: string;
};

const desktopQuery = "(min-width: 1060px)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function DragonScrollMark({ finishSectionId = "name" }: DragonScrollMarkProps) {
  const segments = useMemo(() => generateDragonSegments(MAX_DRAGON_ORDER), []);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(desktopQuery);
    const reducedMotion = window.matchMedia(reducedMotionQuery);

    const updateAnimationEligibility = () => {
      setIsDesktop(desktop.matches);
      setPrefersReducedMotion(reducedMotion.matches);
    };

    updateAnimationEligibility();
    desktop.addEventListener("change", updateAnimationEligibility);
    reducedMotion.addEventListener("change", updateAnimationEligibility);

    return () => {
      desktop.removeEventListener("change", updateAnimationEligibility);
      reducedMotion.removeEventListener("change", updateAnimationEligibility);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) {
      return undefined;
    }

    let frame = 0;

    const updateProgress = () => {
      const finishSection = document.getElementById(finishSectionId);
      const finishPoint = finishSection === null ? document.documentElement.scrollHeight : finishSection.offsetTop;
      const nextProgress = finishPoint > 0 ? window.scrollY / finishPoint : 0;

      setProgress(Math.min(1, Math.max(0, nextProgress)));
    };

    const scheduleProgressUpdate = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleProgressUpdate);
      window.removeEventListener("resize", scheduleProgressUpdate);
    };
  }, [isDesktop, prefersReducedMotion, finishSectionId]);

  if (!isDesktop) {
    return null;
  }

  const markProgress = prefersReducedMotion ? 1 : progress;
  const revealedSegments = prefersReducedMotion ? segments.length : visibleSegmentCount(segments.length, markProgress);
  const visibleOrder = prefersReducedMotion ? MAX_DRAGON_ORDER : visibleDragonOrder(segments.length, markProgress);
  const scale = Math.max(1, 14 / Math.pow(2, (visibleOrder - 1) / 1.25));
  const revealRotationProgress = (revealedSegments - 2) / (segments.length - 2);
  const rotationProgress = (markProgress + revealRotationProgress) / 2;
  const rotation = 135 + rotationProgress * 180;
  const anchor = segments[0];
  const targetX = -11 + markProgress * 11;
  const targetY = 56 - markProgress * 71;
  const transform = `translate(${targetX} ${targetY}) rotate(${rotation}) scale(${scale}) translate(${-anchor.x1} ${-anchor.y1})`;
  const frameSize = 250 + markProgress * 170;

  return (
    <aside
      className={[
        "dragon-scroll-mark",
        markProgress > 0.78 ? "dragon-scroll-mark--unclipped" : "",
        prefersReducedMotion ? "dragon-scroll-mark--static" : "",
      ].filter(Boolean).join(" ")}
      aria-hidden="true"
      style={{
        height: `${frameSize}px`,
        width: `${frameSize}px`,
      }}
    >
      <svg className="dragon-scroll-mark__svg" viewBox="-125 -125 250 250" role="presentation">
        <g className="dragon-scroll-mark__curve" transform={transform}>
          {segments.map((segment, index) => (
            <line
              className="dragon-scroll-mark__segment"
              key={segment.id}
              opacity={index < revealedSegments ? 1 : 0}
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
            />
          ))}
        </g>
      </svg>
    </aside>
  );
}
