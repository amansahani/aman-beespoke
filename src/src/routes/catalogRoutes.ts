import { verifyToken } from "../middlewares/authentication";
import { searchController, recommendationController } from "../controllers/catalogController";
import { Router } from "express";

const catalogRouter = Router();

//PRODUCT CATALOG ROUTES
//SEARCH ROUTE IS EXCLUDED FROM THE SESSION VERIFICTATION
catalogRouter.get('/search', searchController);

//RECOMMENDED ROUTER IS INCLUDED IN THE SESSION VERIFICTATION SUCH THAT USERS CAN ACCESS ONLY THEIR DATA
catalogRouter.use(verifyToken);
catalogRouter.get('/recommend', recommendationController);

export default catalogRouter;