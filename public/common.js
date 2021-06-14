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
    // add needed code/styles for the accordions
    build_accordions();

    // remove "display:initial" from homepage, then jump to homepage <section>
    // allows page to still work reasonably well with JS disabled
    document.getElementById("home").removeAttribute("style");
    if ( ! document.location.hash ) {
        // check page name, and if it matches a section, jump to that section (e.g. contact.html)
        // get filename without leading paths, and without extension
        let path = document.location.pathname.replace(/^.*\//, "").replace(/\.\w+$/, "");
        if (document.getElementById(path)) {
            document.location.hash = "#" + path;
        } else {
            document.location.hash = "#home";
        }
    }

    // add havejs class to body, used for some of the CSS
    document.body.classList.add("havejs");

    // embed map into location tab
    document.getElementById("map-wrapper-pointa").innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.0998022008152!2d138.60451631564402!3d-34.92903388037659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0ced3a9f810f1%3A0xee378ea10f89cdec!2sPoint%20A!5e0!3m2!1sen!2sau!4v1603861345027!5m2!1sen!2sau" width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>';

    document.getElementById("map-wrapper-circobats").innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.640083183772!2d138.5711040154073!3d-34.965628580367294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0cf6fb4dc6ea1%3A0xd1ed9ab650c0c254!2sCircoBats%20-%20Community%20Circus!5e0!3m2!1sen!2sau!4v1623649195787!5m2!1sen!2sau" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
}
