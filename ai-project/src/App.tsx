import { FileVideo, Github, Upload, Wand2 } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl">upload.ai</h1>

        <div className="flex items-center gap-12">
          <span className="text-sm text-muted-foreground">
            Upload your files to the cloud
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="AI prompt..."
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="AI's Result..."
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Tip: you can use the{" "}
            <code className="text-primary">{"{transcription}"}</code> as a
            prompt to add the video's transcription.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="text-primary border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center hover:bg-primary-foreground"
            >
              <FileVideo className="w-8 h-8" />
              Upload Video
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">
                Transcription Prompt...
              </Label>
              <Textarea id="transcription_prompt" className="h-20 leading-relaxed resize-none" placeholder="Add video keywords separated by commas (,)."/>
            </div>
            <Button type="submit" className="w-full">
              Upload
              <Upload className="w-4 h-4 m-2"/>
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
          <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Option."/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gbt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gbt3.5">GBT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">New options coming soon...</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperature</Label>
              <Slider 
                min={0}
                max={1}
                step={0.1}
              />
              <span className="block text-xs text-muted-foreground italic">
                Temperature is a parameter of OpenAI ChatGPT, GPT-3 and GPT-4 models that governs the randomness and thus the creativity of the responses.
                A temperature of 0 means the responses will be very straightforward, while a temperature of 1 means the responses will be more creative.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full transition ease-in-out hover:scale-105 duration-300">
              Start
              <Wand2 className="w-4 h-4 m-2"/>
            </Button>

          </form>
        </aside>
      </main>
    </div>
  );
}