const secondsToTime = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return minutes + ":" + secs;
};

export default secondsToTime;
