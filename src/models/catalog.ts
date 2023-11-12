import { PrismaClient } from "@prisma/client";
import { findUserByUsername } from "./users";

const prisma = new PrismaClient();

type searchByKeywordProps = {
    keywords: string,
    minPrice?: number,
    maxPrice?: number
}

//SEARCH BY KEYWORD AND PRICES
export const searchByKeyword = async ({keywords, minPrice, maxPrice}: searchByKeywordProps) => {
    //REGEX FOR SPELLING VALIDATION
    const regex = new RegExp(keywords.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");

    //ALL DATA IS GIVEN THAT IS KEYWORD, MIN_PRICE AND MAX_PRICE
    if(minPrice && maxPrice){
  
        const products = await prisma.catalog.findMany({where:{
            OR: [
              {Product_description : {contains: regex.source}},
              {Brand_name : {contains: regex.source}},
            ],
            Price :{
              lte: maxPrice,
              gte: minPrice
            }
          },
          orderBy: {Rank: 'asc'},
          take: 10
        })
        return products;
    }
    //ONLY KEYWORD AND MIN_PRICE
    else if(minPrice){
        const products = await prisma.catalog.findMany({where:{
            OR: [
              {Product_description : {contains: regex.source}},
              {Brand_name : {contains: regex.source}},
            ],
            Price :{
              gte: minPrice,
            }
          },
          orderBy: {Rank: 'asc'},
          take: 10
        });
        return products;
    }
    //ONLY KEYWORD AND MAX_PRICE
    else if (maxPrice){
        const products = await prisma.catalog.findMany({where:{
            OR: [
              {Product_description : {contains: regex.source}},
              {Brand_name : {contains: regex.source}},
            ],
            Price :{
              lte: maxPrice
            }
          },
          orderBy: {Rank: 'asc'},
          take: 10
        });
        return products;
    }
    //ONLY KEYWORD
    else{
        const products = await prisma.catalog.findMany({where:{
            OR: [
              {Product_description : {contains: regex.source}},
              {Brand_name : {contains: regex.source}},
            ],
          },
          orderBy: {Rank: 'asc'},
          take: 10
        });
        return products;
    }
  }
  
  //PRODUCT RECOMMENDATIONS
  export const productRecommendations = async(Username: string) =>{
  
      const user = await findUserByUsername(Username);
      const Preffered_category = user.Preffered_category;

      //CATEGORIES EXTRACTED DATA FROM THE EXCEL FILE WITH THE HELP OF PANDAS
      const categories = ['Kurta sets and salwar suits', 'Men Jeans', 'Men casual shirts',
      'Men casual trousers', 'Men ethnic wear', 'Men formal shirts',
      'Men t-shirts & polos', 'Sarees', 'Women Dresses',
      'Women Jeans & Jeggings', 'Women party wear', 'Women western wear'];
      
      //IF PREFFERED CATEGRORY IS NOT INCLUDED
      if(categories.includes(Preffered_category)){
        
        const recommendedProducts = prisma.catalog.findMany({
          where: {Product_category: Preffered_category},
          orderBy: {Rank: 'asc'},
          take: 10
        })
        return recommendedProducts;
      }else{
        //IF INCLUDED
        const recommendedProducts = prisma.$queryRaw`SELECT * FROM catalog ORDER BY RANDOM() LIMIT 10`;
        return recommendedProducts;
      }
  
    
  }