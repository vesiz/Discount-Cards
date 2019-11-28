const DiscountCardsHandler = {
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

        for (const card of Cards) {
            if (card.id == _id) {
                return card;
            }
        }

    },

    updateCard(_cardDto, _id) {
        let Cards = LocalStorage.getCards();
        let card;

        for (let item of Cards) {
            if (item.id == _id) {
                card = item;
                break;
            }
        }

        (Cards[Cards.indexOf(card)]).cardCode = _cardDto.cardCode;
        (Cards[Cards.indexOf(card)]).codeInfo = new CodeInfo(_cardDto.cardCode);

        if (card.customerEmail != _cardDto.customer) {

            if (CustomersHandler.permissionToCreateCard(_cardDto.customer)) {
                CustomersHandler.removeCardFromCustomer(card.customerEmail, card.id); //remove card from old user
                CustomersHandler.addDiscountCardToCustomer(_cardDto.customer, card.id); // assign it to a new user
                LocalStorage.setCards(Cards);
            } else {
                alert("A customer is not allowed to have more than four discount cards. Update not successful");
            }
        } else {
            LocalStorage.setCards(Cards);
        }
    },

    updateCardOwner(_id, _newOwner) {
        let Cards = LocalStorage.getCards();

        for (let card of Cards) {
            if (card.id == _id) {
                (Cards[Cards.indexOf(card)]).customerEmail = _newOwner;

                break;
            }
        }

        LocalStorage.setCards(Cards);
    },

    deleteCard(_id) {
        let Cards = LocalStorage.getCards();

        for (const card of Cards) {
            if (card.id == _id) {
                Cards.splice(Cards.indexOf(card), 1);
                CustomersHandler.removeCardFromCustomer(card.customerEmail, card.id);
                break;
            }
        }

        LocalStorage.setCards(Cards);
    },

    getCardInfo() {
        // shte se razpisva
        // basically za izvejdane na info kato vizualizirame karti na customer-i
    }

};