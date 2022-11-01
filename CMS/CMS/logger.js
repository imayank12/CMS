const { createLogger, transports, format } = require("winston");
var winston = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `Time : ${info.timestamp}, ${info.level} : ${info.message}`
    )
  ),
  transports: [
    new transports.File({
      filename: "./logs/app.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});


module.exports = logger;
