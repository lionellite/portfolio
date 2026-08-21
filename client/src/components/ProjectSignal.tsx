type ProjectSignalProps = {
  title: string;
  index: number;
  className?: string;
};

const signals = [
  { code: "API / GATEWAY", mode: "REQUEST FLOW", bars: [42, 76, 56] },
  { code: "ML / INFERENCE", mode: "MODEL ROUTE", bars: [68, 35, 82] },
  { code: "SYNC / CLIENT", mode: "EDGE STATE", bars: [54, 71, 39] },
  { code: "DATA / EVENTS", mode: "FIELD BUS", bars: [78, 48, 65] },
  { code: "3D / ANALYSIS", mode: "SPATIAL MAP", bars: [35, 84, 58] },
  { code: "MEDIA / QUEUE", mode: "STREAM PIPE", bars: [61, 42, 79] },
  { code: "WEB / CONTENT", mode: "PUBLISH NODE", bars: [49, 73, 45] },
];

export default function ProjectSignal({ title, index, className = "" }: ProjectSignalProps) {
  const signal = signals[index % signals.length];
  return (
    <div className={`project-signal project-signal--${index % signals.length} ${className}`} aria-label={`Signal technique du projet ${title}`}>
      <div className="project-signal__top"><span>SYS.{String(index + 1).padStart(2, "0")}</span><span>LIVE</span></div>
      <div className="project-signal__schema" aria-hidden="true">
        <svg viewBox="0 0 320 180" preserveAspectRatio="none">
          <path d="M-12 136H74L112 98H176L211 54H332" />
          <path d="M-10 52H62L101 85H171L213 126H330" />
          <circle cx="74" cy="136" r="7" /><circle cx="112" cy="98" r="7" /><circle cx="211" cy="54" r="7" /><circle cx="101" cy="85" r="7" /><circle cx="213" cy="126" r="7" />
        </svg>
        <div className="project-signal__bars">{signal.bars.map((height, barIndex) => <span key={barIndex} style={{ height: `${height}%` }} />)}</div>
      </div>
      <div className="project-signal__label"><strong>{signal.code}</strong><span>{signal.mode}</span></div>
    </div>
  );
}
