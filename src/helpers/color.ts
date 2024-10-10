import {
  blue,
  blueGrey,
  brown,
  common,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";
import amber from "@mui/material/colors/amber";
import NumberUtils from "@utils/Number";

const colors = [
  amber,
  blue,
  blueGrey,
  brown,
  common,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
];

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "A100",
  "A200",
  "A400",
  "A700",
] as Array<keyof typeof amber>;

const COLORS = Object.keys(colors);

class ColorHelper {
  static angleToColor(angle: number): string {
    // Normalize the angle (we'll assume 0 to 2 * Math.PI as a reasonable range)
    const maxAngle = 2 * Math.PI;
    const normalizedAngle = Math.min(angle, maxAngle) / maxAngle;

    // Map the angle to a hue value between 0 and 360 degrees
    const hue = normalizedAngle * 360;

    // Set a maximum luminance for low angles (bright colors) and decrease as angle increases
    const maxLuminance = 70; // 70% luminance for low angles
    const minLuminance = 50; // 20% luminance for high angles
    const luminance = maxLuminance - normalizedAngle * (maxLuminance - minLuminance);

    // Keep the saturation constant, e.g., at 100% for vibrant colors
    const saturation = 100;

    // Return the HSL color string
    return `hsl(${hue}, ${saturation}%, ${luminance}%)`;
  }

  static random() {
    const shade = NumberUtils.randomNumberInArray(SHADES);
    const color = NumberUtils.randomNumberInArray(COLORS) as string;
    //@ts-ignore
    return colors[color][shade];
  }

  static *iter() {
    let shadeIndex = 0;
    let colorIndex = 0;

    //@ts-ignore
    yield colors[colorIndex][shadeIndex];

    shadeIndex += 1;
    colorIndex += 1;
  }
}

export default ColorHelper;
