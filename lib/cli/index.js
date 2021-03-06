"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var genServices_1 = require("./genServices");
var mkdirp = require("mkdirp");
var yargs = require("yargs");
var version = require('../../package.json').version;
var argv = yargs
    .version(version)
    .alias('v', 'version')
    .alias('i', 'input')
    .alias('o', 'output')
    .alias('g', 'serviceGroup')
    .alias('r', 'serviceVerison')
    .alias('t', 'serviceTimeout')
    .alias('h', 'help')
    .usage('Usage: $0 <command> [options]')
    .example('$0 -i ./DemoService.java -o ./services -g dubbo -r LATEST -t 6000', '')
    .demandOption(['i'])
    .default('o', './services')
    .default('g', 'dubbo')
    .default('r', 'LATEST')
    .default('t', 6000)
    .describe('i', 'Input Java file(s) path(directory)')
    .describe('o', 'Ouput typescript file folder')
    .describe('g', 'Service group in zookeeper/dubbo')
    .describe('r', 'Service version/revision in zookeeper/dubbo')
    .describe('t', 'Service timeout in zookeeper/dubbo')
    .epilog('Copyright ' + new Date().getFullYear())
    .help().argv;
try {
    var outputFoloder_1 = path_1.resolve(argv.o);
    mkdirp(outputFoloder_1);
    var files_1 = [];
    if (path_1.extname(argv.i).toLowerCase() === '.java') {
        files_1.push(path_1.resolve(argv.i));
    }
    else {
        var inputFolder_1 = path_1.dirname(path_1.resolve(argv.i + '/x.x'));
        fs_1.readdirSync(inputFolder_1).forEach(function (f) {
            if (f.toLowerCase().endsWith('.java')) {
                files_1.push(path_1.resolve(inputFolder_1, f));
            }
        });
    }
    files_1.forEach(function (f) {
        var code = fs_1.readFileSync(f).toString();
        console.log('\r\n');
        genServices_1.default.genServices(code, argv.g, argv.r, argv.t).forEach(function (s) {
            var outputFile = path_1.resolve(outputFoloder_1, s.name + ".ts");
            console.log(outputFile);
            fs_1.writeFileSync(outputFile, s.code);
        });
    });
    console.log('\r\n');
    var index = genServices_1.default.genIndexFile();
    var indexOutputFile = path_1.resolve(outputFoloder_1, index.name + ".ts");
    console.log(indexOutputFile);
    fs_1.writeFileSync(indexOutputFile, index.code);
    console.log('\r\n');
}
catch (err) {
    throw err;
}
