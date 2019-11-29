window.onload = () => {
    CustomerUIManager.displayAllCustomers();
    DiscountCardUIManager.prepareForm();
    DiscountCardUIManager.displayAllCards();
    MiscUIManager.setView(VIEW_MODE.cards);
    //DiscountCardUIManager.renewCards();
};
