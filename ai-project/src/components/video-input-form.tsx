import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";
import { stat } from "fs";

type Status =
  | "idle"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

const statusMessages = {
  idle: "Upload",
  converting: "Converting video to audio...",
  uploading: "Uploading video...",
  generating: "Generating transcription...",
  success: "Success!",
  error: "Error!",
};

interface VideoInputFormProps {
  onVideoUploaded: (videoId: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function convertVideoToAudio(video: File) {
    console.log("Converting video to audio...");

    const ffmpeg = await loadFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    //ffmpeg.on('log', log => console.log(log.message));

    ffmpeg.on("progress", (progress) => {
      console.log(
        "Processing: " + Math.round(progress.progress * 100) + "% done"
      );
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Converted video to audio!");

    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) return;

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);

    const videoId = response.data.video.id;

    setStatus("generating");

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus("success");

    props.onVideoUploaded(videoId);

    console.log("Uploaded video!");
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
          disabled={status != "idle"}
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Add video keywords separated by commas (,)."
        />
      </div>
      <Button
        data-success={status == "success"}
        data-error={status == "error"}
        disabled={status != "idle"}
        type="submit"
        className="data-[success=true]:bg-emerald-400 data-[error=true]:bg-red-700 w-full"
      >
        {statusMessages[status]}
        <Upload
          style={{ display: status != "idle" ? "none" : "block" }}
          className="w-4 h-4 m-2"
        />
      </Button>
    </form>
  );
}
