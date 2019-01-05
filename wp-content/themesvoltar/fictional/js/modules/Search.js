import $ from 'jquery';//including jquery

class Search {
    //1. describe and create our object
    constructor() {
        //properties
        this.addSearchHTML();//must be the first to load; is the layer search
        this.resultsDiv = $("#search-overlay__results");
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;
    }

    // 2. events
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));//last this is to scape from this object
        this.closeButton.on("click", this.closeOverlay.bind(this));
         $(document).on("keydown", this.keyPressDispatcher.bind(this));//whole page
         this.searchField.on("keyup", this.typingLogic.bind(this)); //on is a jquery method
         //keyup demora um pouco mais q keydown
    }
    // 3. methods (function, action...) como verbos (ações)
    typingLogic() {
            if (this.searchField.val() != this.previousValue) {
                clearTimeout(this.typingTimer);//reset timer
            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                this.resultsDiv.html('<div class="spinner-loader"></div>');
                this.isSpinnerVisible = true;
            }
            this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }


            }
            this.previousValue = this.searchField.val();//val jquery method
    }

    getResults() {//see functions  wp_localize_script
        $.getJSON(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
            this.resultsDiv.html(`
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>Não há resultados para a sua pesquisa.</p>'}
                        ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
                        ${results.generalInfo.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title"></h2>
                        ${results.programs.length ? '<ul class="link-list min-list">' : `<p>Nenhum programa para a sua pesquisa. <a href="${universityData.root_url}/programs">Veja todos os programas</a></p>`}
                        ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a> </li>`).join('')}
                        ${results.programs.length ? '</ul>' : ''}

                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length ? '<ul class="professor-cards">' : `<p>Nenhum professor como resultado para a sua pesquisa.</p>`}
                        ${results.professors.map(item => `
                            <li class="professor-card__list-item">
                                <a class="professor-card" href="${item.permalink}">
                                  <img class="professor-card__image" src="${item.image}" alt="">
                                <span class="professor-card__name">${item.title}</span>
                                </a>
                            </li>
                        `).join('')}
                        ${results.professors.length ? '</ul>' : ''}

                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>Não há campus para a sua pesquisa. <a href="${universityData.root_url}/campuses">Veja todos os campus</a></p>`}
                        ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a> </li>`).join('')}
                        ${results.campuses.length ? '</ul>' : ''}

                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.events.length ? '' : `<p>Não há eventos para a sua pesquisa. <a href="${universityData.root_url}/events">Veja todos os eventos</a></p>`}
                        ${results.events.map(item => `
                            <div class="event-summary">
                              <a class="event-summary__date t-center" href="${item.permalink}">
                                <span class="event-summary__month">${item.month}</span>
                                <span class="event-summary__day">${item.day}</span>
                              </a>
                              <div class="event-summary__content">
                                <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                                <p>${item.description}<a href="${item.permalink}" class="nu gray">Leia mais</a></p>
                              </div>
                            </div>

                        `).join('')}

                    </div>
                </div>
            `);
            this.isSpinnerVisible = false;
        });
        //delete this code a bit later on;
        // $.when(
        //     $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()),
        //     $.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val())
        //     ).then((posts, pages) => {
        //     var combinedResults = posts[0].concat(pages[0]);//joins posts and pages
        //         this.resultsDiv.html(`
        //         <h2 class="search-overlay__section-title">General Info</h2>
        //         ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>Não há resultados para a sua pesquisa.</p>'}
        //             ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a> ${item.type == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
        //         ${combinedResults.length ? '</ul>' : ''}
        //     `);
        //     this.isSpinnerVisible = false;
        //     //${} será incluído js code dentro de {}; não será texto
        // }, () => {
        //     this.resultsDiv.html('<p>Erro inesperado; tente novamente.</p>');
        // }); // $ jquery; getJson function to look inside jquery obj
        //first arg: url to send data, sec arg what to do
        //ES6 arrow function: instead of function (posts) we put posts => - vantagem é q
        //não muda o valor de this p o obj
    }

    keyPressDispatcher(e) {
        //console.log(e.keyCode);
        if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {//código  da tecla S
            //terceira condição: se não houver um campo para pesquisar; não temos no nosso caso
            this.openOverlay();
        }

        if (e.keyCode == 27 && this.isOverlayOpen) {//código  da tecla esc
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.searchField.val('');
        setTimeout(() => this.searchField.focus(), 301);//arrow function; one line: no need for {  ;}
        console.log("our open method just ran");
        this.isOverlayOpen = true;
        return false;
    }

    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        console.log("our close method just ran");
        this.isOverlayOpen = false;
    }

    addSearchHTML() {
        $("body").append(`
            <div class="search-overlay">
                <div class="search-overlay__top">
                  <div class="container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden='true'></i>
                    <input type="text" class="search-term" id="search-term" placeholder="O que você está procurando?">
                    <i class="fa fa-window-close search-overlay__close" aria-hidden='true'></i>
                  </div>
                </div>
                <div class="container">
                  <div id="search-overlay__results"></div>
                </div>
            </div>
        `);
    }
}

export default Search;
