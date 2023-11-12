import express from 'express';
import { productRecommendations, searchByKeyword } from '../models/catalog';
import { findUserById } from '../models/users';


//SEARCH CONTROLLER
export const searchController = async (req : express.Request, res : express.Response) =>{
    let {keywords, minPrice, maxPrice} = req.body.search;
    
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);

    if(keywords && minPrice && maxPrice){
        const products = await searchByKeyword({keywords: keywords, minPrice, maxPrice});
        return res.status(200).json(products);
    }
    else if(!minPrice && !maxPrice){
        const products = await searchByKeyword({keywords: keywords});
        return res.status(200).json(products);
    }
    else if(minPrice){
        const products = await searchByKeyword({keywords: keywords, minPrice: minPrice});
        return res.status(200).json(products);
    }
    else if(maxPrice){
        const products = await searchByKeyword({keywords: keywords, maxPrice: maxPrice});
        return res.status(200).json(products);
    }
}

export const recommendationController = async (req: express.Request, res: express.Response) => {
//MIDDLEWARE ASSIGNS THE USERNAME AFTER SESSION VERIFICATION
    const userId = req.body.userId;
    const Username = (await findUserById(userId)).Username;
    const products = await productRecommendations(Username);
    return res.status(200).json(products);
}