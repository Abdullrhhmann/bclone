import mongoose, { Document, Schema } from "mongoose";

export interface CardInterface extends Document {
    _id: mongoose.Types.ObjectId;
    card_id: string;
    imageTitle: string;
    creatorName: string;
    likes: number;
    views: number;
    sort_by: string;
    type: string;
    price_type: string;
    category: string;
    file_extension: string;
    availability: string;
    country: string;

    tools:string[];
    color_of_the_image: string;
    colors_used: string[];
    tools_list: string[];
    countries_list: string[];
    file_extension_list: string[];
    images: string[];
    likedBy: mongoose.Schema.Types.ObjectId[]; // Users who liked this card
}

const cardSchema = new Schema<CardInterface>(
    {
        card_id: {
            type: String,
        },
        imageTitle: {
            type: String,
            required: true,
        },
        creatorName: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        sort_by: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: false,
        },
        price_type: {
            type: String,
            required: false,
        },
        category: {
            type: String,
            required: false,
        },
        file_extension: {
            type: String,
            required: false,
        },
        availability: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        tools: {
            type: [String],
        },
        color_of_the_image: {
            type: String,
            required: false,
        },
        colors_used: {
            type: [String],
        },
        tools_list: {
            type: [String],
        },
        countries_list: {
            type: [String],
        },
        file_extension_list: {
            type: [String],
        },
        images: {
            type: [String],
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);
const CardModel = mongoose.model<CardInterface>(
    "Card",
    cardSchema
);
export default CardModel;
