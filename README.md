# Vite & NextUI Template

This is a template for creating applications using Vite and NextUI (v2).

[Try it on CodeSandbox](https://githubbox.com/nextui-org/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [NextUI](https://nextui.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/nextui-org/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

### Backend

### Requirements

- Node.js (v14.x or higher)
- MySQL (v5.7 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd ewaFinalProject/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Database Configuration**

   - Open the `config/database.js` file.
   - Set your database credentials, including the database name, username, and password.

   ```javascript
   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize('ewa', 'your_username', 'your_password', {
     host: 'localhost',
     dialect: 'mysql',
   });

   module.exports = sequelize;
   ```

4. **Create Database**

   Create the MySQL database before running the application.

   ```sql
   CREATE DATABASE ewa;
   ```

5. **Run the Server**

   ```bash
   node index.js
   ```

   The server will start on port 3000. You should see a message indicating that the server is running and the database is synced.

### Data Insert

To insert data from a CSV file into the database, use the following command:

```bash
node insertData.js
```

This command will:
- Drop the existing `cars` table if it exists.
- Create a new `cars` table.
- Read data from `temp_data/cars.csv` and insert it into the database.
