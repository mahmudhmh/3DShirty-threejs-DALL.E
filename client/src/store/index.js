import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#ae8fde",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});
export default state;
