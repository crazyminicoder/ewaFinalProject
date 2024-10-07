const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');  
const sequelize = require('./config/database'); 
const Car = require('./models/cars');


const csvFilePath = path.join(__dirname, 'temp_data', 'cars.csv');

async function insertDataFromCSV() {
  try {
   
    await sequelize.sync({ force: true }); 

    const cars = [];


    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.Make && row.Model) { 
          cars.push({
            make: row.Make,
            model: row.Model,
            trim: row.Trim || null,
            type: row.Type || null,
            year: parseInt(row.Year, 10),
            price: parseFloat(row.Price),
            condition: row.Condition || null,
            engineType: row['Engine Type'] || null,
            engineCapacity: row['Engine Capacity'] || null,
            horsepower: row.Horsepower || null,
            transmission: row.Transmission || null,
            fuelEfficiency: row['Fuel Efficiency (mpg)'] || null,
            driveType: row['Drive Type'] || null,
            seatingCapacity: parseInt(row['Seating Capacity'], 10) || null,
            colors: row.Colors || null,
            features: row.Features || null,
            imageUrl: row['Image URL'] || null,
          });
        } else {
          console.warn('Row missing required fields:', row);
        }
      })
      .on('end', async () => {
        if (cars.length > 0) {
          try {
            
            await Car.bulkCreate(cars);
            console.log('Data inserted successfully.');
          } catch (error) {
            console.error('Error inserting data into the database:', error);
          } finally {
            await sequelize.close();  
          }
        } else {
          console.log('No valid car data found in the CSV file.');
          await sequelize.close(); 
        }
      })
      .on('error', (error) => {
        console.error('Error reading the CSV file:', error);
      });
  } catch (error) {
    console.error('Error syncing database or inserting data:', error);
  }
}

insertDataFromCSV();
