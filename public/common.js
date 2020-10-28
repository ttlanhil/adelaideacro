function build_accordions() {
    var accordions = document.getElementsByClassName("accordion");

    for (var i = 0; i < accordions.length; i++) {

        let entries = accordions[i].children;

        var firstTag = entries[0].tagName;
        var accordion_header;
        if ( firstTag.match(/^h\d/i) ){
            accordion_header = entries[0];
            entries = Array.from(entries).slice(1);
        }

        for (var j = 0; j < entries.length; j++) {
            entries[j].onclick = function () { this.classList.toggle("open") };
        }

        if ( accordion_header ){
            accordion_header.classList.add("accordion-header");

            var header_controls = document.createElement("div");
            header_controls.className = "header-controls";

            var open_all = document.createElement("span");
            open_all.innerText = "Open All";
            open_all.onclick = function () {entries.forEach(element => element.classList.add("open"))}

            var close_all = document.createElement("span");
            close_all.innerText = "Close All";
            close_all.onclick = function () {entries.forEach(element => element.classList.remove("open"))}


            header_controls.appendChild(open_all);
            header_controls.append(" / ")
            header_controls.appendChild(close_all);

            accordion_header.appendChild(header_controls);
        }
    }
}


window.onload = function() {
    build_accordions();
    if ( ! document.location.hash ) {
        document.location.hash = "#home";
    }
    document.body.classList.add("havejs");
}
