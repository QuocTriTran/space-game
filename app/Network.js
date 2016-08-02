var HIGHSCORE_SERVER_BASE_URL = "http://localhost:8000";

var OFFLINE_TEST_MODE = true;

var Network = function() {
    var testData = [
        {"id":1, "player": "Superstar McAwesome","score":999999,"level":99},
        {"id":2, "player": "Awesomestar McSuper","score":781287,"level":87},
        {"id":3, "player": "Galactic Megastar","score":612735,"level":74},
        {"id":4, "player": "Starlord","score":572398,"level":68},
        {"id":5, "player": "Captain Sweatpants","score":512387,"level":63},
        {"id":6, "player": "Space Cowboy","score":498124,"level":55},
        {"id":7, "player": "Galaxy President","score":417615,"level":47},
        {"id":8, "player": "Rakete","score":381726,"level":41},
        {"id":9, "player": "Kosmonaut","score":291876,"level":36},
        {"id":10,"player": "Astronaut","score":198417,"level":25}
    ];

    function getTop10(successCallback) {
        if (OFFLINE_TEST_MODE) {
            successCallback(testData);
        } else {
            $.get(HIGHSCORE_SERVER_BASE_URL + "/api/1/highscore", function (data) {
                // TODO
                
                if (successCallback !== undefined) {
                    successCallback(data);
                }
            });
        }
    }
    
    function postNewScore(score) {
        if (OFFLINE_TEST_MODE) {
            console.log("network: posting new score is not available in offline test mode");
        } else {
            $.ajax({
                type: "POST",
                url: HIGHSCORE_SERVER_BASE_URL + "/api/1/highscore",
                contentType: "application/json; charset=utf-8",
                data: score,
                dataType: "json",
                success: function(data) {
                    // TODO
                },
                failure: function(error) {
                    // TODO
                }
            });
        }   
        
    }
    
    return {
        getTop10: getTop10,
        postNewScore: postNewScore
    }

};