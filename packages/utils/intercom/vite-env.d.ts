/// <reference types="vite/client" />

declare const VITE_RELEASE_SHA: string;

interface Window {
  __BSPORT_RELEASE_SHA__?: string;
}
