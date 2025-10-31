// import sequelize from "../config/database";

// import { DataTypes } from "sequelize";
// import sequelize from "../config/database";

const getUserModel = (sequelize, { DataTypes }) => {
    const user = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return user;
}

export default getUserModel