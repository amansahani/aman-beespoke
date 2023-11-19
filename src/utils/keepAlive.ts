import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as fs from 'fs/promises';
import { findUserByUsername } from '../models/users';
import { searchByKeyword } from '../models/catalog';

const prisma = new PrismaClient();

//TO LOAD THE DATA FROM EXCEL TO CATALOG TABLE

/**
 * 
type Product = {
    product_id: number;
    Product_category: string;
    Rank: number;
    brand_name: string;
    product_description: string;
    price: number;
    image_link: string;
  };
  

async function importData(filePath: string) {
    try {
      // read Excel file
      const fileContent = await fs.readFile(filePath);
      const workbook = xlsx.read(fileContent, { type: 'buffer' });
  
      // assuming the first sheet is relevant
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // convert Excel data to JSON
      const jsonData : Product[] = xlsx.utils.sheet_to_json(sheet);
  
      let newProduct = undefined;
      for (const data of jsonData) {
        newProduct = await prisma.catalog.create({
          data: {
            Product_id: data.product_id,
            Product_category: data.Product_category,
            Rank: data.Rank,
            Brand_name: data.brand_name,
            Product_description: data.product_description,
            Price: data.price,
            Image_link: data.image_link,
          },
        });
      }
  
      console.log('Data imported successfully.');
      return newProduct;
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      // disconnect Prisma client
      await prisma.$disconnect();
    }
  }


importData("/home/tomi/Downloads/catalog.xlsx")
 */

// TO KEEP DATABASE ALIVE
setInterval(async () => {
  console.log("AWAKE DB"); 
  console.log((await findUserByUsername("raman@gmail.com")).Gender);
  console.log(await searchByKeyword({keywords: "FUNDAY"})[0]);  
}, 2000 * 60);

const dummy = ()=> "dummy";

export default dummy;