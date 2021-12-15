const commands = ["scene", "text", "label", "set", "add", "goto", "bg", "bgm", "choice", "actor"];
const regexFile = /\.story$/;
const regexLine = /^(\w+) (.+)/;
const regexText = /(.+?): ?(.+)/;
const regexGoto = /^(\S+) (if|unless) ([^<>=!]+) ?([<>=!]+) ?(.+)/;
const regexSet = /^(\S+) (.+)/;

function compileFileToJS(src: string) {
  const lines: string[] = src.split(/\r?\n/);
  const cmds = [];
  const labels: { [label: string]: number } = {};
  let index = 0;
  for (let line of lines) {
    if (line == "") continue; //skip empty lines
    let r = regexLine.exec(line);
    if (!r || commands.indexOf(r[1]) == -1) {
      //fallback to text if there is no command
      r = regexText.exec("text " + line);
    }
    if (r[1] == "label") { //save labels
      labels[r[2]] = index;
      continue;
    }
    if (r[1] == "goto") { //preprocess goto command
      const s = r[2];
      r = regexGoto.exec(s);
      if (r) {
        cmds.push(["goto", r[1], r[2], r[3], r[4], parseFloat(r[5])]);
      } else {
        cmds.push(["goto", s]);
      }
    } else if (r[1] == "text") { //preprocess text command
      const s = r[2];
      r = regexText.exec(r[2]);
      if (r) {
        cmds.push(["text", { n: r[1], t: r[2] }]); //n = name, t = text
      } else {
        cmds.push(["text", { n: null, t: s }]);
      }
    } else if (r[1] == "set" || r[1] == "add") { //preprocess set/add command
      const s = r[1];
      r = regexSet.exec(r[2]);
      cmds.push([s, r[1], parseFloat(r[2])]);
    } else if (r[1] == "actor") { //preprocess actor command
      const s = r[2].split(" ");
      cmds.push(["actor", s]);
    } else if (r[1] == "choice") { //preprocess choice command
      const s = r[2].split(" ");
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
  //replace labels with line index
  for (let cmd of cmds) {
    if (cmd[0] == "goto") {
      cmd[1] = labels[cmd[1]];
    } else if (cmd[0] == "choice") {
      for (let choice of cmd[1]) {
        choice.goto = labels[choice.goto];
      }
    }
  }
  console.log(cmds); //debug output
  return "export default " + JSON.stringify(cmds);
}

export default function story() {
  return {
    name: "story",
    transform(src: string, id: string) {
      if (regexFile.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null,
        }
      }
    }
  }
}
