
const resp = require('../../helpers/response');
const fs = require('fs');
const commonServices = require('../../services/Common');
const productServices = require('../../services/product');
const cloudinary = require('../../helpers/cloudinary');

const {
    nanoid
  } = require('nanoid');



const tables = {
    products:"products",
    users : "users"
}


const productController = {
    addProduct : async(req, res) =>{
        let file =req.file;
        let token = req.token;
        const body = req.body;

        if(!file){
            return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file");
        }
        try{
          let randomString = nanoid(5);

            // Upload image to cloudinary
            let result = await cloudinary.uploader.upload(req.file.path);
            
            let data = {
                title : body.title,
                category_id : body.categoryId,
                description : body.description,
                quantity:body.quantity,
                brand_id: body.brandId,
                color_id: body.colorId,
                size_id:body.sizeId,
                price:body.price,
                images : result.url,
                image_id:result.public_id
            }
            
            result = await commonServices.dynamicInsert(tables.products,data)
            return resp.cResponse(res,resp.SUCCESS,"Clothe product added successfully");
        }catch(error){
            return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
        }finally{
            fs.unlinkSync(`./${file.destination}${file.filename}`);
        }
    },
    editProduct : async(req, res) =>{
        let file =req.file;
        let token = req.token;
        const body = req.body;
        
        if(!file){
            return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file");
        }
        try{
          let randomString = nanoid(5);
            // Upload image to cloudinary
            const checkProduct = await commonServices.readSingleData(tables.products,"*", {
                "id": body.id});
            if (checkProduct.length == 0) {
                return resp.cResponse(res, resp.NOT_FOUND,"Clothe product not found");
            }
            let deleteResult = await cloudinary.uploader.destroy(checkProduct[0].image_id);

            let result = await cloudinary.uploader.upload(req.file.path);
            let data = {
                title : body.title,
                category_id : body.categoryId,
                description : body.description,
                quantity:body.quantity,
                brand_id: body.brandId,
                color_id: body.colorId,
                size_id:body.sizeId,
                price:body.price,
                images : result.url,
                image_id:result.public_id
            }
            result = await commonServices.dynamicUpdate(tables.products,data,{id:body.id})
            return resp.cResponse(res,resp.SUCCESS,"Clothe product updated successfully");
        }catch(error){
            return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
        }finally{
            fs.unlinkSync(`./${file.destination}${file.filename}`);
        }
    },
    getProduct : async(req, res) =>{
        let token = req.token;
        const body = req.body;
        
        try{
          let randomString = nanoid(5);
          let searchSortFilter={};
            let id = body.id ? body.id : null;
            if(id){
                searchSortFilter["id"] = id;
            }
          let result= await  productServices.getProduct(searchSortFilter)

          if (result.length == 0) {
            return resp.cResponse(res, resp.SUCCESS, con.policy.NO_RECORD,{
                count: 0,records: []
            });
        } else {
            return resp.cResponse(res, resp.SUCCESS,"Record Success",{
                 records: result
            });
        }
        }catch(error){
            return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
        }
    },
    deleteProduct : async(req, res) =>{
        let token = req.token;
        const body = req.body;
        try{
          let randomString = nanoid(5);
        
          const checkProduct = await commonServices.readSingleData(tables.products,"*", {
            "id": body.id});
        if (checkProduct.length == 0) {
            return resp.cResponse(res, resp.NOT_FOUND,"Clothe product not found");
        }
        let result = await cloudinary.uploader.destroy(checkProduct[0].image_id);

        let deleteProduct = await commonServices.dynamicDelete(tables.products, {
            "id": body.id
        });
        if (deleteProduct.affectedRows < 1) {
            return resp.cResponse(res, resp.BAD_REQUEST,"Something went wrong");
        }
        return resp.cResponse(res, resp.SUCCESS, "Clothe product deleted successfully");

        }catch(error){
            return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
        }
    }
}

module.exports = productController;