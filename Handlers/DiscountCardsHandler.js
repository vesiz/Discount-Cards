const DiscountCardsHandler = { // handles discount cards creation/manipulation/deletion logic
    createDiscountCard(_cardDto) {
        let DiscountCards = LocalStorage.getCards();
        let discountCard = new DiscountCard(_cardDto.customer, _cardDto.cardCode);
        let customer = CustomersHandler.getCustomer(_cardDto.customer);


        if ((customer.discountCards).length >= 4) {
            return false;
        }

        DiscountCards.push(discountCard);
        CustomersHandler.addDiscountCardToCustomer(_cardDto.customer, discountCard.id);

        LocalStorage.setCards(DiscountCards);
        return true;
    },

    getAllDiscountCards() {
        let DiscountCards = LocalStorage.getCards();
        return DiscountCards;
    },

    getCard(_id) {
        let Cards = LocalStorage.getCards();
        return Cards.find((element) => element.id == _id);
    },

    updateCard(_cardDto, _id) {
        let Cards = LocalStorage.getCards();
        let card = Cards.find((element) => element.id == _id);

        (Cards[Cards.indexOf(card)]).cardCode = _cardDto.cardCode;
        (Cards[Cards.indexOf(card)]).codeInfo = new CodeInfo(_cardDto.cardCode);

        if (card.customerEmail != _cardDto.customer) {

            if (CustomersHandler.permissionToCreateCard(_cardDto.customer)) {
                CustomersHandler.removeCardFromCustomer(card.customerEmail, card.id); //remove card from old user
                CustomersHandler.addDiscountCardToCustomer(_cardDto.customer, card.id); // assign it to a new user

                this.updateCardOwner(card.id, _cardDto.customer);
            } else {
                // alert("A customer is not allowed to have more than four discount cards. Update not successful"); 
                return false;
            }
        } else {
            LocalStorage.setCards(Cards);
        }
        return true;
    },

    updateCardOwner(_id, _newOwner) {
        let Cards = LocalStorage.getCards();
        let card = Cards.find((element) => element.id == _id);

        (Cards[Cards.indexOf(card)]).customerEmail = _newOwner;
        LocalStorage.setCards(Cards);

    },

    deleteCard(_id) {
        let Cards = LocalStorage.getCards();
        let card = Cards.find((element) => element.id == _id);

        Cards.splice(Cards.indexOf(card), 1);
        CustomersHandler.removeCardFromCustomer(card.customerEmail, card.id);
        LocalStorage.setCards(Cards);
    },

    renewCard(_id) { // renews an expired card and gives it an expiration date of 1 year more than it's original expiration date 
        let card = this.getCard(_id);
        let newCode = card.cardCode.substring(0, 8) + (parseInt(card.cardCode.substring(8)) + 1).toString();

        this.deleteCard(_id);
        this.createDiscountCard(new CardDto(card.customerEmail, newCode));
    },

    getCardInfo(_id) {
        let card = this.getCard(_id);
        return `<b>${card.cardCode}</b>: ${card.codeInfo.discount} discount for ${card.codeInfo.category}, valid before ${card.codeInfo.date}`;
    }

};