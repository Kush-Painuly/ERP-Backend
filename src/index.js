import app from "./app.js";
import { dbConnect } from "./config/db-connect.js";
const PORT = process.env.PORT || 8080;


const main = async () => {
  try {
    await dbConnect();

    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (err) {
    throw err;
  }
};

main().catch((err) => {
  process.exit(1); //to stop the Nodejs process.
});

