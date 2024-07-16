class NumberUtils {
  static randomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static maybe(radio: number = 0.5) {
    if (radio < 0 || radio > 1) throw new Error("radio must be a value between 0 and 1");
    return Math.random() > radio;
  }
}

export default NumberUtils;
