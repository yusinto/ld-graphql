const { serverHotReload } = require('universal-hot-reload');

serverHotReload(require.resolve('./server.js'));
