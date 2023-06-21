// Source: https://medium.com/swlh/environment-variables-in-angular-ionic-8aa1698f2cc5
const fs = require("fs");

const environmentFile = `export const environment = {
    production: ${!!process.env.PRODUCTION},
    weatherApiKey: '${process.env.WEATHER_API_KEY}',
};
`;

if (!fs.existsSync("./src/environments")) {
  fs.mkdirSync("./src/environments");
}

fs.writeFile(
  "./src/environments/environment.ts",
  environmentFile,
  function (err) {
    if (err) {
      throw console.error("Error: ", err);
    } else {
      console.log(
        `environment.ts file generated at /src/environments/environment.ts`
      );
    }
  }
);
