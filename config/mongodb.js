import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FasoLink';
        console.log(" URL de connexion MongoDB :", mongoURI);

        const conn = await mongoose.connect(mongoURI, {

        });

        console.log(`MongoDB connecté `);
    } catch (error) {
        console.error(` Erreur de connexion MongoDB`);
        process.exit(1);
    }
};

export default connectDB;

