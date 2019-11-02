const app = require('./server');
const chalk = require('chalk');
const PORT = 8080;

app.listen(PORT, () => {
    console.log(chalk.bgYellow('server is running at') + chalk.green.bold(`${PORT}`));
}); 