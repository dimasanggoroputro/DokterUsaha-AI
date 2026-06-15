"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "id-ID"; // Indonesian for UMKM

        recognition.onstart = () => {
          setIsListening(true);
          toast.success("Mendengarkan... Silakan bicara dalam Bahasa Indonesia.", {
            id: "voice-toast",
            duration: 5000,
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Akses mikrofon ditolak. Izinkan mikrofon di browser Anda.", {
              id: "voice-toast",
            });
          } else {
            toast.error("Gagal mendeteksi suara. Coba lagi.", {
              id: "voice-toast",
            });
          }
        };

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            onTranscript(resultText);
            toast.success("Suara berhasil dimasukkan!", {
              id: "voice-toast",
            });
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSupported) {
      toast.error("Browser Anda tidak mendukung Web Speech API.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={toggleListening}
      className={`rounded-full shrink-0 border border-input shadow-sm transition-all duration-300 ${
        isListening
          ? "bg-destructive/10 border-destructive hover:bg-destructive/20 animate-pulse text-destructive"
          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
      } ${className}`}
      title={isListening ? "Hentikan mendengarkan" : "Masukan dengan Suara (Bahasa Indonesia)"}
    >
      <Mic className={`size-3.5 ${isListening ? "animate-bounce" : ""}`} />
    </Button>
  );
}
