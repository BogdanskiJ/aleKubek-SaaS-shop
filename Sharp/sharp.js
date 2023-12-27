const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDirectory = "xxxSharp\\before";

const outputDirectory = "xxxSharp\\after";

const webpOptions = {
	quality: 75,
};

function processFilesRecursively(directory) {
	const files = fs.readdirSync(directory);

	for (const file of files) {
		const filePath = path.join(directory, file);
		const fileStat = fs.statSync(filePath);

		if (fileStat.isDirectory()) {
			processFilesRecursively(filePath);
		} else {
			const outputFilePath = path.join(
				outputDirectory,
				path.relative(inputDirectory, filePath).replace(/\.\w+$/, ".webp"),
			);
			processImage(filePath, outputFilePath);
		}
	}
}

function processImage(inputPath, outputPath) {
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	sharp(inputPath)
		.webp(webpOptions)
		.flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
		.resize(1000, 1000, {
			fit: "inside",
		})
		.toFile(outputPath, (err, info) => {
			if (err) {
				console.error(`Error ${inputPath}:`, err);
			} else {
				console.log(
					`File ${inputPath} was transformed and saved in ${outputPath}.`,
				);
			}
		});
}

processFilesRecursively(inputDirectory);
