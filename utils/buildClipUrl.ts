import { defaultClipBaseUrl } from "@constants";

export const buildClipUrl = (startTime: number, endTime: number) =>
  `${defaultClipBaseUrl}#t=${startTime},${endTime}`;
