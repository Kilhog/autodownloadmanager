(function() {
  "use strict";

  var shell = require('shell');
  var _ = require('underscore');

  function apiTorrent(apiTR, apiT4, apiGS, apiKA, apiRB) {
    this.apiTR = apiTR;
    this.apiT4 = apiT4;
    this.apiGS = apiGS;
    this.apiKA = apiKA;
    this.apiRB = apiRB;
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

          if(torrent && ((currentBestTorrent && currentBestTorrent.seeds < torrent.seeds) || !currentBestTorrent)) {
            currentBestTorrent = torrent;
          }

          if(nbCall === nbCallDone && currentBestTorrent) {
            resolve(currentBestTorrent.torrentLink);
          } else if (nbCall === nbCallDone) {
            reject();
          }
        };

        self.apiKA.searchTheBest(query, episodeQuality).then(handleResponse, handleResponse);
        self.apiGS.searchTheBest(query, episodeQuality).then(handleResponse, handleResponse);
      }
    );
  };

  apiTorrent.prototype.download = function(torrentLink, torrentTracker) {
    var self = this;

    return new Promise(
      function(resolve, reject) {
        if(torrentTracker == "t411") {
          self.apiT4.downloadTorrent(torrentLink).then(function(path) {
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

    self.apiKA.searchAll(query).then(updateListTorrents, function() {});
    self.apiGS.searchAll(query).then(updateListTorrents, function() {});
    self.apiT4.searchAll(query).then(updateListTorrents, function() {});
    self.apiRB.searchAll(query).then(updateListTorrents, function() {});
  };

  module.exports = apiTorrent;
})();
