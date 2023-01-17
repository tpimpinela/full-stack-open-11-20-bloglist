const { info } = require("./utils/logger");
const config = require("./utils/config");
const app = require("./app");

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`);
});

class Calculator {
  constructor(previousResult = 0) {
    this.previousResult = previousResult;
  }

  add(...numbers) {
    return numbers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, this.previousResult);
  }

  multiply(...numbers) {
    return numbers.reduce((accumulator, currentValue) => {
      return accumulator * currentValue;
    }, this.previousResult);
  }
}
