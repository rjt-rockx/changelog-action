import { getInput, setFailed, setOutput } from "@actions/core";
import fs from "fs/promises";
import path from "path";

type Section = {
	level: number;
	header: string;
	content?: string;
	children?: Section[];
};

type SectionJSON = {
	[key: string]: {
		content?: string;
		children?: SectionJSON[];
	};
};

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

		const headerRegex = /^(?<level>#{1,6})\s+(?<name>.+)$/gm;
		const headers = [...content.matchAll(headerRegex)]
			.map((match) => {
				if (match && match.groups && match.index)
					return {
						start: match.index,
						end: match.index + match[0].length,
						level: match.groups.level.length,
						name: match.groups.name,
					};
				return null;
			})
			.filter((header) => header !== null);

		const parsed = headers
			.map((header, index) => {
				const nextHeader = headers[index + 1];
				if (header)
					return {
						level: header.level,
						header: header.name,
						content: content.slice(header.end, nextHeader?.start).trim() || undefined,
					};
			})
			.filter((header) => header !== undefined) as Section[];

		const parsedJSON = parseSections(parsed);
		console.log(`Sections: ${JSON.stringify(parsedJSON, null, 2)}`);

		setOutput("sections", JSON.stringify(parsedJSON));
		console.log("Done");
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
}

function parseSections(sections: Section[]): SectionJSON {
	const headers = new Map<number, Section>();
	for (const section of sections) {
		headers.set(section.level, section);
		if (section.level === 1) {
			continue;
		}
		const parent = headers.get(section.level - 1);
		if (parent) {
			if (!parent.children) parent.children = [];
			parent.children.push(section);
		}
	}

	return toJSON(headers.get(1)!);
}

function toJSON(section: Section): SectionJSON {
	const data = {} as SectionJSON;
	data[section.header] = { content: section.content };
	if (section.children) {
		data[section.header].children = section.children.map(toJSON);
	}
	return data;
}

run();
