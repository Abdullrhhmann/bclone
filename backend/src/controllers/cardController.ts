import CardModel , { CardInterface } from "../models/cardModel";
import { Request, Response } from "express";
import UserModel from "../models/userModel";


const addCard = async (req: Request, res: Response) => {
    const {
        card_id,
        imageTitle,
        creatorName,
        likes,
        views,
        sort_by,
        type,
        price_type,
        category,
        file_extension,
        availability,
        country,
        tools,
        color_of_the_image,
        colors_used,
        tools_list,
        countries_list,
        file_extension_list,
        images
    } = req.body;

    console.log(req.body);

    try {
        console.log("Entered thr try block");
        const card = new CardModel({
            card_id,
            imageTitle,
            creatorName,
            likes,
            views,
            sort_by,
            type,
            price_type,
            category,
            file_extension,
            availability,
            country,
            tools,
            color_of_the_image,
            colors_used,
            tools_list,
            countries_list,
            file_extension_list,
            images
        });

        console.log(card);
        const savedProperty = await card.save();
        res.status(201).json({
            "message":"Card Added successfully",
            "status":"success"
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}


const addManyCards = async (req: Request, res: Response) => {
    const cards = req.body; // Assuming the body contains an array of card objects
    try {
        const savedCards = await CardModel.insertMany(cards);
        res.status(201).json({
            message: "Cards added successfully",
            status: "success",
            data: savedCards
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



const deleteCard = async (req: Request, res: Response) => {
    try {
        const deletedCard = await CardModel.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCard);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const deleteAllCards = async (req: Request, res:Response) => {
    try {
        const deleteResult = await CardModel.deleteMany({});
        res.status(200).json({
            message: `${deleteResult.deletedCount} cards deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
const getAllCards = async (req: Request, res: Response) => {
    try{
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        // Get total count
        const totalCards = await CardModel.countDocuments();
        const totalPages = Math.ceil(totalCards / limit);

        // Fetch cards with pagination
        const cards = await CardModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({
            "message": "All Cards fetched Successfully",
            "properties": cards,
            "pagination": {
                page,
                limit,
                totalCards,
                totalPages,
                hasMore: page < totalPages,
            },
            "status": "success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}
const getCard = async (req: Request, res: Response) => {
    try{
        const card=await CardModel.findById(req.params.id);

        console.log(card)

        res.status(200).json({
            "message":"Card Details fetched Successfully",
            "property":card,
            "status":"success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}

const likeCard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const cardId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        // Check if user already liked this card
        const alreadyLiked = card.likedBy?.includes(userId);

        if (alreadyLiked) {
            // Unlike: remove user from likedBy array
            card.likedBy = card.likedBy?.filter((id) => id.toString() !== userId.toString()) || [];
            card.likes = Math.max(0, card.likes - 1);
            await card.save();

            return res.status(200).json({
                message: "Card unliked",
                liked: false,
                likes: card.likes,
                status: "success",
            });
        } else {
            // Like: add user to likedBy array
            if (!card.likedBy) card.likedBy = [];
            card.likedBy.push(userId);
            card.likes = card.likes + 1;
            await card.save();

            return res.status(200).json({
                message: "Card liked",
                liked: true,
                likes: card.likes,
                status: "success",
            });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getLikedCards = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        // Find all cards that contain this user in likedBy array
        const likedCards = await CardModel.find({
            likedBy: userId,
        });

        res.status(200).json({
            message: "Liked cards fetched successfully",
            properties: likedCards,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const searchCards = async (req: Request, res: Response) => {
    try {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        const { q, tools, colors, country, file_extension, category, creative_fields, availability, location, color } = req.query;
        
        // Build filter object
        const filter: any = {};

        // Text search on title and creator
        if (q) {
            filter.$or = [
                { imageTitle: { $regex: q, $options: 'i' } },
                { creatorName: { $regex: q, $options: 'i' } }
            ];
        }

        // Filter by tools
        const toolsParam = tools || null;
        if (toolsParam) {
            const toolsArray = Array.isArray(toolsParam) ? toolsParam : [toolsParam];
            filter.tools_list = { $in: toolsArray };
        }

        // Filter by colors
        const colorsParam = colors || color || null;
        if (colorsParam) {
            const colorsArray = Array.isArray(colorsParam) ? colorsParam : [colorsParam];
            filter.colors_used = { $in: colorsArray };
        }

        // Filter by country/location
        const countryParam = country || location || null;
        if (countryParam) {
            filter.country = countryParam;
        }

        // Filter by file extension
        if (file_extension) {
            filter.file_extension = file_extension;
        }

        // Filter by category/creative fields
        const categoryParam = category || creative_fields || null;
        if (categoryParam) {
            filter.category = categoryParam;
        }

        // Filter by availability
        if (availability) {
            filter.availability = availability;
        }

        const cards = await CardModel.find(filter);
        
        res.status(200).json({
            "message": "Search results",
            "properties": cards,
            "status": "success"
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getFilterValues = async (req: Request, res: Response) => {
    try {
        const [creative_fields, availability, location, tools, color] = await Promise.all([
            CardModel.distinct('category', { category: { $ne: null } }),
            CardModel.distinct('availability', { availability: { $ne: null } }),
            CardModel.distinct('country', { country: { $ne: null } }),
            CardModel.distinct('tools_list', { tools_list: { $ne: [] } }),
            CardModel.distinct('colors_used', { colors_used: { $ne: [] } }),
        ]);

        const clean = (arr: any[]) => arr.filter(Boolean).sort();

        res.status(200).json({
            message: 'Filter values fetched',
            status: 'success',
            data: {
                creative_fields: clean(creative_fields),
                availability: clean(availability),
                location: clean(location),
                tools: clean(tools),
                color: clean(color),
            }
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export default {
    addCard,
    addManyCards,
    deleteCard,
    deleteAllCards,
    getAllCards,
    getCard,
    likeCard,
    getLikedCards,
    searchCards,
    getFilterValues
};