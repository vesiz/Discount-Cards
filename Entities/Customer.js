class Customer {
    constructor(_name,_email, _city){
        this.name = _name;
        this.email = _email; // id
        this.city = _city;
        this.discountCards = [];
    }

    /*addDiscountCard(_cardId) {
        if(this.discountCards.length < 4){
            this.discountCards.push(_cardId);
            return true;
        }

        return false; // for info message purposes
    }*/
}

