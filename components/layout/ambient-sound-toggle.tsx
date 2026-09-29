"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ambientSoundscape, playMechanicalClick } from "@/lib/utils/audio-feedback";
import { toast } from "sonner";

export function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    playMechanicalClick();
    const active = ambientSoundscape.toggle();
    setIsPlaying(active);
    if (active) {
      toast.success("Monaco Lounge Atelier Soundscape Activated", {
        description: "Minimalist ambient harmonics playing softly.",
      });
    } else {
      toast.info("Atelier Soundscape Paused");
    }
  };

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Mute Atelier Soundscape" : "Play Atelier Soundscape"}
      className={`relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
        isPlaying
          ? "bg-gold/15 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-gold hover:border-slate-700"
      }`}
      aria-label="Toggle Atelier Soundscape"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </>
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </button>
  );
}
