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

function timeToSeconds(time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToTime(seconds: number) {
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
  const time1InSeconds = timeToSeconds(time1);
  const time2InSeconds = timeToSeconds(time2);
  const differenceInSeconds = time1InSeconds - time2InSeconds;
  return secondsToTime(differenceInSeconds);
}

export function timeDifference(endTime: number, startTime: number) {
  let diff = endTime - startTime;
  // const hours = Math.floor(diff / (1000 * 60 * 60));
  // const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  // const formattedHours = String(hours).padStart(2, "0");
  // const formattedMinutes = String(minutes).padStart(2, "0");
  // const formattedSeconds = String(seconds).padStart(2, "0");

  // return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return secondsToTime(diff / 1000);
}
