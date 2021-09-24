const commands = ["scene", "text", "label", "set", "add", "goto", "bgm"];
const regexFile = /\.story$/;
const regexLine = /^(\w+) (.+)/;

function compileFileToJS(src) {
  var lines = src.split(/\r?\n/);
  var cmds = [];
  for (var line of lines) {
    if (line == "") continue;
    var r = regexLine.exec(line);
    if (r && commands.indexOf(r[1]) != -1) {
      cmds.push([r[1], r[2]]);
    } else {
      cmds.push(["text", line]); //省略指令时默认text
    }
  }
  return "export default " + JSON.stringify(cmds);
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
