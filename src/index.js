const app = require('./server');
const chalk = require('chalk');
const PORT = 8080;

app.listen(PORT, () => {
    console.log(chalk.yellow.bold('server is running at') + chalk.green.bold(`${PORT}`));
    console.log(chalk.magenta.bold('Access to http://127.0.0.1:8080/api/todos to check response.'));
}); 