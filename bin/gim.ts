#!/usr/bin/env node

import * as commander from "commander";
import * as inquirer from "inquirer";
import * as simplegit from "simple-git/promise";
import * as chalk from "chalk";

const program = new commander.Command();
const git = simplegit();

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
const execShellCommand = (cmd: string) => {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
};

const spacePadding = (val: string, len: number) => {
  for (let i = 0; i < len; i++) {
    val = val + " ";
  }

  return val.substr(0, len);
};

program.version("0.1.0");

type Choice = {
  name: string;
  checked: boolean;
};

const changeWorkdirCharactor = (workingDir: string) => {
  switch (workingDir) {
    case "M":
      return chalk.yellow("");
    default:
      console.log(workingDir);
  }
};

program.command("status").action(async () => {
  const status = await git.status(),
    cols: number = Number(await execShellCommand("tput cols"));
  console.log(status);

  if (status.files.length != 0) {
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "reptiles",
          message: `${status.files.length} changed files`,
          choices: status.files.map(
            file =>
              <Choice>{
                name: `${spacePadding(
                  file.path,
                  cols - 10
                )}${changeWorkdirCharactor(file.working_dir)}`,
                checked: true
              }
          )
        }
      ])
      .then(async answers => {
        console.log(
          answers.reptiles.map((answer: string) => {
            return answer.slice(0, -1).replace(/ /g, "");
          })
        );
        // await git.add(
        //   answers.reptiles.map((answer: string) => {
        //     return answer.slice(0, -1).replace(/ /g, "");
        //   })
        // );
      });
  }
});

program.parse(process.argv);
