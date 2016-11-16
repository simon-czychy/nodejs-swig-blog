module.exports.Config = {
  host: 'localhost'
}


module.exports.dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db  : process.env.RDB_DB || 'blog',
  pool: {
    min: 5,
    max: 100,
    log: true,
    idleTimeoutMillis : 1 * 60 * 1000, // 1 minute
    reapIntervalMillis: 30 * 1000,  // 30 seconds
  }
}



