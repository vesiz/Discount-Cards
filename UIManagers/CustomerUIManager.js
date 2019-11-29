const customerSubmitBtn = document.getElementById("customer-submit");
const customerResetBtn = document.getElementById("customer-reset");
const customerUpdateBtn = document.getElementById("customer-update");

const CustomerUIManager = {
    createCustomer() {
        let name = (document.getElementById("name")).value;
        let email = (document.getElementById("email")).value;
        let city = (document.getElementById("city")).value;

        if (name == "" || email == "" || city == "") {
            alert("Please fill all of the fields.");
            return;
        }

        if (!CustomersHandler.createCustomer(new CustomerDto(name, email, city))) {
            alert("A customer with this email already exists. Please provide another email address.");
        } else {
            //alert("Customer successfully created.");
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
                console.log(DiscountCardsHandler.getCard(card));
                infoString += `<li>${DiscountCardsHandler.getCardInfo(card)}</li>`;
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

        let name = document.getElementById("name").value;
        let email =  document.getElementById("email").value;
        let city = document.getElementById("city").value;

        if (!CustomersHandler.updateCustomer(new CustomerDto(name, email, city), _email)) {
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

customerSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    CustomerUIManager.createCustomer();
});

customerUpdateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    CustomerUIManager.updateCustomer(customerUpdateBtn.name);
});

customerResetBtn.addEventListener("click", () => {
    MiscUIManager.toggleEntityButtonVisibility("customer", BUTTONS_VISIBILITY.create);
});
