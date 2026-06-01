const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(`evo quant server running on http://localhost:${config.port}`);
  console.log(`Admin path: ${config.adminPath}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
