class Utils {
  static generateVerificationOTP = () => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  };

  static MAX_TOKEN_TIME = 2 * 60 * 1000;

  
}

module.exports = Utils;
