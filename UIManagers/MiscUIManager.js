const manageCustomersBtn = document.getElementById("manage-customers");
const manageCardsBtn = document.getElementById("manage-cards");

const MiscUIManager = {
    toggleEntityButtonVisibility(_type, _mode) {
        if (_mode == BUTTONS_VISIBILITY.create) {
            document.getElementById(`${_type}-submit`).style.display = "inline";
            document.getElementById(`${_type}-update`).style.display = "none";
            document.getElementById(`${_type}-reset`).value = "Reset";

        } else if (_mode == BUTTONS_VISIBILITY.update) {
            document.getElementById(`${_type}-submit`).style.display = "none";
            document.getElementById(`${_type}-update`).style.display = "inline";
            document.getElementById(`${_type}-reset`).value = "Cancel";
        }
    },

    setFilterDateRange(_datepicker) {
        let currentDate = new Date();
        let datepicker = document.getElementById(_datepicker);
        datepicker.min = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        datepicker.max = "2099-12-31";
        datepicker.value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    },

    setView(_mode) {
        switch (_mode) {
            case ("customers"):
                (document.getElementById("customers-view")).style.display = "block";
                (document.getElementById("cards-view")).style.display = "none";
                break;
            case ("cards"):
                (document.getElementById("customers-view")).style.display = "none";
                (document.getElementById("cards-view")).style.display = "block";
                break;
        }
    }, 

    showInfoMessage(_message){
        // /document.getElementById("info-message").style.display = "block";
        document.getElementById("info-message").setAttribute("class", "visible");

        setTimeout(() => {
            //document.getElementById("info-message").style.display = "none";
            document.getElementById("info-message").setAttribute("class", "hidden");
        }, 2000);
    }
};