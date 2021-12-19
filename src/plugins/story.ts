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
  let s: string;
  let index = 0;
  for (let line of lines) {
    if (line == "") continue; //skip empty lines
    let r = regexLine.exec(line);
    if (!r || commands.indexOf(r[1]) == -1) {
      //fallback to text if there is no command
      r = regexLine.exec("text " + line);
    }
    switch (r[1]) {
      case "label": //save labels
        labels[r[2]] = index;
        continue;
      case "goto": //preprocess goto command
        s = r[2];
        r = regexGoto.exec(s);
        if (r) {
          cmds.push(["goto", r[1], r[2], r[3], r[4], parseFloat(r[5])]);
        } else {
          cmds.push(["goto", s]);
        }
        break;
      case "text": //preprocess text command
        s = r[2];
        r = regexText.exec(r[2]);
        if (r) {
          cmds.push(["text", { n: r[1], t: r[2] }]); //n = name, t = text
        } else {
          cmds.push(["text", { n: null, t: s }]);
        }
        break;
      case "set": //preprocess set command
      case "add": //preprocess add command
        s = r[1];
        r = regexSet.exec(r[2]);
        cmds.push([s, r[1], parseFloat(r[2])]);
        break;
      case "actor": //preprocess actor command
        cmds.push(["actor", r[2].split(" ")]);
        break;
      case "choice":
        const t = r[2].split(" ");
        let choices = [];
        for (let i = 0; i < t.length; i += 2) {
          choices.push({ text: t[i], goto: t[i + 1] });
        }
        cmds.push([r[1], choices]);
        break;
      case "scene":
      case "bg":
      case "bgm":
        cmds.push([r[1], r[2]]);
        break;
      default:
        console.log("Unknown command: " + r[1]);
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
