const makeDb = require("../config/db");
const config = require("config").get("database");
const jwtConfig = require("config").get("jwtConfig");
const dbError = require('../handler/errorHandler');

const AccountSetupServices={
  userRegister : async (userDetail) => {
    db = makeDb(config);
    try {
      // creating admin role entry
      await db.query(
        "INSERT INTO usersss (user_id,user_name,user_email,user_phone,password) VALUES (?)",
        [Object.values(userDetail)]
      );

      return true;
    } catch (error) {
      throw new dbError("Database error", error.message);
    } finally {
      await db.close();
    }
  },
  test : async() => {
    const db = makeDb(config);
    try {
      return await db.query(
        'SELECT * from users'
        );
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }
}

module.exports = AccountSetupServices ;
