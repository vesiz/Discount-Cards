window.onload = () => {
    CustomerUIManager.displayAllCustomers();
    DiscountCardUIManager.prepareForm();
    DiscountCardUIManager.displayAllCards();
    MiscUIManager.setView(VIEW_MODE.cards);

    setTimeout(() => {
        DiscountCardUIManager.checkCardsForRenewal();
    }, 1000);
};