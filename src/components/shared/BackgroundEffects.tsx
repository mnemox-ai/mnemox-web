export function BackgroundEffects() {
  return (
    <>
      {/* Radial gradients */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,229,255,0.04) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 40% at 20% 60%, rgba(167,139,250,0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,229,255,0.02) 0%, transparent 50%)',
            '#04060b',
          ].join(', '),
        }}
      />

      {/* Noise texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
        }}
      />
    </>
  );
}
