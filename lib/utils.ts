import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import cronstrue from 'cronstrue'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cronToHumanReadable = (s: string) => {
  return cronstrue.toString(s)
}
