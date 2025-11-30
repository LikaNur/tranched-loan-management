export const randomWait = async () => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
};
