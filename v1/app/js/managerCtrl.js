"use strict";app.controller("managerCtrl",["$scope","$timeout","$filter","toastFact","$mdDialog","$mdBottomSheet","persistContainer","$mdToast",function(e,n,o,t,r,i,s,c){function a(e,n,t){return e+" S"+o("numberFixedLen")(n,2)+"E"+o("numberFixedLen")(t,2)}function d(n){for(var o=e.loadedEpisode.length-1;o>=0;o--)e.loadedEpisode[o]===n&&e.loadedEpisode.splice(o,1)}function l(n){for(var o=e.loadedFilm.length-1;o>=0;o--)e.loadedFilm[o]===n&&e.loadedFilm.splice(o,1)}function u(e){return new Promise(function(n,o){h.query("SELECT * FROM search_for_torrent WHERE origin = ?",[e.show.title],function(o,t){var r=t.length>0?t[0][2]:e.show.title;n(a(r,e.season,e.episode))})})}e.$watch("selectedTabManagerIndex",function(e,o){switch(e){case 2:n(function(){$("input#recherche_rapide")[0].focus()},100)}}),n(function(){ipc.send("dom-ready")},0);var h=s.apiDB,p=s.apiTR,f=s.apiBT,E=s.apiTO,w=s.apiAD,m=s.apiT4;s.apiRB;e.user=f.user,e.episodesUnseen=f.episodesUnseen,e.episodesIncoming=e.episodesIncoming||{},e.loadedEpisode=[],e.loadedFilm=[],e.synchroAll=function(){e.synchroEpisodesUnseen(),e.synchroFilmUnseen()},e.synchroEpisodesUnseen=function(){e.synchroInProgress=!0,f.synchroEpisodesUnseen(function(n){e.episodesUnseen=f.episodesUnseen,e.$apply(),n?(t.show("Synchronisation terminée"),$.each(e.episodesUnseen.shows,function(e,n){h.query("SELECT * FROM search_for_torrent WHERE origin = ?",[n.title],function(e,o){o.length>0&&o[0][2]!=n.title&&(n.torrentName=o[0][2])}),h.query("SELECT * FROM search_for_sub WHERE origin = ?",[n.title],function(e,o){o.length>0&&o[0][2]!=n.title&&(n.subName=o[0][2])})})):t.show("Synchronisation échouée"),e.synchroInProgress=!1,e.$apply()})},e.synchroFilmUnseen=function(){f.synchroFilmUnseen().then(function(n){e.filmsUnseen=f.filmsUnseen,e.$apply()})},e.downloadEpisode=function(n){e.loadedEpisode.push(n.id),u(n).then(function(e){E.searchAndDownload(e,s.episodeQuality).then(function(){t.show("Torrent ajouté !"),d(n.id)},function(){t.show("Aucun torrent trouvé !"),d(n.id)})})},e.redirectDownload=function(n){u(n).then(function(n){e.recherche_rapide=n,e.recherche_change(),e.selectedTabManagerIndex=3})},e.redirectDownloadFilm=function(n){e.recherche_rapide=n.original_title,e.recherche_change(),e.selectedTabManagerIndex=3},e.downloadStr=function(n){e.loadedEpisode.push(n.id),h.query("SELECT * FROM search_for_sub WHERE origin = ?",[n.show.title],function(e,o){var r=o.length>0?o[0][2]:n.show.title,i=a(r,n.season,n.episode);w.search(i,function(e){""!=e?utils.getParam(h,"strFolder",function(o){w.downloadStr(e,i.trim(),o,function(){t.show("Sous-titre récupéré"),d(n.id)},function(){t.show("Erreur lors de la récupération des sous-titres"),d(n.id)})}):(t.show("Sous-titres non trouvés"),d(n.id))})})},e.downloadStrFilm=function(n){e.loadedFilm.push(n.id),w.search(n.original_title,function(e){""!=e?utils.getParam(h,"strFolder",function(o){w.downloadStr(e,n.original_title.trim(),o,function(){t.show("Sous-titre récupéré"),l(n.id)},function(){t.show("Erreur lors de la récupération des sous-titres"),l(n.id)})}):(t.show("Erreur lors de la récupération des sous-titres"),l(n.id))})},e.redirectStr=function(e){h.query("SELECT * FROM search_for_sub WHERE origin = ?",[e.show.title],function(n,o){var t=o.length>0?o[0][2]:e.show.title,r=a(t,e.season,e.episode);w.openUrl(r)})},e.redirectStrFilm=function(e){w.openUrl(e.original_title)},e.seenEpisode=function(n,o){var t=e.episodesUnseen.shows[n].unseen[o];e.loadedEpisode.push(t.id),f.seenEpisode(t,function(){c.show(c.simple().textContent("Episode marqué comme vu").action("Annuler").highlightAction(!1).position("bottom right")).then(function(n){"ok"==n&&f.unseenEpisode(t,function(){e.synchroAll()})}),e.episodesUnseen.shows[n].unseen.splice(o,1),0==e.episodesUnseen.shows[n].unseen.length&&e.episodesUnseen.shows.splice(n,1),d(t.id),e.$apply()})},e.changeTarget=function(e,n){var o=function(e,n,o){""!=n.trim()?h.query("DELETE FROM "+o+" WHERE origin = ?",[e],function(){h.query("INSERT INTO "+o+" (origin, target) VALUES (?,?)",[e,n],function(){})}):h.query("DELETE FROM "+o+" WHERE origin = ?",[e],function(){})};r.show({controller:"ModalChangeTargetCtrl",templateUrl:"partial/modal_change_target.html",targetEvent:e,clickOutsideToClose:!0,resolve:{origin:function(){return n},apiDB:function(){return h}}}).then(function(e){o(n,e.torrentName,"search_for_torrent"),o(n,e.subName,"search_for_sub")})},e.showListBottomSheet=function(n,o,t){e.alert="",i.show({templateUrl:"partial/bottom-sheet-list-template.html",controller:"ListBottomSheetCtrl",resolve:{episode:function(){return t}}}).then(function(r){"seen"==r&&e.seenEpisode(n,o),"download"==r&&e.downloadEpisode(t),"str"==r&&e.downloadStr(t)})},n(function(){!e.user.token&&justOpen&&(f.connectToApi(function(n){e.user=f.user,e.user.done=!0,f.user.token?t.show("Connecté à Betaseries"):t.show("Identifiants Betaseries incorrect","error"),e.$apply(),e.synchroInProgress||e.synchroAll()}),p.connectToApi(function(n){n?t.show("Connecté à Transmission"):t.show("Erreur lors de la connection à Transmission","error"),e.$apply()}),m.connectToApi(function(){m.t411Client.token?t.show("Connecté à T411"):t.show("Erreur lors de la connection à T411","error")}),justOpen=!1)},0),e.recherche_rapide="",e.torrents=[],e.showSpinnerRechercheRapide=!1,e.recherche_change=function(){e.recherche_rapide.length>2?(e.showSpinnerRechercheRapide=!0,E.getTorrentsWithSearch(e.recherche_rapide,function(n){e.showSpinnerRechercheRapide=!1,e.torrents=n,e.$$phase||e.$apply()})):(e.showSpinnerRechercheRapide=!1,e.torrents=[])},e.downloadTorrent=function(e){E.download(e.torrentLink,e.tracker).then(function(){t.show("Torrent ajouté !")})}}]);