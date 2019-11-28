class DiscountCard {
    constructor(_customerEmail, _cardCode){
        this.id = LocalStorage.updateCounter();
        this.customerEmail = _customerEmail;
        this.cardCode = _cardCode;
        this.codeInfo = new CodeInfo(_cardCode);
    }
}

