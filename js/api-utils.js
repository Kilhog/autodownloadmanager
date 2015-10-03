(function() {

  var CryptoJS = require("crypto-js");
  var key = "Th3M0stUs3l33sK3y1nTh3W0rld";

  function utils() {

  }

  /**
   * Encrypte les params
   * @param param
   */
  function encrypt_param(param) {
    return CryptoJS.AES.encrypt(param, key);
  }

  /**
   * Décrypte les params
   * @param param
   */
  function decrypt_param(param) {
    return CryptoJS.AES.decrypt(param, key);
  }

  utils.getParam = function(db, param, func, is_json) {
    db.query("SELECT * FROM params WHERE nom = ?", [param], function(err, rows) {
      if (rows.length > 0) {
        rows[0][2] = decrypt_param(rows[0][2]).toString(CryptoJS.enc.Utf8);
        func(is_json ? JSON.parse(rows[0][2]) : rows[0][2]);
      } else {
        func(is_json ? {} : undefined);
      }
    });
  };

  utils.setParam = function(db, param, data, func, is_json) {
    data = encrypt_param(is_json ? JSON.stringify(data) : data).toString();
    db.query("DELETE FROM params WHERE nom = ?", [param], function() {
      db.query("INSERT INTO params (nom, value) VALUES (?, ?)", [param, data], function() {
        func();
      });
    });
  };

  module.exports = utils;
})();