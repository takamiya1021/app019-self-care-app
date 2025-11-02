import { MassagePart, OrganType, StretchTarget } from '@/types'

export const getOrganAudioPath = (organ: OrganType, stepIndex: number): string => {
  return `/audio/organ-care/${organ}_step${stepIndex + 1}.wav`
}

export const getMassageAudioPath = (part: MassagePart, stepIndex: number): string => {
  return `/audio/massage/${part}_step${stepIndex + 1}.wav`
}

export const getStretchAudioPath = (target: StretchTarget, stepIndex: number): string => {
  return `/audio/stretch/${target}_step${stepIndex + 1}.wav`
}
