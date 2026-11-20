import { useCallback, useEffect, useRef, useState } from 'react';

import { ChiptuneEngine, type ChiptuneEngineOptions } from '../audio/ChiptuneEngine';

export interface UseChiptuneResult {
  playing: boolean;
  play: () => Promise<void>;
  stop: () => void;
  toggle: () => Promise<void>;
  setVolume: (volume: number) => void;
  /** False during SSR and wherever Web Audio is unavailable. */
  supported: boolean;
}

/**
 * Owns a `ChiptuneEngine` for the lifetime of a component, disposing it on
 * unmount so the AudioContext is actually released.
 */
export function useChiptune(options: ChiptuneEngineOptions = {}): UseChiptuneResult {
  const engineRef = useRef<ChiptuneEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  // Read once on mount: `isSupported` touches `window`, which does not exist
  // during server rendering.
  useEffect(() => {
    setSupported(ChiptuneEngine.isSupported);
  }, []);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new ChiptuneEngine(options);
    }
    return engineRef.current;
    // Options are read only when the engine is first constructed; re-creating
    // it mid-playback would cut the audio off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      void engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const play = useCallback(async () => {
    await getEngine().start();
    setPlaying(true);
  }, [getEngine]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (playing) {
      stop();
    } else {
      await play();
    }
  }, [playing, play, stop]);

  const setVolume = useCallback(
    (volume: number) => getEngine().setVolume(volume),
    [getEngine],
  );

  return { playing, play, stop, toggle, setVolume, supported };
}
