const cardSubmitBtn = document.getElementById("card-submit");
const cardResetBtn = document.getElementById("card-reset");
const cardUpdateBtn = document.getElementById("card-update");

const DiscountCardUIManager = {
    prepareForm() {
        const customers = CustomersHandler.getAllCustomers();
        let selectCustomer = document.getElementById("customer");
        selectCustomer.innerHTML = "";
        //selectCustomer.innerHTML = `<option value="" selected disabled hidden></option>`;

        for (const customer of customers) {


            let option = document.createElement("option");
            option.value = customer.email;
            option.innerText = `${customer.name} (${customer.email})`;
            selectCustomer.appendChild(option);
        }

        MiscUIManager.setFilterDateRange("date");
        (document.getElementById("accumulation")).checked = false;
    },

    createDiscountCard() {
        let customer = (document.getElementById("customer")).value;
        let category = (document.getElementById("category")).value;
        let accumulation = (document.getElementById("accumulation")).checked;
        let discount = (document.getElementById("discount")).value;
        let date = (document.getElementById("date")).value;

        if ((new Date()) > (new Date(date))) {
            MiscUIManager.showInfoMessage("Expiration date cannot be a past or present date. Card not created.");
            return;
        }

        let cardCode = CodeGenerator(category, accumulation, discount, date);

        if (!DiscountCardsHandler.createDiscountCard(new CardDto(customer, cardCode))) {
            MiscUIManager.showInfoMessage(`Customer ${customer} has the maximum number of discount cards and therefore cannot have a new one. Card not created.`);
        } else {
            MiscUIManager.showInfoMessage(`Card for ${customer} successfully created.`);
        }

        CustomerUIManager.displayAllCustomers();
        this.displayAllCards();
        this.resetForm();
    },

    resetForm() {
        (document.getElementById("customer")).firstElementChild.selected = true;
        (document.getElementById("category")).firstElementChild.selected = true;
        (document.getElementById("accumulation")).checked = false;
        (document.getElementById("discount")).firstElementChild.selected = true;

        MiscUIManager.setFilterDateRange("date");
    },

    displayAllCards() {
        let Cards = DiscountCardsHandler.getAllDiscountCards();
        this.displayCards(Cards);
    },

    displayCards(_cardsArray) { // reusable method that we can call with any applied filters
        let cardsContainer = document.getElementById("cards-list");
        cardsContainer.innerHTML = "";

        for (let card of _cardsArray) {
            let customer = CustomersHandler.getCustomer(card.customerEmail);
            let currentContainer = document.createElement("div");
            currentContainer.setAttribute("class", "card-wrapper");

            let infoString = `<h4>Card ${card.cardCode} belonging to ${customer.name} from ${customer.city}</h4><p>Card Information: Category: ${card.codeInfo.category} | Accumulation: ${card.codeInfo.accumulation} | Discount: ${card.codeInfo.discount} | Expiration Date: ${card.codeInfo.date}</p>`;

            currentContainer.innerHTML += infoString;

            let cardBtnWrapper = document.createElement("div");
            let editBtn = document.createElement("button");
            let deleteBtn = document.createElement("button");
            let extendExpirationDateBtn = document.createElement("button");

            cardBtnWrapper.setAttribute("class", "card-buttons-wrapper");
            cardBtnWrapper.setAttribute("id", `${card.id}`);

            editBtn.setAttribute("class", "card-edit");
            deleteBtn.setAttribute("class", "card-delete");
            extendExpirationDateBtn.setAttribute("class", "card-set-expiration-date");

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Delete";
            extendExpirationDateBtn.innerText = "Extend Expiration Date";

            cardBtnWrapper.appendChild(editBtn);
            cardBtnWrapper.appendChild(deleteBtn);
            cardBtnWrapper.appendChild(extendExpirationDateBtn);

            currentContainer.appendChild(cardBtnWrapper);
            cardsContainer.appendChild(currentContainer);

            editBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let id = (editBtn.parentElement).id;
                let card = DiscountCardsHandler.getCard(id);

                document.getElementById("customer").value = card.customerEmail;
                document.getElementById("category").value = Object.keys(DISCOUNT_TYPE).find(key => DISCOUNT_TYPE[key] === card.codeInfo.category);
                document.getElementById("accumulation").checked = card.codeInfo.accumulation == "Yes" ? true : false;
                document.getElementById("discount").value = (card.cardCode).slice(2, 4);
                document.getElementById("date").value = card.codeInfo.date;

                cardUpdateBtn.name = card.id;

                MiscUIManager.toggleEntityButtonVisibility("card", BUTTONS_VISIBILITY.update);
            });

            deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let id = (deleteBtn.parentElement).id;
                this.deleteCard(id);
            });

            extendExpirationDateBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let id = (extendExpirationDateBtn.parentElement).id;
                this.extendExpirationDate(id);

            });
        }
    },

    updateCard(_id) {

        let customer = (document.getElementById("customer")).value;
        let category = (document.getElementById("category")).value;
        let accumulation = (document.getElementById("accumulation")).checked;
        let discount = (document.getElementById("discount")).value;
        let date = (document.getElementById("date")).value;

        if ((new Date()) > (new Date(date))) {
            MiscUIManager.showInfoMessage("Expiration date cannot be a past or present date. Card not created.");
            return;
        }

        let cardCode =CodeGenerator(category, accumulation, discount, date);

        if (!DiscountCardsHandler.updateCard(new CardDto(customer, cardCode), _id)) {
            MiscUIManager.showInfoMessage("A customer is not allowed to have more than four discount cards. Update not successful.");
        } else {
            MiscUIManager.showInfoMessage("Card successfully updated.");
        }

        this.resetForm();
        this.displayAllCards();
        CustomerUIManager.displayAllCustomers();

        MiscUIManager.toggleEntityButtonVisibility("card", BUTTONS_VISIBILITY.create);
    },

    deleteCard(_id) {
        DiscountCardsHandler.deleteCard(_id);
        this.displayAllCards();
        CustomerUIManager.displayAllCustomers();
        MiscUIManager.showInfoMessage("Card successfully deleted.");
    },

    extendExpirationDate(_id) { // extends the expiration date of the card by a year

        let card = DiscountCardsHandler.getCard(_id);
        let newYear = (parseInt((card.cardCode).slice(8)) + 1).toString();
        let newCode = (card.cardCode).slice(0, 8) + newYear;

        if (!confirm("Do you want to extend the validity of your card with one year?") || newYear > 99) {
            return;
        } else {
            MiscUIManager.showInfoMessage("Card expiration date extended with one year.");
        }

        DiscountCardsHandler.updateCard(new CardDto(card.customerEmail, newCode), _id);
        this.displayAllCards();
    },

    renewCards() {
        let Cards = DiscountCardsHandler.getAllDiscountCards();
        let warningDate = new Date();
        warningDate = warningDate.setDate(warningDate.getDate() + 10);

        for (let card of Cards) {
            if ((new Date(card.codeInfo.date)) < (new Date())) {
                if (confirm(`Card ${card.id} is expired. If you do not renew it it's going to be deleted. Would you like to renew it?`)) {
                    DiscountCardsHandler.renewCard(card.id);
                    MiscUIManager.showInfoMessage(`Card ${card.id} is renewd with a expiration date one year from now.`);
                } else {
                    DiscountCardsHandler.deleteCard(card.id);
                    MiscUIManager.showInfoMessage(`Card ${card.id} is deleted.`);
                }

                DiscountCardUIManager.displayAllCards();
                CustomerUIManager.displayAllCustomers();
            } else if (warningDate > (new Date(card.codeInfo.date))) {
                if (confirm(`Card ${card.id} is about to expire soon. Would you like to renew it now?`)) {
                    DiscountCardsHandler.renewCard(card.id);

                    DiscountCardUIManager.displayAllCards();
                    CustomerUIManager.displayAllCustomers();

                    MiscUIManager.showInfoMessage(`Card ${card.id} is renewed with an expiration date one year from now.`);
                }
            }
        }
    }

};

cardSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    DiscountCardUIManager.createDiscountCard();
});

cardUpdateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    DiscountCardUIManager.updateCard(cardUpdateBtn.name);
});

cardResetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    MiscUIManager.toggleEntityButtonVisibility("card", BUTTONS_VISIBILITY.create);
    DiscountCardUIManager.resetForm();
});