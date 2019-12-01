window.onload = () => {
    CustomerUIManager.displayAllCustomers();
    DiscountCardUIManager.prepareForm();
    DiscountCardUIManager.displayAllCards();
    MiscUIManager.setView(VIEW_MODE.customers);
    // MiscUIManager.setView(VIEW_MODE.cards);
    //DiscountCardUIManager.renewCards();
    MiscUIManager.showInfoMessage("some message");
};