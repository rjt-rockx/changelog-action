import { getInput, setFailed } from "@actions/core";
import fs from "fs/promises";

async function run(): Promise<void> {
	try {
		console.log("Hello World!");
		const files: string[] = JSON.parse(getInput("files"));
		console.log({ files });

		const markdownFiles = files.filter((file) => file.endsWith(".md"));
		console.log({ markdownFiles });

		if (!markdownFiles.length) return;

		const latest = markdownFiles.sort((a, b) => a.localeCompare(b)).pop();
		console.log({ latest });

		if (!latest) return;

		const content = await fs.readFile(latest, "utf8");
		console.log({ content });
		// const content: string = fs.readFileSync(file, "utf8");
		// debug(new Date().toTimeString());

		// /*
		//  * Steps:
		//  * 1. Parse the content of the markdown file
		//  * We need the version, a summary and a full description
		//  * 2. Send the content to Discord and Twitter
		//  * For Discord,
		//  * title: version
		//  * description: changelog trimmed to 2048 characters
		//  * For Twitter,
		//  * Changelog v(version) - (summary) --> trimmed to 280 characters
		//  * 3. Set the output and exit
		//  * */

		// setOutput("content", content);
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
}

run();
