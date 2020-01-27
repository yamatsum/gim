#!/usr/bin/env node

import * as commander from "commander";
import * as inquirer from "inquirer";
import * as simplegit from "simple-git/promise";

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

program.command("status").action(async () => {
  const status = await git.status(),
    cols: number = Number(await execShellCommand("tput cols"));

  if (status.files.length != 0) {
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "reptiles",
          message: `${status.files.length} changed files`,
          choices: status.files.map(
            file => `${spacePadding(file.path, cols - 10)}${file.working_dir}`
          )
        }
      ])
      .then(answers => {
        console.info("Answer:", answers.reptiles);
      });
  }
});

program.parse(process.argv);
