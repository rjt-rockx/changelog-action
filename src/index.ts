import { getInput, setFailed, setOutput } from "@actions/core";
import fs from "fs/promises";
import path from "path";

async function run(): Promise<void> {
	try {
		let files: string[];

		try {
			const data = JSON.parse(getInput("files"));
			if (!Array.isArray(data)) setFailed("Files is not an array");
			files = data;
		} catch (error) {
			return setFailed("Invalid JSON");
		}

		let markdownFiles = files.filter((file) => file.endsWith(".md"));
		if (!markdownFiles.length) return;

		const filter: string = getInput("filter");
		if (filter) {
			markdownFiles = markdownFiles.filter((file) => new RegExp(filter, getInput("filterflags")).test(file));
		}

		console.log(`Found ${markdownFiles.length} files`);

		const latest = markdownFiles.sort((a, b) => a.localeCompare(b)).pop();
		if (!latest) return;

		const filename = path.parse(path.resolve(latest)).name;

		console.log(`Latest: ${filename}`);

		setOutput("latest", filename);

		const content = await fs.readFile(latest, "utf8");
		setOutput("content", content);
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
}

run();
