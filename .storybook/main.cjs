const path = require("path")
const { getSharedConfig } = require("@vactorynext/core/storybook-server")

const config = getSharedConfig({
  storiesPath: path.resolve(__dirname, "../components/elements"),
});

module.exports = config;
