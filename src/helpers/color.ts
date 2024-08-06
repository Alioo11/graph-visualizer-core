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
  static random() {
    const shade = NumberUtils.randomNumberInArray(SHADES);
    const color = NumberUtils.randomNumberInArray(COLORS) as string;
    //@ts-ignore
    return colors["0"]["900"];
  }

  static *iter() {
    let shadeIndex = 0
    let colorIndex = 0

    //@ts-ignore
    yield colors[colorIndex][shadeIndex];

    shadeIndex +=1;
    colorIndex +=1;
  }
}

export default ColorHelper;
