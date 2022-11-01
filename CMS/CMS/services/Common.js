const makeDb = require("../config/db");
const config = require("config").get("database");
const jwtConfig = require("config").get("jwtConfig");
const dbError = require('../handler/errorHandler');

const commonServices = {
      //Returns single record for query from single table
    //table = any table name from which we need to fetch data
    //keys = comma seperated string of table field which we need to get from database
    //condition = basically it is for data filtering, it is an object, in which key is mapped with table field
    //and value with field value
    readSingleData: async (table, keys, condition) => {
        const db = makeDb(config);
        try {
            var conditionQuery = "";
            let conditionValues = [];
            for(let element in condition){
                if(Array.isArray(condition[element])){
                    conditionQuery += conditionQuery == ""?`WHERE ${element} IN(?)`:` AND ${element} IN(?)`;
                    conditionValues.push(condition[element]);
                }else{
                    conditionQuery += conditionQuery == ""?`WHERE ${element} = ?`:` AND ${element} = ?`;
                    conditionValues.push(condition[element]);
                }
            }
            return await db.query(
                `SELECT ${keys} FROM ${table} ${conditionQuery} LIMIT 1`, conditionValues
            );
        }catch (error) {
            throw new dbError("Database error", error.message);
        } finally {
            await db.close();
        }
    },
    // For inserting data dynamically
    dynamicInsert: async (table, data) => {
      db = makeDb(config);
      try {
          return await db.query(
              `INSERT INTO ${table}(${Object.keys(data).toString()}) VALUES (?)`,
              [Object.values(data)]
          );
      } catch (error) {
          throw new dbError("Database error", error.message);
      } finally {
          await db.close();
      }
    },
    // For updating data dynamically
    dynamicUpdate: async (table, keys, condition) => {
      db = makeDb(config);
      try {
          let conditionQuery = "";
          let conditionValues = [];
          let keysQuery = "";
          for (let obj in keys) {
              keysQuery += keysQuery == "" ? `${obj} = ?` : `,${obj} = ?`;
              conditionValues.push(keys[obj]);
          }
          for (let element in condition) {
              conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
              conditionValues.push(condition[element]);
          }
          return await db.query(
              ` update ${table} SET ${keysQuery} ${conditionQuery} `, conditionValues
          )
      } catch (error) {
          throw new dbError("Database error", error.message);
      } finally {
          await db.close();
      }
  },
  dynamicDelete: async (table, condition) => {
      db = makeDb(config);
      try {
          let conditionQuery = "";
          let conditionValues = [];

          for (let element in condition) {
              conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
              conditionValues.push(condition[element]);
          }

          return await db.query(
              `DELETE FROM ${table} ${conditionQuery} LIMIT 1`, conditionValues
          );
      } catch (error) {
          throw new dbError("Database error", error.message);
      } finally {
          await db.close();
      }
    }
}
module.exports = commonServices;