let templates = {};

function onUrlChange() {
    console.log("route change: " + location.hash);
    // check for homepage default
    if (location.hash.length <= 1) {
        location.hash = "#/";
        return;
    }
    // if this is a valid hash
    if (location.hash.length > 1 && location.hash.startsWith("#/")) { // this is all I know to check
        // get the route
        if (location.hash == "#/") {
            // home route
            loadHome();
            return;
        }
        let route = [];
        let qpos = location.hash.indexOf("?");
        let path = "";
        if (qpos > -1)
            path = location.hash.substring(2, qpos);
        else
            path = location.hash.substring(2);
        route = path.split("/");

        // start finding routes
        if (route[0] == "forum") {
            loadForumPage(route.slice(1));
        }

    }

}

function getTemplate(url, callback) {
    let turl = "templates/" + url;
    if (templates[turl]) {
        callback(templates[turl]);
    } else {
        loadTemplateFromURL(turl, function(t) {
            templates[turl] = t;
            callback(t);
        });
    }
}

function loadTemplateFromURL(url, callback) {
    let t = document.createElement('div');
    let getter = new XMLHttpRequest();
    getter.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            t.innerHTML = this.responseText;
            callback(t);
        } else {
            if (this.readyState == 4)
                console.log("Could not fetch " + url + ", state: " + this.readyState);
        }
    };
    getter.open("GET", url, true);
    getter.send();
}

function loadHome() {
    getTemplate("home.html", function(template) {
        getGroups(function(groups) {
            let mdiv = document.getElementById("single-page-space");
            mdiv.innerHTML = "";
            for (let group of groups) {
                if (group.forums && group.forums.length > 0) {
                    let fgs = template.getElementsByClassName("forum-group");
                    for (fgsi of fgs) {
                        fgsz = fgsi.cloneNode(true);
                        mdiv.appendChild(fgsz);
                        let fgt = fgsz.getElementsByClassName("forum-group-title");
                        for (fgti of fgt) {
                            fgti.innerHTML = group.title + fgti.innerHTML;
                        }

                        // load each forum title, stats, and subforums
                        let fs = template.getElementsByClassName("forum-bar");
                        if (fs.length > 0) {
                            fgsz.removeChild(fgsz.getElementsByClassName("forum-bar")[0]);
                            for (let forum of group.forums) {
                                let fsz = fs[0].cloneNode(true);
                                fgsz.appendChild(fsz);
                                let fst = fsz.getElementsByClassName("forum-bar-title");
                                for (let fsti of fst) {
                                    fsti.innerHTML = forum.title;
                                    fsti.href = "#/forum/" + forum.id;
                                }
                                let fsfn = fsz.getElementsByClassName("forum-bar-threads");
                                if (fsfn.length > 0) {
                                    fsfn[0].innerHTML = forum.threadnum;
                                }
                                let fspn = fsz.getElementsByClassName("forum-bar-posts");
                                if (fspn.length > 0) {
                                    fspn[0].innerHTML = forum.posts;
                                }
                                let fssfs = fsz.getElementsByClassName("forum-bar-sub");
                                if (fssfs.length > 0) {
                                    if (!forum.subforums || forum.subforums.length == 0) {
                                        fssfs[0].parentNode.removeChild(fssfs[0]);
                                    } else {
                                        let fssfi = template.getElementsByClassName("sub-forum-bar")
                                        if (fssfi.length > 0) {
                                            fssfs[0].removeChild(fssfs[0].getElementsByClassName("sub-forum-bar")[0]);
                                            for (let subforum of forum.subforums) {
                                                let fssfz = fssfi[0].cloneNode(true);
                                                fssfz.innerHTML = subforum.title;
                                                fssfz.href = "#/forum/" + forum.id + "/" + subforum.id;
                                                fssfs[0].appendChild(fssfz);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
}

function loadForumPage(forumpath) {
    getTemplate("forum.html", function(template) {
        getForum(forumpath, function(data) {
            let mdiv = document.getElementById("single-page-space");
            mdiv.innerHTML = template.innerHTML;
            let ptitles = mdiv.getElementsByClassName("forum-page-title");
            for (let pt of ptitles) { pt.innerHTML = data.name; }

            //subforums
            let sfboxes = mdiv.getElementsByClassName("sub-forum-box");
            for (let sfbox of sfboxes) {
                let sfbars = sfbox.getElementsByClassName("forum-title-bar");
                let sfbartemp = null;
                if (sfbars.length > 0) sfbartemp = sfbars[0];
                for (let sfbar of sfbars) {
                    sfbox.removeChild(sfbar);
                }
                if (data.subforums && data.subforums.length > 0 && sfbartemp) {
                    for (datasf of data.subforums) {
                        let sfbariter = sfbartemp.cloneNode(true);
                        sfbox.appendChild(sfbariter);
                        let sftitles = sfbariter.getElementsByClassName("forum-bar-title");
                        for (let sftitle of sftitles) {
                            sftitle.innerHTML = datasf.title;
                        }
                        let sfsubs = sfbariter.getElementsByClassName("forum-bar-sub");
                        for (let sfsub of sfsubs) {
                            let sfsubbars = sfsub.getElementsByClassName("sub-forum-bar");
                            let sfsubbartemp = null;
                            if (sfsubbars.length > 0) sfsubbartemp = sfsubbars[0];
                            for (let sfsubbar of sfsubbars) {
                                sfsub.removeChild(sfsubbar);
                            }
                            if (datasf.subforums && datasf.subforums.length > 0 && sfsubbartemp) {
                                for (let datasfbar of datasf.subforums) {
                                    let sfsubbariter = sfsubbartemp.cloneNode(true);
                                    sfsub.appendChild(sfsubbariter);
                                    sfsubbariter.innerHTML = datasfbar.title;
                                }
                            } else {
                                sfsub.parentNode.removeChild(sfsub);
                            }
                        }
                        let sfps = sfbariter.getElementsByClassName("forum-bar-posts");
                        for (let sfp of sfps) { sfp.innerHTML = datasf.posts; } 
                        let sfts = sfbariter.getElementsByClassName("forum-bar-threads");
                        for (let sft of sfts) { sft.innerHTML = datasf.threadnum; } 
                    }
                }
            }

            // threads
            let tboxes = mdiv.getElementsByClassName("thread-box");
            for (let tbox of tboxes) {
                let tbars = tbox.getElementsByClassName("thread-bar");
                let tbartemp = null;
                if (tbars.length > 0) tbartemp = tbars[0].cloneNode(true);
                for (let tbar of tbars) tbar.parentElement.removeChild(tbar);
                if (data.threads && data.threads.length > 0 && tbartemp) {
                    for (let threaddata of data.threads) {
                        let tbariter = tbartemp.cloneNode(true);
                        tbox.appendChild(tbariter);
                        let tbartitles = tbariter.getElementsByClassName("thread-title");
                        for (let tbartitle of tbartitles) {
                            tbartitle.innerHTML = threaddata.title;
                        }
                        let tbarposts = tbariter.getElementsByClassName("thread-posts");
                        for (let tbarpost of tbarposts) tbarpost.innerHTML = threaddata.posts;
                        let tbarviews = tbariter.getElementsByClassName("thread-views");
                        for (let tbarview of tbarviews) tbarview.innerHTML = threaddata.views;
                        let tbarlasts = tbariter.getElementsByClassName("thread-last-post");
                        for (let tbarlast of tbarlasts) tbarlast.innerHTML = threaddata.last;
                    }
                }
            }
        });
    });
}

window.onhashchange = onUrlChange;

// perform an initial load
onUrlChange();