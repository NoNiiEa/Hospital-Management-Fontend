module.exports = {
  devServer: {
    host: '0.0.0.0', // allows access via your IP address
    proxy: 'http://127.0.0.1:8000',
  },
};
