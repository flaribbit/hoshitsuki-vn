const commands = ["scene", "text", "label", "set", "add", "goto", "bgm"];
const regexFile = /\.story$/;
const regexLine = /^(\w+) (.+)/;

function compileFileToJS(src) {
  var res = "export default [";
  var lines = src.split(/\r?\n/);
  for (var line of lines) {
    if (line == "") continue;
    var r = regexLine.exec(line);
    if (r && commands.indexOf(r[1]) != -1) {
      res += `["${r[1]}","${r[2]}"],`;
    } else {
      res += `["text","${line}"],`; //省略指令时默认text
    }
  }
  res += "]";
  return res;
}

export default function story() {
  return {
    name: "story",
    transform(src, id) {
      if (regexFile.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null,
        }
      }
    }
  }
}
