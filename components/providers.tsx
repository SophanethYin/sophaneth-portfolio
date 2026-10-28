"use client";

import { useState } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { CursorFx } from "./cursor-fx";
import { Intro, IntroContext } from "./intro";

export function Providers({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ anchors: true, lerp: 0.1 }} />
      <IntroContext.Provider value={revealed}>
        {children}
        <Intro onReveal={() => setRevealed(true)} />
      </IntroContext.Provider>
      <CursorFx />
    </MotionConfig>
  );
}
