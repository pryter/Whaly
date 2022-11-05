export function zeroPad(input: number) {
  let num = input.toString()
  while (num.length < 2) num = "0" + num
  return num
}
