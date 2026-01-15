// src/three/loaders/textureLoader.ts
import * as THREE from "three";

export type TextureMap = Record<string, THREE.Texture>;

export function loadTextures(
  loader: THREE.TextureLoader,
  sources: Record<string, string>
): TextureMap {
  const textures: TextureMap = {};

  Object.entries(sources).forEach(([key, path]) => {
    const texture = loader.load(path);
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    textures[key] = texture;
  });

  return textures;
}
