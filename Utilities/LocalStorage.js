const CARD_ID = "idCounter";
const CUSTOMERS_KEY = "customers";
const CARDS_KEY = "discountCards";

const LocalStorage = {

    setCustomers(_customersArray){
        let customersString = JSON.stringify(_customersArray);
        localStorage.setItem(CUSTOMERS_KEY, customersString);
    },

    getCustomers() {
        if(!localStorage.hasOwnProperty(CUSTOMERS_KEY)){
            return JSON.parse("[]");
        }

        return JSON.parse(localStorage.getItem(CUSTOMERS_KEY));
    },

    deleteAllCustomers(){
        localStorage.setItem(CUSTOMERS_KEY, "[]");
        this.deleteAllCards();
    },

    setCards(_cardsArray) {
        let cardsString = JSON.stringify(_cardsArray);
        localStorage.setItem(CARDS_KEY, cardsString);
    },

    getCards() {
        if(!localStorage.hasOwnProperty(CARDS_KEY)){
            return JSON.parse("[]");
        }
        return JSON.parse(localStorage.getItem(CARDS_KEY));
    },

    deleteAllCards(){
        localStorage.setItem(CARDS_KEY, "[]");
    },

    updateCounter(){
        let count;

        if(!localStorage.getItem(CARD_ID)) count = 1;
        else count = parseInt(localStorage.getItem(CARD_ID)) + 1;

        localStorage.setItem(CARD_ID, count);
        return count;
    },

    restartCounter(){
        localStorage.removeItem(CARD_ID);
    }
};


