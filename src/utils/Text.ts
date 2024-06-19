class TextUtil {
  /**
   * @description generates a hash from two give strings "a,b", no matter the order of call the result of calling bidirectionalHash(a,b) or bidirectionalHash(b,a) is the same.
   */
  static bidirectionalHash(strA: string, strB: string) {
    let result = "";
    for (let i = 0; i < Math.max(strA.length, strB.length); i++) {
      const charCodeStr1 = strA.charCodeAt(i) || 0;
      const charCodeStr2 = strB.charCodeAt(i) || 0;
      const xorValue = ((charCodeStr1 + charCodeStr2) % 74) + 48;
      result += String.fromCharCode(xorValue);
    }
    return result;
  }

  /**
   * @description generates a hash from two given strings
   */
  static directionalHash(strA: string, strB: string) {
    return strA.concat("-" + strB);
  }
}

export default TextUtil;
