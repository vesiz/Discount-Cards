const customerSubmitBtn = document.getElementById("customer-submit");
const customerResetBtn = document.getElementById("customer-reset");
const customerUpdateBtn = document.getElementById("customer-update");

const cardSubmitBtn = document.getElementById("card-submit");
const cardResetBtn = document.getElementById("card-reset");
const cardUpdateBtn = document.getElementById("card-update");

const CustomerUIManager = {
    createCustomer() {
        let name = (document.getElementById("name")).value;
        let email = (document.getElementById("email")).value;
        let city = (document.getElementById("city")).value;

        if (name == "" || email == "" || city == "") {
            alert("Please fill all of the fields.");
            return;
        }

        let customerDto = {
            name,
            email,
            city
        };

        if (!CustomersHandler.createCustomer(customerDto)) {
            alert("A customer with this email already exists. Please provide another email address.");
        } else {
            alert("Customer successfully created.");
            this.resetForm();
        }

        this.displayAllCustomers();
        DiscountCardUIManager.prepareForm();
    },

    displayAllCustomers() {
        let Customers = CustomersHandler.getAllCustomers();
        let customersContainer = document.getElementById("customers-list");
        customersContainer.innerHTML = "";

        for (let customer of Customers) {
            let currentContainer = document.createElement("div");
            currentContainer.setAttribute("class", "customer-wrapper");

            let infoString = `<h4>${customer.name}</h4><span> Email address: ${customer.email} | City: ${customer.city} | Discount Cards:</span><ul>`;
            for (let card of customer.discountCards) {
                infoString += `<li>${card}</li>`;
            }

            infoString += `</ul>`;
            currentContainer.innerHTML += infoString;

            let customerBtnWrapper = document.createElement("div");
            let editBtn = document.createElement("button");
            let deleteBtn = document.createElement("button");
            let addCardBtn = document.createElement("button");

            customerBtnWrapper.setAttribute("class", "customer-buttons-wrapper");
            customerBtnWrapper.setAttribute("id", `${customer.email}`);

            editBtn.setAttribute("class", "customer-edit");
            deleteBtn.setAttribute("class", "customer-delete");
            addCardBtn.setAttribute("class", "customer-add-card");

            editBtn.innerText = "Edit";
            deleteBtn.innerText = "Delete";
            addCardBtn.innerText = "Add Card";

            customerBtnWrapper.appendChild(editBtn);
            customerBtnWrapper.appendChild(deleteBtn);

            if ((customer.discountCards).length < 4) {
                customerBtnWrapper.appendChild(addCardBtn);
            }

            currentContainer.appendChild(customerBtnWrapper);
            customersContainer.appendChild(currentContainer);

            deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let email = (deleteBtn.parentElement).id;
                this.deleteCustomer(email);
            });

            editBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let email = (editBtn.parentElement).id;
                let customer = CustomersHandler.getCustomer(email);

                document.getElementById("name").value = customer.name;
                document.getElementById("email").value = customer.email;
                document.getElementById("city").value = customer.city;

                customerUpdateBtn.name = customer.email;

                MiscUIManager.toggleEntityButtonVisibility("customer", BUTTONS_VISIBILITY.update);
            });

            addCardBtn.addEventListener("click", (e) => {
                let email = (addCardBtn.parentElement).id;
                this.addCardToCustomer(email);
            });
        }
    },

    deleteCustomer(_email) {
        CustomersHandler.deleteCustomer(_email);
        this.displayAllCustomers();
        DiscountCardUIManager.prepareForm();
        DiscountCardUIManager.displayAllCards();
    },

    updateCustomer(_email) {
        let customerDto = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            city: document.getElementById("city").value
        };

        if (!CustomersHandler.updateCustomer(customerDto, _email)) {
            alert("You cannot give this user an email that is already assigned to another user. Please enter another email.");
            return;
        }

        MiscUIManager.toggleEntityButtonVisibility("customer", BUTTONS_VISIBILITY.create);
        this.resetForm();
        this.displayAllCustomers();
        DiscountCardUIManager.displayAllCards();
        DiscountCardUIManager.prepareForm();
        customerUpdateBtn.name = "";
    },

    resetForm() {
        (document.getElementById("name")).value = "";
        (document.getElementById("email")).value = "";
        (document.getElementById("city")).value = "";
    },

    addCardToCustomer(_email) { // this just redirects the user to the card form with preselected choise for customer
        let customer = CustomersHandler.getCustomer(_email);
        (document.getElementById("customer")).value = customer.email;
    }
};

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

        let currentDate = new Date();
        let datepicker = document.getElementById("date");
        datepicker.min = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        datepicker.max = "2099-12-31";
        datepicker.value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

        //(document.getElementById("accumulation")).removeAttribute("checked");
        (document.getElementById("accumulation")).checked = false;

    },

    createDiscountCard() {
        let customer = (document.getElementById("customer")).value;
        let category = (document.getElementById("category")).value;
        let accumulation = (document.getElementById("accumulation")).checked;
        let discount = (document.getElementById("discount")).value;
        let date = (document.getElementById("date")).value;

        if ((new Date()) > (new Date(date))) {
            alert("Expiration date cannot be a past or present date. Card not created.");
            return;
        }

        let cardCode = (new CodeGenerator(category, accumulation, discount, date)).code;

        let cardDto = {
            customer,
            cardCode
        };

        if (!DiscountCardsHandler.createDiscountCard(cardDto)) {
            alert("This customer has the maximum number of discount cards and therefore cannot have a new one. Card not created.");
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
        let currentDate = new Date();
        (document.getElementById("date")).value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
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
            alert("Expiration date cannot be a past or present date. Card not created.");
            return;
        }

        let cardCode = (new CodeGenerator(category, accumulation, discount, date)).code;

        let cardDto = {
            customer,
            cardCode
        };

        DiscountCardsHandler.updateCard(cardDto, _id);
        this.resetForm();
        this.displayAllCards();
        CustomerUIManager.displayAllCustomers();

        MiscUIManager.toggleEntityButtonVisibility("card", BUTTONS_VISIBILITY.create);
    },

    deleteCard(_id) {
        DiscountCardsHandler.deleteCard(_id);
        this.displayAllCards();
        CustomerUIManager.displayAllCustomers();
    },

    extendExpirationDate(_id) { // extends the expiration date of the card by a year

        let card = DiscountCardsHandler.getCard(_id);
        let newYear = (parseInt((card.cardCode).slice(8)) + 1).toString();
        let newCode = (card.cardCode).slice(0, 8) + newYear;

        if (!confirm("Do you want to renew your card for one year?") || newYear > 99) {
            return;
        }

        let cardDto = {
            customer: card.customerEmail,
            cardCode: newCode
        };

        DiscountCardsHandler.updateCard(cardDto, _id);
        this.displayAllCards();
    }

};

const MiscUIManager = {
    toggleEntityButtonVisibility(_type, _mode) {
        if (_mode == BUTTONS_VISIBILITY.create) {
            document.getElementById(`${_type}-submit`).style.display = "inline";
            document.getElementById(`${_type}-reset`).style.display = "inline";
            document.getElementById(`${_type}-update`).style.display = "none";

        } else if (_mode == BUTTONS_VISIBILITY.update) {
            document.getElementById(`${_type}-submit`).style.display = "none";
            document.getElementById(`${_type}-reset`).style.display = "none";
            document.getElementById(`${_type}-update`).style.display = "inline";
        }
    }
};


window.onload = () => {
    CustomerUIManager.displayAllCustomers();
    DiscountCardUIManager.prepareForm();
    DiscountCardUIManager.displayAllCards();
};

customerSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    CustomerUIManager.createCustomer();
});

customerUpdateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    CustomerUIManager.updateCustomer(customerUpdateBtn.name);
});

cardSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    DiscountCardUIManager.createDiscountCard();
});

cardUpdateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    DiscountCardUIManager.updateCard(cardUpdateBtn.name);
});