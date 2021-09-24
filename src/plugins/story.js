const commands = ["scene", "text", "label", "set", "add", "goto", "bgm"];
const regexFile = /\.story$/;
const regexLine = /^(\w+) (.+)/;

function compileFileToJS(src) {
  var lines = src.split(/\r?\n/);
  var cmds = [];
  var labels = {};
  var index = 0;
  for (var line of lines) {
    if (line == "") continue;
    var r = regexLine.exec(line);
    if (r && r[1] == "label") {
      labels[r[2]] = index;
    } else if (r && commands.indexOf(r[1]) != -1) {
      cmds.push([r[1], r[2]]);
      index++;
    } else {
      cmds.push(["text", line]); //省略指令时默认text
      index++;
    }
  }
  for (var cmd of cmds) {
    if (cmd[0] == "goto") {
      cmd[1] = labels[cmd[1]];
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
