import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import cronstrue from 'cronstrue'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cronToHumanReadable = (s: string) => {
  // eslint-disable-next-line import/no-named-as-default-member
  return cronstrue.toString(s)
}
