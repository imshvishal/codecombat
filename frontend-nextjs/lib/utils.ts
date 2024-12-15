import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processImageUrl(imageUrl: string, width = 100, height = 100) {
  if (imageUrl && imageUrl.includes("cloudinary.com")) {
    return imageUrl.replace(/\/upload\/(v\d+\/)?/, `/upload/w_${width},h_${height}/`);
  }
  return imageUrl;
}

function durationToSeconds(time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  let _seconds = (seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${_seconds}`;
}

export function subtractDuration(time1: string, time2: string) {
  const time1InSeconds = durationToSeconds(time1);
  const time2InSeconds = durationToSeconds(time2);
  const differenceInSeconds = time1InSeconds - time2InSeconds;
  return secondsToDuration(differenceInSeconds);
}

export function timeDifference(endTime: number, startTime: number) {
  let diff = endTime - startTime;
  return secondsToDuration(diff / 1000);
}
