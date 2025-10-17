import { useState, useCallback } from "react";

interface SectorTransitionState {
  isTransitioning: boolean;
  currentSector?: string;
  targetSector?: string;
  progress: number;
}

export function useSectorTransition() {
  const [transitionState, setTransitionState] = useState<SectorTransitionState>({
    isTransitioning: false,
    progress: 0,
  });

  const startTransition = useCallback((currentSector?: string, targetSector?: string) => {
    setTransitionState({
      isTransitioning: true,
      currentSector,
      targetSector,
      progress: 0,
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setTransitionState(prev => ({
      ...prev,
      progress,
    }));
  }, []);

  const completeTransition = useCallback(() => {
    setTransitionState({
      isTransitioning: false,
      progress: 100,
    });
  }, []);

  const resetTransition = useCallback(() => {
    setTransitionState({
      isTransitioning: false,
      progress: 0,
    });
  }, []);

  return {
    ...transitionState,
    startTransition,
    updateProgress,
    completeTransition,
    resetTransition,
  };
}