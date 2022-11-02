import { debug, getInput, setFailed, setOutput } from "@actions/core";
import fs from "fs";

async function run(): Promise<void> {
	try {
		debug(new Date().toTimeString());
		const file: string = getInput("file");
		const content: string = fs.readFileSync(file, "utf8");
		debug(new Date().toTimeString());
		setOutput("content", content);
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
}

run();
