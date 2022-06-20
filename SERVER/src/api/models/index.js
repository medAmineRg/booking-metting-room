module.exports = () => {
  const Role = require("./Role");
  const User = require("./User");
  const Location = require("./Location");
  const Company = require("./Company");
  const Booking = require("./Booking");
  const Room = require("./Room");
  const Permission = require("./Permission");
  const Menu = require("./Menu");
  const Role_Permission_Menu = require("./Role_Permission_Menu");

  Role_Permission_Menu.belongsTo(Role, {
    foreignKey: "idRole",
  });
  Role_Permission_Menu.belongsTo(Menu, {
    foreignKey: "idMenu",
  });
  Role_Permission_Menu.belongsTo(Permission, {
    foreignKey: "idPer",
  });

  Role.hasMany(Role_Permission_Menu, {
    foreignKey: "idRole",
    as: "RolePerMen",
  });
  Menu.hasMany(Role_Permission_Menu, {
    foreignKey: "idMenu",
    as: "MenuPerRole",

  });
  Permission.hasMany(Role_Permission_Menu, {
    foreignKey: "idPer",
    as: "PermissionRolMen",

  });

  Company.hasMany(Location, {
    foreignKey: "idCompany",
  });
  Location.belongsTo(Company, {
    foreignKey: "idCompany",

  });
  Location.hasMany(User, {
    foreignKey: "idLoc",
  });

  Room.belongsTo(Location, {
    foreignKey: "idLoc",
  });
  Location.hasMany(Room, {
    foreignKey: "idLoc",
    as: "Location",
  });
  User.belongsTo(Location, {
    foreignKey: "idLoc",
  });

  Role.hasMany(User, {
    foreignKey: "idRole",
    as: "Role",

  });
  User.belongsTo(Role, {
    foreignKey: "idRole",

  });

  User.hasMany(Booking, {
    foreignKey: "Creator",
  });

  Booking.belongsTo(User, {
    foreignKey: "Creator",
  });

  Room.hasMany(Booking, {
    foreignKey: "idRoom",
  });

  Booking.belongsTo(Room, {
    foreignKey: "idRoom",
  });
};
