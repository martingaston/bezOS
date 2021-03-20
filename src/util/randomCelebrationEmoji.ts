const celebrationEmojis = ["🎉", "🥳", "💃", "👍", "✨", "🤩", "🙌"];

export const randomCelebrationEmoji = (): string => {
  const index = Math.floor(Math.random() * celebrationEmojis.length);
  return celebrationEmojis[index];
};
