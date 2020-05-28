module.exports = {
    // 选项...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3390',
                changeOrigin: true
            }
        }
    },
  }