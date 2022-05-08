  module.exports = {
  apps : [{
    name: 'fhdk_roa',
    script: './node_modules/next/dist/bin/next',
    args:"start",
    cwd:"/root/fhdk/",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      API_URL: 'https://api.fhdk.gg',
    }
  }]
};
