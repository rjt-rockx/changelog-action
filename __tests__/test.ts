import { getInput, InputOptions } from "@actions/core";
import { resolve } from "path";

import main from "../src";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const input: typeof getInput = (name: string, _?: InputOptions | undefined) => {
	switch (name) {
		case "files":
			return JSON.stringify([resolve(__dirname, "test.md")]);
		case "filter":
			return "";
		case "filterflags":
			return "";
		default:
			return "";
	}
};

const output = (name: string, value: string) => {
	switch (name) {
		case "latest":
			console.log(`Latest: ${value}`);
			break;
		case "content":
			console.log(`Content: ${value}`);
			break;
		case "sections":
			console.log(`Sections: ${value}`);
			break;
	}
};

const fail = (message: string | Error) => {
	console.error(message);
	process.exit(1);
	return;
};

main(input, output, fail);
