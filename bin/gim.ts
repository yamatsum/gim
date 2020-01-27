#!/usr/bin/env node

import * as commander from "commander";

const program = new commander.Command();

program.name("hello").option("-h, --hello", "hello world");

program.parse(process.argv);

const programOptions = program.opts();
console.log(programOptions);
console.log("world");
