const axios = require("axios");

class AuthService {
  url = `http://localhost:${process.env.PORT}/`;
  configMultipartData = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  login = async (formData) => {
    return await axios.post(
      this.url + "auth/login",
      formData,
      this.configMultipartData
    );
  };
}
module.exports = new AuthService();
