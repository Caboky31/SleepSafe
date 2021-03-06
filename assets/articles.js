//firebase database
var config = {
    apiKey: "AIzaSyAyc2X_c36dZ7S1vqFwCbDFIggL6qr9yuM",
    authDomain: "sleepsafe-6c621.firebaseapp.com",
    databaseURL: "https://sleepsafe-6c621.firebaseio.com",
    projectId: "sleepsafe-6c621",
    storageBucket: "sleepsafe-6c621.appspot.com",
    messagingSenderId: "616346102752"
};
firebase.initializeApp(config);
var database = firebase.database();
// sleepsafe/citysearch

function buildQueryURL() {
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var authKey = { "api-key": "MxuEsc7MF40JovGDK4Q2Zx19DQ3S7iEe" };

    // user input added to search

    authKey.q = localStorage.getItem("userSearch");


    // write url to console log to test 
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(authKey));
    return queryURL + $.param(authKey);
}


function updatePage(NYTData) {

    var numArticles = 5;

    // print to console to test
    console.log(NYTData);
    console.log(NYTData.response.docs);
     database.ref().push({
        name:  localStorage.getItem("userSearch"),
        articles: NYTData.response.docs
     });
    //need to change code to have list append to whatever html is on the second page 
    for (var i = 0; i < numArticles; i++) {
        var article = NYTData.response.docs[i];

        var articleCount = i + 1;

        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        $("#resultsDiv").append($articleList);

        // headline
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'>" +
                articleCount + "." +
                "</span>" +
                "<b> " +
                headline.main +
                "</b>"
            );
        }

        // article section
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h6>Section: " + section + "</h6>");
        }

        // append and log url
        $articleListItem.append("<a href='" + article.web_url + "'>" + "Click for Article" +"</a>");
        console.log(article.web_url);

        // append article
        $articleList.append($articleListItem);

        localStorage.getItem("userSearch");
        console.log("userSearch");

    }
}

// clear articles
function clear() {
    $("#resultsDiv").empty();
}

clear();

var queryURL = buildQueryURL();

$.ajax({
    url: queryURL,
    method: "GET"
}).then(updatePage);


