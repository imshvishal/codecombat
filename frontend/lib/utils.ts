import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processImageUrl(imageUrl:string, width=100, height=100) {
  if (imageUrl && imageUrl.includes("cloudinary.com")) {
      return imageUrl.replace(/\/upload\/(v\d+\/)?/, `/upload/w_${width},h_${height}/`)
  }
  return imageUrl
}
