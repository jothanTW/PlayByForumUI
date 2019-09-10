function getGroups(callback) {


    let url = "testdata/testgroups.json";
    
    
    let getter = new XMLHttpRequest();
    getter.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        } else {
            if (this.readyState == 4)
                console.log("Could not fetch " + url + ", status: " + this.status);
        }
    };
    getter.open("GET", url, true);
    getter.send();
}

function getForum(forumpath, callback) {


    let url = "testdata/testforum.json";
    
    
    let getter = new XMLHttpRequest();
    getter.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        } else {
            if (this.readyState == 4)
                console.log("Could not fetch " + url + ", status: " + this.status);
        }
    };
    getter.open("GET", url, true);
    getter.send();
}