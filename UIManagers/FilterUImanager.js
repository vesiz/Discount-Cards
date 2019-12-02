const resetFilterPreferencesBtn = document.getElementById("filter-reset");

const FilterUIManager = {
    getFilterSettings() {
        CURRENT_FILTER_SETTINGS.searchInput = document.querySelector("#search-input > input").value;

        var searchRadios = document.getElementsByName("search");
        for (let radio of searchRadios) {
            if (radio.checked) CURRENT_FILTER_SETTINGS.searchByConstraint = radio.value;
        }

        CURRENT_FILTER_SETTINGS.orderByConstraint = document.getElementById("order-by-options").value;
        CURRENT_FILTER_SETTINGS.orderByOrder = (document.getElementsByName("order-by")[1]).checked ? ORDER_BY_ORDER.desc : ORDER_BY_ORDER.asc;
        CURRENT_FILTER_SETTINGS.discountType = document.getElementById("filter-category").value;
        CURRENT_FILTER_SETTINGS.discountPercentage = document.getElementById("filter-discount").value;
        CURRENT_FILTER_SETTINGS.expirationDate = document.getElementById("filter-date").value;
    },

    filter() {
        let Cards = DiscountCardsHandler.getAllDiscountCards();
        let Customers = CustomersHandler.getAllCustomers();
        this.getFilterSettings();

        Cards = this.filterBySearchInput(Cards, Customers);
        Cards = this.filterByDiscountCategory(Cards);
        Cards = this.filterByDiscountPercent(Cards);
        Cards = this.filterByExpirationDate(Cards);
        Cards = this.sortCards(Cards, Customers);

        DiscountCardUIManager.displayCards(Cards);
    },

    switchCards(_a, _b) {
        if (CURRENT_FILTER_SETTINGS.orderByOrder == ORDER_BY_ORDER.asc) {
            if (_a < _b) return -1;
            if (_a > _b) return 1;
            else return 0;
        } else if (CURRENT_FILTER_SETTINGS.orderByOrder == ORDER_BY_ORDER.desc) {
            if (_a > _b) return -1;
            if (_a < _b) return 1;
            else return 0;
        }
    },

    sortCards(_cards, _customers) {
        switch (CURRENT_FILTER_SETTINGS.orderByConstraint) {
            case ORDER_SEARCH_OPTIONS.name:
                _cards.sort((a, b) => {
                    let nameA = (_customers.find(element => element.email == a.customerEmail)).name;
                    let nameB = (_customers.find(element => element.email == b.customerEmail)).name;

                    return this.switchCards(nameA, nameB);
                });
                break;
            case ORDER_SEARCH_OPTIONS.city:
                _cards.sort((a, b) => {
                    let cityA = (_customers.find(element => element.email == a.customerEmail)).city;
                    let cityB = (_customers.find(element => element.email == b.customerEmail)).city;

                    return this.switchCards(cityA, cityB);
                });
                break;
            case ORDER_SEARCH_OPTIONS.card_number:
                _cards.sort((a, b) => {
                    return this.switchCards(a.cardCode, b.cardCode);
                });
                break;
        }

        return _cards;
    },

    filterByDiscountCategory(_cards) {
        let filteredCards = [];
        for (let card of _cards) {
            let currentCardType = card.codeInfo.category;
            let currentChosenType = document.getElementById("filter-category").value;

            if (currentChosenType == currentCardType) filteredCards.push(card);
        }

        if (CURRENT_FILTER_SETTINGS.discountType == null || CURRENT_FILTER_SETTINGS.discountType == "") return _cards;

        return filteredCards;
    },

    filterByDiscountPercent(_cards) {
        let filteredCards = [];

        for (let card of _cards) {
            let currentCardDiscount = parseInt(card.codeInfo.discount.substring(0, card.codeInfo.discount.length - 1));
            let currentChosenDiscount = parseInt(CURRENT_FILTER_SETTINGS.discountPercentage);

            if (currentCardDiscount == currentChosenDiscount) filteredCards.push(card);
        }

        if (CURRENT_FILTER_SETTINGS.discountPercentage == null || CURRENT_FILTER_SETTINGS.discountPercentage == "") return _cards;

        return filteredCards;
    },

    filterByExpirationDate(_cards) {

        if ((new Date(document.getElementById("filter-date").value)) < (new Date())) {
            MiscUIManager.showInfoMessage("You cannot filter through past dates. Expiration date set to today's date.");
            MiscUIManager.setFilterDateRange("filter-date");
            return _cards;
        }

        let filteredCards = [];

        for (let card of _cards) {
            let currentExpirationDate = new Date(card.codeInfo.date);
            let currentChosenExpirationDate = new Date(CURRENT_FILTER_SETTINGS.expirationDate);

            if (currentExpirationDate < currentChosenExpirationDate) filteredCards.push(card);
        }

        if (CURRENT_FILTER_SETTINGS.expirationDate == null || CURRENT_FILTER_SETTINGS.expirationDate == "") return _cards;

        return filteredCards;
    },

    filterBySearchInput(_cards, _customers) {
        let filteredCards = [];
        let currentInput = (CURRENT_FILTER_SETTINGS.searchInput).replace(/^\s+|\s+$|\s+(?=\s)/g, "").toLowerCase();

        if (currentInput == "") return _cards;

        switch (CURRENT_FILTER_SETTINGS.searchByConstraint) {
            case (ORDER_SEARCH_OPTIONS.name):
                for (let card of _cards) {
                    let name = ((_customers.find((element) => element.email == card.customerEmail)).name).toLowerCase();
                    if (name.includes(currentInput)) filteredCards.push(card);
                }
                break;
            case (ORDER_SEARCH_OPTIONS.city):
                for (let card of _cards) {
                    let city = ((_customers.find((element) => element.email == card.customerEmail)).city).toLowerCase();
                    if (city.includes(currentInput)) filteredCards.push(card);
                }
                break;
            case (ORDER_SEARCH_OPTIONS.card_number):
                for (let card of _cards) {
                    let cardNumber = card.cardCode;
                    if (cardNumber.includes(currentInput)) filteredCards.push(card);
                }
                break;
            default:
                for (let card of _cards) {
                    let name = ((_customers.find((element) => element.email == card.customerEmail)).name).toLowerCase();
                    let city = ((_customers.find((element) => element.email == card.customerEmail)).city).toLowerCase();
                    let cardNumber = card.cardCode;

                    if (name.includes(currentInput) || city.includes(currentInput) || cardNumber.includes(currentInput)) filteredCards.push(card);
                }
                break;
        }

        return filteredCards;
    },

    resetFilterPreferences() {
        document.querySelector("#search-input > input").value = "";
        document.getElementById("order-by-options").value = "";
        (document.getElementsByName("order-by")[0]).checked = false;
        (document.getElementsByName("order-by")[1]).checked = false;
        document.getElementById("filter-category").value = "";
        document.getElementById("filter-discount").value = "";
        document.getElementById("filter-date").value = "";

        CURRENT_FILTER_SETTINGS.searchInput = "";
        CURRENT_FILTER_SETTINGS.searchByConstraint = "";
        CURRENT_FILTER_SETTINGS.orderByConstraint = "";
        CURRENT_FILTER_SETTINGS.orderByOrder = ORDER_BY_ORDER.asc;
        CURRENT_FILTER_SETTINGS.discountType = "";
        CURRENT_FILTER_SETTINGS.discountPercentage = "";
        CURRENT_FILTER_SETTINGS.expirationDate = "";

        this.filter();
    }
};


resetFilterPreferencesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    FilterUIManager.resetFilterPreferences();
});
