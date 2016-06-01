(function() {
  var sections = ['hot', 'trending', 'fresh', 'funny', 'nsfw', 'wtf', 'gif', 'geeky', 'meme', 'cute', 'comic', 'cosplay', 'food', 'girl', 'timely', 'design'],
    currentSection = location.pathname.replace('/', '') == '' ? 'hot' : location.pathname.replace('/', ''),
    popFlag = false;

  var popUpHtml = '<div onclick= {{url}} id=9tagPopUp style="position:fixed; cursor:pointer; top:60px;right:20px;z-index:1; height:48px; width:340px; box-shadow : 0 2px 4px rgba(0, 0, 0, 0.35);background-color: #1ba1e2;color:white;font-family: Segoe UI, Open Sans, sans-serif, serif;font-size: 16px;"> <div style="float:left; display:inline;width:17%"> <img src=' + chrome.extension.getURL("icons/icon48.png ") + ' alt="9TAG" /> </div> <div style="float:left; display:inline;width:83%"> <span style="margin: 0px 0px;position:relative;top:2px; ">Click to continue your last session&nbsp;&nbsp; <p style="float:left;display: inline;margin: 0px 0px;">Posts browsed: <span style= "text-decoration:underline">{{count}}</span></p> </div> </div>';

  if ($.inArray(currentSection, sections) > -1) {


    var prevArticles = [];

    chrome.storage.sync.get(currentSection, function(result) {
      if (result[currentSection] != null && result[currentSection] != 'undefined') {
        prevArticles = result[currentSection];

        var url = "http://9gag.com/" + currentSection + "?";
        prevArticles.forEach(function(data) {
          url += "id=" + data + "%2C";
        });
        popUpHtml = popUpHtml.replace("{{url}}", "document.location.href='" + url + "'");

        chrome.storage.sync.get('postCount', function(result) {
          popUpHtml = popUpHtml.replace("{{count}}", result["postCount"]);
          if (location.href.indexOf("id") == -1)
            $(popUpHtml).insertAfter(".badge-sticky-subnav-static");
        });
      } else {
        popUpHtml = popUpHtml.replace("Click to continue your last session", "Welcome to 9TAG. Go Fun Yourself!");
        chrome.storage.sync.get('postCount', function(result) {
          if (result["postCount"] == null || result["postCount"] == undefined)
            result["postCount"] = 0;
          popUpHtml = popUpHtml.replace("{{count}}", result["postCount"]);
          $(popUpHtml).insertAfter(".badge-sticky-subnav-static");

        });

      }
    });





    var articles = $('section article');

    var recent = articles.first().data('entry-id');
    if (typeof recent != 'undefined')
      storeArticle(recent, currentSection);

    $(window).bind("scroll", function() {
      var id = articles.withinviewportbottom().last().data('entry-id');

      if (typeof id != 'undefined' && id != recent) {
        recent = id;
        storeArticle(id, currentSection);
      }

      if ($(window).scrollTop() > 3000 && popFlag == false) {
        $("#9tagPopUp").fadeOut();
        popFlag = true;
      }
    });

    function storeArticle(id, section) {
      prevArticles.unshift(id);

      while (prevArticles.length > 3)
        prevArticles.pop();

      var obj = {};
      obj[section] = prevArticles;

      chrome.storage.sync.set(obj);
    }

    var target = document.querySelector('.badge-entry-collection');

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        articles = $('section article');
      });
    });

    // configuration of the observer:
    var config = {
      childList: true,
    }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);


  }

})();


// $('section article').appear();
//
// $(document.body).on('disappear', 'section article', function(e, $affected) {
//   var id = $affected.data('entry-id'),
//       section = location.pathname.replace('/','');
//
//   console.log(storeArticle(id,section));
//   //console.log($affected.data('entry-id'));
// });
