export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  orbitRadius: number; // radius from center planet
  orbitSpeed: number; // speed of orbit
  orbitTiltX: number; // inclination angle X
  orbitTiltZ: number; // inclination angle Z
  selfRotationSpeed: number;
}

export interface ConfigData {
  partnerName: string;
  senderName: string;
  mainTitle: string;
  customSubtitle?: string;
  loveLetterTitle: string;
  loveLetterBody: string;
  musicUrl: string;
  useSynthAudio: boolean;
  planetColor: string; // e.g. '#ff69b4'
  atmosphereColor: string; // e.g. '#9370db'
  photos: PolaroidPhoto[];
}
