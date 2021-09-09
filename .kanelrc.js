const path = require('path');
require('dotenv').config();

// This hook will insert the name of the model or type right after the auto-generated warning comment.
const insertNameComment = (lines, src) => {
  const [h1, h2, ...tail] = lines;
  return [h1, h2, `// Name: ${src.name}`, ...tail];
};

module.exports = {
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  
  preDeleteModelFolder: true,

  modelHooks: [insertNameComment],
  typeHooks: [insertNameComment],

  resolveViews: true,

  schemas: [
    {
      name: 'public',
      modelFolder: path.join(__dirname, 'src', 'databaseTypes'),
      ignore: ['schema_migrations'],
    },
  ],
};