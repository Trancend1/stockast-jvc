'use client';

import * as React from 'react';
import { IconMic } from '@/components/ui-kit/icons';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkThinking } from '@/components/ui-kit/primitives/sk-thinking';
import { stock as t } from '@/lib/copy/stock';

/**
 * Web Speech API mic button (id-ID). Gated by FEATURE_VOICE_INPUT server-side
 * flag — caller decides whether to render. This component additionally:
 *  - hides itself when the browser has no SpeechRecognition
 *  - surfaces a disabled "denied" state when the user blocks the mic permission
 *
 * Per Web Speech API: not in Firefox; Safari uses `webkitSpeechRecognition`;
 * Chrome/Edge expose `SpeechRecognition` directly. We feature-detect both.
 */

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechErrorEvent = { error: string };

type RecognitionCtor = new () => Recognition;

type RecognitionWindow = Window & {
  SpeechRecognition?: RecognitionCtor;
  webkitSpeechRecognition?: RecognitionCtor;
};

type RecState = 'idle' | 'listening' | 'denied' | 'unsupported';

export function VoiceInputButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [state, setState] = React.useState<RecState>('idle');
  const recognitionRef = React.useRef<Recognition | null>(null);

  React.useEffect(() => {
    const w = window as RecognitionWindow;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setState('unsupported');
      return;
    }
    const recog = new Ctor();
    recog.lang = 'id-ID';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      if (transcript) onTranscript(transcript);
      setState('idle');
    };
    recog.onerror = (event) => {
      setState(event.error === 'not-allowed' ? 'denied' : 'idle');
    };
    recog.onend = () => {
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };
    recognitionRef.current = recog;
    return () => {
      try {
        recog.abort();
      } catch {
        // recognition not started — safe to ignore
      }
    };
  }, [onTranscript]);

  if (state === 'unsupported') return null;

  function handleClick() {
    const recog = recognitionRef.current;
    if (!recog) return;
    if (state === 'listening') {
      recog.stop();
      setState('idle');
      return;
    }
    try {
      recog.start();
      setState('listening');
    } catch {
      // start() throws if called twice — recoverable, drop to idle
      setState('idle');
    }
  }

  const label =
    state === 'listening' ? t.voice.listening : state === 'denied' ? t.voice.denied : t.voice.idle;

  return (
    <SkButton
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-pressed={state === 'listening'}
      disabled={state === 'denied'}
      leading={state === 'listening' ? <SkThinking /> : <IconMic size={15} />}
    >
      {label}
    </SkButton>
  );
}
