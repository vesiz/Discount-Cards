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
        let date = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
        datepicker.min = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date}`;
        datepicker.max = "2099-12-31";
        datepicker.value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date}`;
    },

    setView(_mode) {
        switch (_mode) {
            case ("customers"):
                (document.getElementById("customers-view")).style.display = "flex";
                (document.getElementById("cards-view")).style.display = "none";
                break;
            case ("cards"):
                (document.getElementById("customers-view")).style.display = "none";
                (document.getElementById("cards-view")).style.display = "flex";
                break;
        }
    },

    showInfoMessage(_message) {
        document.getElementById("info-message").setAttribute("class", "visible");
        document.getElementById("info-message").innerText = _message;

        setTimeout(() => {
            document.getElementById("info-message").setAttribute("class", "hidden");
        }, 2000);
    }
};