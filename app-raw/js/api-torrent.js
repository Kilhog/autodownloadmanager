(function() {
  "use strict";

  var shell = require('shell');
  var _ = require('underscore');

  function apiTorrent(apiTR, apiT4, apiGS, apiKA, apiRB) {
    this.apiTR = apiTR;
    this.allTO = {apiT4, apiGS, apiKA, apiRB};
  }

  apiTorrent.prototype.searchAndDownload = function(query, episodeQuality) {
    var self = this;

    return new Promise(
      function (resolve, reject) {
        self.callApiTracker(query, episodeQuality).then(function(torrentLink) {
          self.download(torrentLink);
          resolve();
        }, reject);
      }
    );
  };

  apiTorrent.prototype.callApiTracker = function(query, episodeQuality) {
    var self = this;

    return new Promise(
      function (resolve, reject) {

        var nbCall = 2,
          nbCallDone = 0,
          currentBestTorrent = null;

        var handleResponse = function(torrent) {
          nbCallDone += 1;

          if(torrent && ((currentBestTorrent && currentBestTorrent.seeds < torrent.seeds) || !currentBestTorrent) && torrent.torrentLink) {
            currentBestTorrent = torrent;
          }

          if(nbCall === nbCallDone && currentBestTorrent) {
            resolve(currentBestTorrent.torrentLink);
          } else if (nbCall === nbCallDone) {
            reject();
          }
        };

        self.allTO.apiKA.searchTheBest(query, episodeQuality).then(handleResponse, handleResponse);
        self.allTO.apiGS.searchTheBest(query, episodeQuality).then(handleResponse, handleResponse);
      }
    );
  };

  apiTorrent.prototype.download = function(torrentLink, torrentTracker) {
    var self = this;

    return new Promise(
      function(resolve, reject) {
        if(torrentTracker == "t411") {
          self.allTO.apiT4.downloadTorrent(torrentLink).then(function(path) {
            if(self.apiTR.transmission_obj) {
              self.apiTR.addFile(path).then(resolve);
            } else {
              shell.openItem(path);
              reject();
            }
          }, reject);
        } else {
          if(self.apiTR.transmission_obj) {
            self.apiTR.addUrl(torrentLink, function() {
              resolve();
            });
          } else {
            shell.openExternal(torrentLink);
            reject();
          }
        }
      }
    )
  };

  apiTorrent.prototype.getTorrentsWithSearch = function(query, func) {
    var self = this;
    var torrents = [];

    var updateListTorrents = function(new_torrents) {
      torrents = _.chain(torrents).union(new_torrents).uniq().sortBy(function(torrent){return torrent.seeds * -1}).value();
      func(torrents);
    }

    _.each(self.allTO, function(api) {
      api.searchAll(query).then(updateListTorrents, function() {});
    });
  };

  module.exports = apiTorrent;
})();
