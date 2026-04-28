import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NarrationLine = {
  /** unique key for caching */
  id: string;
  /** Hindi text */
  text: string;
  /** Optional ElevenLabs voice id */
  voiceId?: string;
};

export type NarrationCache = Record<string, string>; // id -> object URL

const FUNCTION_PATH = "elevenlabs-tts";

async function fetchOne(line: NarrationLine): Promise<string> {
  const { data, error } = await supabase.functions.invoke(FUNCTION_PATH, {
    body: { text: line.text, voiceId: line.voiceId },
  });
  if (error) throw error;
  // supabase-js returns a Blob for binary responses
  const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}

export function useNarration(lines: NarrationLine[], enabled: boolean) {
  const [cache, setCache] = useState<NarrationCache>({});
  const [progress, setProgress] = useState(0); // 0..1
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const created = useRef<string[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let done = 0;
    setProgress(0);
    setReady(false);
    setFailed(false);

    const total = lines.length;
    if (total === 0) {
      setReady(true);
      return;
    }

    Promise.all(
      lines.map(async (l) => {
        try {
          const url = await fetchOne(l);
          if (cancelled) return null;
          created.current.push(url);
          done += 1;
          setProgress(done / total);
          return [l.id, url] as const;
        } catch (e) {
          console.error("[narration] failed", l.id, e);
          done += 1;
          setProgress(done / total);
          return null;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: NarrationCache = {};
      let any = false;
      for (const r of results) if (r) { map[r[0]] = r[1]; any = true; }
      setCache(map);
      setReady(true);
      if (!any) setFailed(true);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    return () => {
      created.current.forEach((u) => URL.revokeObjectURL(u));
      created.current = [];
    };
  }, []);

  return { cache, progress, ready, failed };
}

/** Single shared <audio> element so muting / replays don't overlap. */
export class NarrationPlayer {
  private el: HTMLAudioElement | null = null;
  private muted = false;

  setMuted(m: boolean) {
    this.muted = m;
    if (m && this.el) { this.el.pause(); }
  }

  play(url: string) {
    if (this.muted || !url) return;
    if (this.el) { this.el.pause(); this.el.src = ""; }
    const a = new Audio(url);
    a.volume = 0.95;
    this.el = a;
    a.play().catch(() => { /* autoplay block — ignore */ });
  }

  stop() {
    if (this.el) { this.el.pause(); this.el = null; }
  }
}