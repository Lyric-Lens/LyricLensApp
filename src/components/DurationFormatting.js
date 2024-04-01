export default function DurationFormatting(seconds) {
  let minutes = 0;
  while (seconds - 60 >= 0) {
    seconds -= 60;
    minutes++;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}