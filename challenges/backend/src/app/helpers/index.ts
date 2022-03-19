export const encapsulateLoader = async (callback: () => Promise<void>): Promise<void> => {
  const loader = ["\\", "|", "/", "-"];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write("\r" + loader[i]);
    i = (i + 1) % loader.length;
  }, 250);

  try {
    await callback()
  } catch (e) {
    throw e;
  } finally {
    clearInterval(interval);
    process.stdout.write("\r");
  }
}