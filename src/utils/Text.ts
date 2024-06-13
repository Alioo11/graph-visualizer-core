class TextUtil {
  static verticalAdd(str1: string, str2: string) {
    let result = "";
    for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
      const charCodeStr1 = str1.charCodeAt(i) || 0;
      const charCodeStr2 = str2.charCodeAt(i) || 0;
      const xorValue = ((charCodeStr1 + charCodeStr2) % 74) + 48;
      result += String.fromCharCode(xorValue);
    }
    return result;
  }
}


export default TextUtil;