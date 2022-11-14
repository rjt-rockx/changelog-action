import { getInput, setFailed } from "@actions/core";

async function run(): Promise<void> {
	try {
		console.log("Hello World!");
		const file: string = getInput("file");
		console.log({ file });
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
