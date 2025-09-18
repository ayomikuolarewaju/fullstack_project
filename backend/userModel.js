import con from "connect.js";

export class UserModel {
  static async findAll() {
    try {
      const result = await con.query("SELECT * FROM users ORDER BY created_at DESC");
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching users: ${err.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await con.query("SELECT * FROM users WHERE id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error fetching user: ${err.message}`);
    }
  }

  static async create(userData) {
    try {
      const { name, email, age } = userData;
      const result = await con.query(
        "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
        [name, email, age]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') { // Unique violation
        throw new Error("Email already exists");
      }
      throw new Error(`Error creating user: ${err.message}`);
    }
  }

  static async update(id, userData) {
    try {
      const { name, email, age } = userData;
      const result = await con.query(
        "UPDATE users SET name = $1, email = $2, age = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
        [name, email, age, id]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new Error("Email already exists");
      }
      throw new Error(`Error updating user: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await con.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting user: ${err.message}`);
    }
  }
}