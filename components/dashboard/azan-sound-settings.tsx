"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, VolumeX, Check, Download } from "lucide-react";

type AzanRecitation = {
  id: string;
  name: string;
  reciter: string;
  duration: string;
  isPlaying: boolean;
  isDownloaded: boolean;
};

export function AzanSoundSettings() {
  const [volume, setVolume] = useState(80);
  const [selectedAzan, setSelectedAzan] = useState("makkah");
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock azan recitations data
  const azanRecitations: AzanRecitation[] = [
    {
      id: "makkah",
      name: "Makkah Adhan",
      reciter: "Sheikh Ali Ahmad Mulla",
      duration: "2:45",
      isPlaying: false,
      isDownloaded: true,
    },
    {
      id: "madinah",
      name: "Madinah Adhan",
      reciter: "Sheikh Abdul Rahman Al Khashoggi",
      duration: "3:12",
      isPlaying: false,
      isDownloaded: true,
    },
    {
      id: "alaqsa",
      name: "Al-Aqsa Adhan",
      reciter: "Sheikh Muhammad Khair Al-Hijazi",
      duration: "2:58",
      isPlaying: false,
      isDownloaded: false,
    },
    {
      id: "fajr",
      name: "Fajr Adhan",
      reciter: "Sheikh Ali Hajjaj Alsouasi",
      duration: "3:25",
      isPlaying: false,
      isDownloaded: false,
    },
  ];

  const togglePlay = (id: string) => {
    if (selectedAzan === id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedAzan(id);
      setIsPlaying(true);
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
                  className={selectedAzan === adhan.id ? "border-primary" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={adhan.id} id={adhan.id} />
                        <div>
                          <Label
                            htmlFor={adhan.id}
                            className="text-base font-medium"
                          >
                            {adhan.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {adhan.reciter} • {adhan.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {adhan.isDownloaded ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary"
                            onClick={() => togglePlay(adhan.id)}
                          >
                            {isPlaying && selectedAzan === adhan.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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

          <Button className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Test Selected Adhan
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
