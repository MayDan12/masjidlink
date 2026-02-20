"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, VolumeX, Check } from "lucide-react";

type AzanRecitation = {
  id: string;
  name: string;
  reciter: string;
  src: string;
};

const azanRecitations: AzanRecitation[] = [
  {
    id: "azan1",
    name: "Ahmed AbduRahman Darar",
    reciter: "Ahmed AbduRahman Darar",
    src: "/audio/azan1.mp3",
  },
  {
    id: "azan2",
    name: "Ali Ibn Ahmad Mala",
    reciter: "Ali Ibn Ahmad Mala",
    src: "/audio/azan2.mp3",
  },
  {
    id: "azan3",
    name: "Assem Bukhrare",
    reciter: "Assem Bukhrare",
    src: "/audio/azan3.mp3",
  },
  {
    id: "azan4",
    name: "Islam Sobhi",
    reciter: "Islam Sobhi",
    src: "/audio/azan4.mp3",
  },
  {
    id: "azan5",
    name: "Malek Chibat Al-Hamd",
    reciter: "Malek Chibat Al-Hamd",
    src: "/audio/azan5.mp3",
  },
  {
    id: "azan6",
    name: "Mansoor Az-Zahrani",
    reciter: "Mansoor Az-Zahrani",
    src: "/audio/azan6.mp3",
  },
  {
    id: "azan7",
    name: "Mishary Rashid Alafasy",
    reciter: "Mishary Rashid Alafasy",
    src: "/audio/azan7.mp3",
  },
  {
    id: "azan8",
    name: "Nasser Al Qatami",
    reciter: "Nasser Al Qatami",
    src: "/audio/azan8.mp3",
  },
  {
    id: "azan9",
    name: "Salah Al Hashim",
    reciter: "Salah Al Hashim",
    src: "/audio/azan9.mp3",
  },
  {
    id: "azan10",
    name: "Shiekh Mohameed al Ghazali",
    reciter: "Shiekh Mohameed al Ghazali",
    src: "/audio/azan10.mp3",
  },
];

export function AzanSoundSettings() {
  const [volume, setVolume] = useState(80);
  const [selectedAzan, setSelectedAzan] = useState("azan1");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = (azan: AzanRecitation) => {
    if (selectedAzan === azan.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (selectedAzan !== azan.id || !audioRef.current) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(azan.src);
        audioRef.current.volume = volume / 100;
        audioRef.current.onended = () => setIsPlaying(false);
        setSelectedAzan(azan.id);
      }
      audioRef.current
        ?.play()
        .catch((e) => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  };

  const handleTestPlay = () => {
    const currentAzan = azanRecitations.find((a) => a.id === selectedAzan);
    if (currentAzan) {
      togglePlay(currentAzan);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="adhan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="adhan">Adhan Recitations</TabsTrigger>
          <TabsTrigger value="custom">Custom Sounds</TabsTrigger>
        </TabsList>

        <TabsContent value="adhan" className="space-y-4">
          <div className="space-y-4">
            <RadioGroup value={selectedAzan} onValueChange={setSelectedAzan}>
              {azanRecitations.map((adhan) => (
                <Card
                  key={adhan.id}
                  className={`transition-all ${
                    selectedAzan === adhan.id
                      ? "border-primary ring-1 ring-primary"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={adhan.id} id={adhan.id} />
                        <div>
                          <Label
                            htmlFor={adhan.id}
                            className="text-base font-medium cursor-pointer"
                          >
                            {adhan.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {adhan.reciter}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            selectedAzan === adhan.id && isPlaying
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent radio selection when clicking play
                            togglePlay(adhan);
                          }}
                        >
                          {selectedAzan === adhan.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        {selectedAzan === adhan.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Volume</Label>
              <span className="text-sm text-muted-foreground">{volume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="flex-1"
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Button className="w-full" onClick={handleTestPlay}>
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop Preview
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Test Selected Adhan
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Custom adhan sounds will be available in a future update.</p>
            <p className="text-sm mt-2">
              You&apos;ll be able to upload your own adhan recordings.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
