import chalk from "chalk";

const highlight = chalk.blue.bgYellowBright.bold;
const consoleY = chalk.yellowBright.bgBlack.bold;
const consoleB = chalk.blueBright.bgBlack.bold;
const consoleR = chalk.redBright.bgBlack.bold;
const result = chalk.yellowBright.bgCyan.bold;
const working = chalk.blueBright.bgGrey.bold;
const interaction = chalk.blue.bgWhiteBright.bold;
const running = chalk.blue.bgGreenBright.bold;
const success = chalk.white.bgGreen.bold;
const connected = chalk.white.bgBlue.bold;
const fail = chalk.white.bgRed.bold;
const warning = chalk.whiteBright.bgYellow.bold;
const warningBright = chalk.yellowBright.bgYellow.bold;
const warningStrong = chalk.redBright.bgYellow.bold;

export default {
	highlight,
	consoleY,
	consoleB,
	consoleR,
	result,
	working,
	interaction,
	running,
	success,
	connected,
	fail,
	warning,
	warningBright,
	warningStrong,
};