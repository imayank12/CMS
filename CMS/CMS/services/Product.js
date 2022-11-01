const makeDb = require("../config/db");
const config = require("config").get("database");
const jwtConfig = require("config").get("jwtConfig");
const dbError = require('../handler/errorHandler');

const ProductServices={
  
  getProduct : async(searchSortFilter) => {
    const db = makeDb(config);
    try {
        let valArray=[]
        let sql = " SELECT p.id,p.title,p.description,p.images,p.category_id as categoryId,pc.name,p.quantity,p.brand_id as brandId,pb.brand_name as brandName,color_id as colorId,mc.name as colour,mps.name as size,p.price,p.status  FROM `products` as p LEFT JOIN product_brands as pb ON pb.id=p.brand_id LEFT JOIN master_colors as mc ON p.color_id=mc.id LEFT JOIN master_product_sizes as mps ON p.size_id=mps.id LEFT JOIN product_categories as pc ON pc.id=p.category_id ";

        if (searchSortFilter.id) {
            let id = searchSortFilter.id;
            sql += " Where p.id = ? ";
            valArray.push(id);
        }
        let result =await db.query(sql,valArray);
        return result 
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }
}

module.exports = ProductServices ;
