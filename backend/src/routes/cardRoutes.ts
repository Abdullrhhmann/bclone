import { Router } from "express";
import cardController from '../controllers/cardController';

import { authenticateToken } from "../middleware/authMiddleware";
import { validateCard } from "../middleware/validationMiddleware";

const router = Router();

//card data routes
router.post("/add", validateCard, cardController.addCard);
router.post("/addAll", cardController.addManyCards);
router.get("/all", cardController.getAllCards);
router.get("/search", cardController.searchCards);
router.get("/filters", cardController.getFilterValues);
router.get("/specific/:id", cardController.getCard);
router.post("/like/:id", authenticateToken, cardController.likeCard);
router.get("/liked", authenticateToken, cardController.getLikedCards);
router.delete("/delete/:id", cardController.deleteCard);
router.delete("/deleteAll", cardController.deleteAllCards);


export default router;
