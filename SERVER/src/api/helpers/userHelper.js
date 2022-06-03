const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (token, email, fullname) => {
  const msg = {
    to: "aminerg07@gmail.com",
    from: "amine.mohamed.rg@gmail.com",
    subject: "Registration in BOOKING APP.",
    text: "A user want to join The app",
    html: `<strong>A new user called ${fullname} and signed with ${email}, want to join the app click to the link to add him </strong>
    <a href=${
      "http://localhost:5000/user/verify/" + token
    }>Activate the account</a>`,
  };
  try {
    await sgMail.send(msg);
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const activateMail = async (email, fullname) => {
  console.log(email, fullname);
  const msg = {
    to: email,
    from: "amine.mohamed.rg@gmail.com",
    subject: "Activation Account.",
    text: "The admin has just activate your acount",
    html: `<strong>Hey ${fullname} we are sending you this message to tell that the admin activate your account, you can login in the app now. have a good day. </strong>
    <a href=${"http://localhost:3000/login"}>Click to Login here</a>`,
  };
  try {
    await sgMail.send(msg);
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const generateHashPass = (password) => {
  const hashPass = bcrypt.hashSync(password, 10);
  return hashPass;
};

const generateToken = (userId, expiresIn = "") => {
  const secretKey = process.env.SECRET_KEY_TOKEN;
  var token = jwt.sign(
    { userId },
    secretKey,
    expiresIn !== "" && { expiresIn: expiresIn }
  );
  return token;
};

const verifyToken = (token) => {
  const secretKey = process.env.SECRET_KEY_TOKEN;
  try {
    const userId = jwt.verify(token, secretKey);
    return userId;
  } catch (error) {
    return { msg: "invalid token" };
  }
};

const comparePassword = async (password, hash) => {
  const res = await bcrypt.compare(password, hash);
  return res;
};

const getPerById = (idPer, permissions) => {
  for (const permission of permissions) {
    if (permission.idPer === idPer) {
      return permission;
    }
  }
};

const generateMenusPermission = (role, menuArr, permissions) => {
  const idMenus = [];
  const menus = [];

  menuArr.forEach((menu, i) => {
    if (!idMenus.includes(menu.Menu.idMenu)) {
      idMenus.push(menu.Menu.idMenu);
      const per = [];

      per.push(getPerById(menu.idPer, permissions));
      menu.Menu.Permission = per;
      menus.push(menu.Menu);
    } else {
      for (let j = 0; j < menus.length; j++) {
        if (menus[j].idMenu === menu.Menu.idMenu) {
          menus[j].Permission.push(getPerById(menu.idPer, permissions));
          break;
        }
      }
    }
  });
  return menus;
};

const filterCheck = (idUser, idRoom) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  let ftr;
  if (idRoom !== "none" && idUser !== "none") {
    if (!regexExp.test(idUser))
      return {
        code: 404,
        api: "/bookings/idUser/idRoom",
        method: "GET",
        message: "User Not found",
      };
    ftr = {
      Creator: idUser,
      idRoom: idRoom,
    };
  } else if (idRoom !== "none") {
    ftr = {
      idRoom: idRoom,
    };
  } else if (idUser !== "none") {
    if (!regexExp.test(idUser)) {
      return {
        code: 404,
        api: "/bookings/idUser/idRoom",
        method: "GET",
        message: "User Not found",
      };
    }
    ftr = {
      Creator: idUser,
    };
  }
  return ftr;
};

module.exports = {
  generateHashPass,
  comparePassword,
  generateToken,
  sendEmail,
  verifyToken,
  generateMenusPermission,
  filterCheck,
  activateMail,
};
