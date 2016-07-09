document.addEventListener('DOMContentLoaded', event => {
    Array.from(document.getElementsByClassName('language-caddy-syntax')).forEach(item => {
        let html = item.innerHTML;
        html = html.replace(/(#.+)/g, `<span class="hl-comment">$1</span>`);
        html = html.replace(/^(\w+)/gm, `<span class="hl-directive">$1</span>`);
        html = html.replace(/^(<span class="hl-directive">\w+<\/span>[\t ]+)([\S ]+[^ {])/gm, `$1<span class="hl-arg"><i>$2</i></span>`)
        html = html.replace(/^([\t ]+)(\S+)/gm, `$1<span class="hl-subdirective">$2</span>`)
        //html = html.replace(/([\/\.\*\w]+)(?![^<]*>|[^<>]*<\/)/gmi, `<span class="hl-arg">$1</span>`)

        console.log(html)


        item.innerHTML = html;
    });

    Array.from(document.getElementsByClassName('language-caddy')).forEach(item => {
        let html = item.innerHTML;
        html = html.replace(/(#.+)/g, `<span class="hl-comment">$1</span>`);
        html = html.replace(/^(\w+)/gm, `<span class="hl-directive">$1</span>`);
        html = html.replace(/^(<span class="hl-directive">\w+<\/span>[\t ]+)([\S ]+[^ {])/gm, `$1<span class="hl-arg">$2</span>`)
        html = html.replace(/^([\t ]+)(\S+)/gm, `$1<span class="hl-subdirective">$2</span>`)
        //html = html.replace(/([\/\.\*\w]+)(?![^<]*>|[^<>]*<\/)/gmi, `<span class="hl-arg">$1</span>`)

        console.log(html)


        item.innerHTML = html;
    });
});
