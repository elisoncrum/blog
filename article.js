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
function changeCss() {
    var style = document.getElementById("theme");
    var theme = style.getAttribute("value");
    if (theme == "dark"){
        theme = "light";
    } else {
        theme = "dark";
    }
    style.setAttribute("value", theme)
    style.setAttribute("href", "styles/article-text-" + theme + ".css");

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

function createSlideshow(captions, paths){
    let outer_figure = document.createElement("figure");
    outer_figure.setAttribute("class", "size-3");

    let carousel = document.createElement("div");
    carousel.id = "carouselControls";
    carousel.setAttribute("class", "carousel slide");
    carousel.setAttribute("data-interval", "false");
    carousel.setAttribute("data-ride", "carousel");

    let carousel_inner = document.createElement("div");
    carousel_inner.setAttribute("class", "carousel-inner");

    let indicators = document.createElement("ol");
    indicators.setAttribute("class", "carousel-indicators");

    let next = document.createElement("a");
    next.setAttribute("role", "button");
    next.setAttribute("class", "carousel-control-next")
    next.setAttribute("data-slide", "next");
    next.href = "#carouselControls";

    let prev = document.createElement("a");
    prev.setAttribute("role", "button");
    prev.setAttribute("data-slide", "prev");
    prev.setAttribute("class", "carousel-control-prev")
    prev.href = "#carouselControls";

    let prev_control_icon = document.createElement("span");
    prev_control_icon.href = "carouselControls";
    prev_control_icon.setAttribute("aria-hidden", "true");
    prev_control_icon.setAttribute("class", "carousel-control-prev-icon");

    let prev_control_text = document.createElement("span");
    prev_control_text.setAttribute("class", "sr-only");
    prev_control_text.innerHTML = "Previous";

    let next_control_icon = document.createElement("span");
    next_control_icon.href = "carouselControls";
    next_control_icon.setAttribute("aria-hidden", "true");
    next_control_icon.setAttribute("class", "carousel-control-next-icon");

    let next_control_text = document.createElement("span");
    next_control_text.setAttribute("class", "sr-only");
    next_control_text.innerHTML = "Next";

    next.appendChild(next_control_icon);
    next.appendChild(next_control_text);

    prev.appendChild(prev_control_icon);
    prev.appendChild(prev_control_text);

    for (var i = 0; i < captions.length; i++){
        let indicator = document.createElement("li");
        indicator.setAttribute("data-target", "#carouselControls");
        indicator.setAttribute("data-slide-to", i);

        let image_div = document.createElement("div");
        if (i == 0){
            image_div.setAttribute("class", "carousel-item active");
            indicator.setAttribute("class", "active");
        } else {
            image_div.setAttribute("class", "carousel-item");
        }

        let image = document.createElement("img");
        image.setAttribute("class", "d-block w-100");
        let caption_div = document.createElement("div");
        caption_div.setAttribute("class", "carousel-caption d-none d-md-block");

        let caption = document.createElement("h5");
        caption.innerHTML = captions[i];

        caption_div.appendChild(caption);

        image_div.appendChild(caption_div);
        image.src = paths[i];
        image.alt = "Slide show image " + i;

        image_div.appendChild(image);
        carousel_inner.appendChild(image_div);

        indicators.appendChild(indicator);
    }
    carousel.appendChild(carousel_inner);
    carousel.appendChild(indicators);
    carousel.appendChild(next);
    carousel.appendChild(prev);
    outer_figure.appendChild(carousel);
    return outer_figure;
}

function readFile(file) {
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    fetch(file)
        .then(response => response.text())
        .then(
            text => {
                let lines = text.split("\n");
                let re = new RegExp("^```(h1|h2|h3|p)$");
                let article = document.createElement("article");
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].trim()
                    if (lines[i].length == 1) { continue; }
                    if (i == 0){
                        article.id = lines[i];
                    } else if (i == 1) {
                        var time = document.createElement("TIME");
                        time.id = lines[i];
                        let date = time.id.split("-");
                        let time_a = document.createElement("a");
                        time_a.setAttribute("class", "no-shadow");
                        time_a.href = "#" + lines[i];
                        time_a.innerHTML = monthNames[parseInt(date[0]) - 1] + " " + date[1] + ", 20" + date[2];
                        time.appendChild(time_a);
                    } else if (re.test(lines[i]) == true){
                        let tag = lines[i].replace('```', '');
                        let index = i + 1;
                        let content = "";
                        while (lines[index].trim() != "```"){
                            content += lines[index];
                            index++;
                        }
                        //possibly make a better engine for formatting?\
                        content = content.replace(/([\_]{2})(.*?)([\_]{2})/g, "<u>$2</u>");
                        content = content.replace(/([\-]{2})(.*?)([\-]{2})/g, "<strike>$2</strike>");
                        content = content.replace(/([\*]{3})(.*?)([\*]{3})/g, "<strong><i>$2</i></strong>");
                        content = content.replace(/([\*]{2})(.*?)([\*]{2})/g, "<strong>$2</strong>");
                        content = content.replace(/([\*]{1})(.*?)([\*]{1})/g, "<i>$2</i>");
                        content = content.replace(/((\!\()(.*?)(\)))((\[)(.*?)(\]))/g, "<a href=\"$7\">$3</a>");
                        
                        let page = document.createElement(tag);
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
                        let src_path = lines[i].substring(
                            lines[i].lastIndexOf("[") + 1, 
                            lines[i].lastIndexOf("]")
                        );

                        let cap = lines[i].substring(
                            lines[i].lastIndexOf("(") + 1, 
                            lines[i].lastIndexOf(")")
                        );
                        if (src_path.split(',').length > 1){
                            let slide = createSlideshow(cap.split(','), src_path.split(','));
                            article.appendChild(slide);
                        } else {
                            let figure = document.createElement("figure");
                            figure.className = "size-3";
                            let image = document.createElement("img");
                            image.src = src_path;
    
                            let caption = document.createElement("figcaption");
                            caption.innerHTML = cap;
                            
                            figure.appendChild(image);
                            article.appendChild(figure);
                            article.appendChild(caption);
                        }
                    }
                    
                }
                let div = document.createElement("div");
                div.setAttribute("class", "share");

                let share = document.createElement("a");
                share.setAttribute("class", "no-shadow");
                share.setAttribute("data-toggle", "tooltip");
                share.setAttribute("data-original-title", "Copy blog link")
                share.setAttribute("onclick", "copyToClipboard(\'" + article.id + "\')");
                
                let icon = document.createElement("i");
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