function compileFileToJS(src) {
  var res = "export default [";
  var lines = src.split("\n");
  for (var line of lines) {
    if (line == "") continue;
    res += `["text","${line}"],`;
  }
  res += "]";
  return res;
}

export default function story() {
  return {
    name: "story",
    transform(src, id) {
      if (/\.story$/.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null,
        }
      }
    }
  }
}
