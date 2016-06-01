var lStorage = {};
var sections = ['hot', 'trending', 'fresh', 'funny', 'nsfw', 'wtf', 'gif', 'geeky', 'meme', 'cute', 'comic', 'cosplay', 'food', 'girl', 'timely', 'design'];

var autoRedirect = "false";

//Cache storing of articles data
sections.forEach(function(data) {
  lStorage[data] = [];
  chrome.storage.sync.get(data, function(result) {
    lStorage[data] = result[data];
  });
});


//On change of data
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    sections.forEach(function(data) {
      if (data == key){
        lStorage[key] = storageChange.newValue;

        chrome.storage.sync.get('postCount', function(result) {
          var incCount = parseInt(result["postCount"]) + 1;
          chrome.storage.sync.set({'postCount': incCount});
        });
      }
    });
    if(key =="autoRedirect")
      autoRedirect = storageChange.newValue;
  }
});


//Default
chrome.storage.sync.set({'autoRedirect': 'false'});

chrome.storage.sync.get("postCount",function(data){
  if(data["postCount"] == undefined)
    chrome.storage.sync.set({'postCount': 0});
})


chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (autoRedirect == 'true' && details.frameId == 0) {
    var url = details.url,
      currentSection = "";


    for (var i = 0; i < sections.length; i++) {
      if (url.indexOf(sections[i]) > -1 && url.indexOf("id") == -1) {
        currentSection = sections[i];
        break;
      }
    }

    if (url.endsWith(".com") || url.endsWith(".com/"))
      currentSection = "hot";



    if (currentSection != "") {
      url = "http://9gag.com/" + currentSection + "?";
      lStorage[currentSection].forEach(function(data) {
        url += "id=" + data + "%2C";
      });



      return {
        redirectUrl: url
      }
    }
  }


}, {
  urls: [
    "*://*.9gag.com/*"
  ],
  types: ["main_frame"]
}, ["blocking"]);



chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: "jquery.js"
  }, function() {
    chrome.tabs.executeScript(details.tabId, {
      file: "jquery.withinviewport.js"
    }, function() {
      chrome.tabs.executeScript(details.tabId, {
        file: "inject.js"
      })
    });
  });
}, {
  url: [{
    hostContains: '9gag.com'
  }]
});
