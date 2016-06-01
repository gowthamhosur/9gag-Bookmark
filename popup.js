  chrome.storage.sync.get('autoRedirect', function(result) {
    document.getElementById("chkAutoRedirect").checked = result["autoRedirect"] == "true" ? true : false;
  });

  document.getElementById("chkAutoRedirect").onclick = function() {
    chrome.storage.sync.set({
      'autoRedirect': this.checked + ""
    });
  }

  chrome.storage.sync.get('postCount', function(result) {
    document.getElementById("count").innerHTML = result["postCount"];
  });
