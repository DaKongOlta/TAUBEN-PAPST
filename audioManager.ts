
export function playSound(name: string, volume = 1) {
  // Mock implementation since we don't have audio files.
  // This prevents errors in components that call this function.
  console.log(`Playing sound: ${name} at volume ${volume}`);
}

export function playMusic(name: string, volume = 0.5, loop = false) {
  // Mock implementation
  console.log(`Playing music: ${name} at volume ${volume}, loop: ${loop}`);
}

export function stopMusic(name:string) {
    // Mock implementation
    console.log(`Stopping music: ${name}`);
}