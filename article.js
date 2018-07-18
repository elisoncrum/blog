var i = 1;
var exists = new Array();
while (true){
    var file_name = "articles/" + i + ".article";
    if (doesFileExist(file_name)){
        exists.push(file_name);
    } else {
        break;
    }
    i++;
}
for (var x = i - 1; x > 0; x--){
    readFile("articles/" + x + ".article");
}

function copyToClipboard(x) {

    var item = document.getElementsByClassName(x)[0];
    item.setAttribute("class", "far fa-check-square fa-3x " + x);
    var aux = document.createElement("input");
    aux.setAttribute("value", window.location.href.split("/")[2] + "/#" + x);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  
}

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function readFile(file) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    fetch(file)
        .then(response => response.text())
        .then(
            text => {
                var lines = text.split("\n");
                var re = new RegExp("^```(h1|h2|h3|p)$");
                var article = document.createElement("article");
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].trim()
                    if (lines[i].length == 1) { continue; }
                    if (i == 0){
                        article.id = lines[i];
                    } else if (i == 1) {
                        var time = document.createElement("TIME");
                        time.id = lines[i];
                        var date = time.id.split("-");
                        var time_a = document.createElement("a");
                        time_a.id = "no-shadow";
                        time_a.href = "#" + lines[i];
                        time_a.innerHTML = monthNames[parseInt(date[0]) - 1] + " " + date[1] + ", 20" + date[2];
                        time.appendChild(time_a);
                    } else if (re.test(lines[i]) == true){
                        var tag = lines[i].replace('```', '');
                        var index = i + 1;
                        var content = "";
                        while (lines[index].trim() != "```"){
                            content += lines[index];
                            index++;
                        }
                        //possibly make a better engine for formatting?
                        content = content.replace(/([\*]{3})(.*?)([\*]{3})/g, "<b><i>$2</i></b>");
                        content = content.replace(/([\*]{2})(.*?)([\*]{2})/g, "<b>$2</b>");
                        content = content.replace(/([\*]{1})(.*?)([\*]{1})/g, "<i>$2</i>");
                        content = content.replace(/((\!\()(.*?)(\)))((\[)(.*?)(\]))/g, "<a href=\"$7\">$3</a>");
                        var page = document.createElement(tag);
                        if (tag == "h1"){
                            pageLink = document.createElement("a");
                            pageLink.href = "#" + article.id;
                            pageLink.innerHTML = content;
                            page.appendChild(pageLink);
                            article.appendChild(page); 
                        } else {
                            page.innerHTML = content;
                            article.appendChild(page);
                        }
                    } else if (lines[i][0] == '!'){
                        var src_path = lines[i].substring(
                            lines[i].lastIndexOf("[") + 1, 
                            lines[i].lastIndexOf("]")
                        );

                        var cap = lines[i].substring(
                            lines[i].lastIndexOf("(") + 1, 
                            lines[i].lastIndexOf(")")
                        );

                        var figure = document.createElement("figure");
                        figure.className = "size-3";
                        var image = document.createElement("img");
                        image.src = src_path;

                        var caption = document.createElement("figcaption");
                        caption.innerHTML = cap;
                        
                        figure.appendChild(image);
                        article.appendChild(figure);
                        article.appendChild(caption);
                    }
                    
                }
                var div = document.createElement("div");
                div.setAttribute("class", "share");
                var share = document.createElement("a");
                share.id = "no-shadow";
                //data-original-title="Some tooltip text!"
                share.setAttribute("data-toggle", "tooltip");
                share.setAttribute("data-original-title", "Copy blog link")
                share.setAttribute("onclick", "copyToClipboard(\'" + article.id + "\')");
                
                var icon = document.createElement("i");
                icon.setAttribute("class", "far fa-copy fa-3x " + article.id);
                share.appendChild(icon);
                div.appendChild(share)
                article.appendChild(div);

                //<a href="#" id="social-cog" ><i class="fas fa-cog fa-3x social"></i></a>
                article.insertBefore(time, article.childNodes[2]);
                document.body.appendChild(article);

            }
        )
}