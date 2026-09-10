import dotenv from 'dotenv';
import { connectDB } from './db/db.connection.js';
import { app } from './app.js';


dotenv.config({
    path: './.env'
})

console.log("Mongo URI:", process.env.DB_URI);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server is running on ${process.env.PORT || 8080}`);
        });
    })
    .catch((error) => {
        console.error("Error starting the server:", error);
    });