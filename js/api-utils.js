(function() {


  function utils() {

  }

  utils.getParam = function(db, param, func, is_json) {
    db.query("SELECT * FROM params WHERE nom = ?", [param], function(err, rows) {
      if (rows.length > 0) {
        func(is_json ? JSON.parse(rows[0][2]) : rows[0][2]);
      } else {
        func(is_json ? {} : undefined);
      }
    });
  };

  utils.setParam = function(db, param, data, func, is_json) {
    db.query("DELETE FROM params WHERE nom = ?", [param], function() {
      db.query("INSERT INTO params (nom, value) VALUES (?, ?)", [param, is_json ? JSON.stringify(data) : data], function() {
        func();
      });
    });
  };

  module.exports = utils;
})();