const CustomersHandler = { // handles customer data creation/manipulation/deletion logic
    createCustomer(_customerDto) {
        let Customers = LocalStorage.getCustomers();

        for (const customer of Customers) {
            if (customer.email == _customerDto.email) {
                return false;
            }
        }

        Customers.push(new Customer(_customerDto.name, _customerDto.email, _customerDto.city));
        LocalStorage.setCustomers(Customers);

        return true;
    },

    getCustomer(_email) {
        let Customers = LocalStorage.getCustomers();
        return Customers.find(item => item.email == _email);
    },

    getAllCustomers() {
        let Customers = LocalStorage.getCustomers();
        return Customers;

    },

    deleteCustomer(_email) {
        let Customers = LocalStorage.getCustomers();
        let customer = Customers.find(item => item.email == _email);

        Customers.splice(Customers.indexOf(customer), 1);

        for (let card of customer.discountCards) {
            DiscountCardsHandler.deleteCard(card);
        }

        LocalStorage.setCustomers(Customers);
        return customer.name;
    },

    updateCustomer(_customerDto, _email) {
        let Customers = LocalStorage.getCustomers();
        let currentCustomer = Customers.find(item => item.email == _email);

        //cannot assign new email to user when there's already another user with the same email 
        for (const customer of Customers) {
            if (customer.email == _customerDto.email && customer.email != _email) {
                return false;
            }
        }

        if (currentCustomer.email != _customerDto.email) {
            let Cards = DiscountCardsHandler.getAllDiscountCards();

            for (let card of Cards) {
                if (card.customerEmail == currentCustomer.email) { // checks if the card's owner needs to be updated (checks it with the customer before it's updated and there is a match it changes the card's owner)
                    DiscountCardsHandler.updateCardOwner(card.id, _customerDto.email);
                }
            }
        }

        (Customers[Customers.indexOf(currentCustomer)]).name = _customerDto.name;
        (Customers[Customers.indexOf(currentCustomer)]).email = _customerDto.email;
        (Customers[Customers.indexOf(currentCustomer)]).city = _customerDto.city;

        LocalStorage.setCustomers(Customers);
        return true;
    },

    addDiscountCardToCustomer(_email, _cardId) {
        let Customers = this.getAllCustomers();

        for (let customer of Customers) {
            if (customer.email == _email && (customer.discountCards).length < 4) {
                (customer.discountCards).push(_cardId);
                LocalStorage.setCustomers(Customers);
                return true;
            }
        }

        return false; //for info message purposes
    },

    removeCardFromCustomer(_customerEmail, _cardId) {
        let Customers = this.getAllCustomers();

        for (let customer of Customers) {
            if (customer.email == _customerEmail) {
                (customer.discountCards).splice((customer.discountCards).indexOf(_cardId), 1);
                LocalStorage.setCustomers(Customers);
            }
        }
    },

    permissionToCreateCard(_email) {
        let customer = this.getCustomer(_email);
        if ((customer.discountCards).length >= 4) {
            return false;
        }

        return true;
    }
};