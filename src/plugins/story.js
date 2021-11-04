const commands = ["scene", "text", "label", "set", "add", "goto", "bg", "bgm", "choice", "actor"];
const regexFile = /\.story$/;
const regexLine = /^(\w+) (.+)/;
const regexText = /(.+?): ?(.+)/;
const regexGoto = /^(\S+) (if|unless) ([^<>=!]+) ?([<>=!]+) ?(.+)/;
const regexSet = /^(\S+) (.+)/;

function compileFileToJS(src) {
  var lines = src.split(/\r?\n/);
  var cmds = [];
  var labels = {};
  var index = 0;
  for (var line of lines) {
    if (line == "") continue;
    var r = regexLine.exec(line);
    if (!r || commands.indexOf(r[1]) == -1) {
      r = [line, "text", line]; //便于统一处理
    }
    if (r[1] == "label") {
      labels[r[2]] = index;
      continue;
    }
    if (r[1] == "goto") {
      //goto指令需要预处理条件
      var s = r[2];
      r = regexGoto.exec(s);
      if (r) {
        cmds.push(["goto", r[1], r[2], r[3], r[4], parseFloat(r[5])]);
      } else {
        cmds.push(["goto", s]);
      }
    } else if (r[1] == "text") {
      var s = r[2];
      r = regexText.exec(r[2]);
      if (r) {
        cmds.push(["text", { n: r[1], t: r[2] }]);
      } else {
        cmds.push(["text", { n: null, t: s }]);
      }
    } else if (r[1] == "set" || r[1] == "add") {
      //set和get指令需要预处理变量值
      var s = r[1];
      r = regexSet.exec(r[2]);
      cmds.push([s, r[1], parseFloat(r[2])]);
    } else if (r[1] == "actor") {
      var s = r[2].split(" ");
      cmds.push(["actor", s]);
    } else if (r[1] == "choice") {
      //编译选择项
      var s = r[2].split(" ");
      let choices = [];
      for (let i = 0; i < s.length; i += 2) {
        choices.push({ text: s[i], goto: s[i + 1] });
      }
      cmds.push([r[1], choices]);
    } else {
      cmds.push([r[1], r[2]]);
    }
    index++;
  }
  for (let cmd of cmds) {
    if (cmd[0] == "goto") {
      cmd[1] = labels[cmd[1]];
    } else if (cmd[0] == "choice") {
      for (let choice of cmd[1]) {
        choice.goto = labels[choice.goto];
      }
    }
  }
  console.log(cmds);
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
