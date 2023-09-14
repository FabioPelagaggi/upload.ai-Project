import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) return;

    

    // const formData = new FormData();

    // formData.append("video", videoFile);

    // fetch("http://localhost:3000/upload", {
    //   method: "POST",
    //   body: formData,
    // });
  }

  const previewUrl = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <label
        htmlFor="video"
        className="relative text-primary border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center hover:bg-primary-foreground"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-8 h-8" />
            Select Video
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Transcription Prompt...</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Add video keywords separated by commas (,)."
        />
      </div>
      <Button type="submit" className="w-full">
        Upload
        <Upload className="w-4 h-4 m-2" />
      </Button>
    </form>
  );
}
