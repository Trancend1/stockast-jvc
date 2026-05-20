export interface SkStepsProps {
  count?: number;
  current?: number;
}

export function SkSteps({ count = 3, current = 0 }: SkStepsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === current ? 18 : 5,
            height: 5,
            borderRadius: 4,
            background: i === current ? 'var(--sk-text)' : 'var(--sk-line-strong)',
            transition: 'width 220ms var(--sk-ease), background-color 220ms var(--sk-ease)',
          }}
        />
      ))}
    </div>
  );
}
